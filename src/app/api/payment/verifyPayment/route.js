import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import paymentModels from "@/models/paymentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();

    console.log("Verifying payment... started");
    /* ---------------- AUTH ---------------- */
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId).select(
      "fullName email"
    );

    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    /* ---------------- REQUEST DATA ---------------- */
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !paymentId
    ) {
      return NextResponse.json(
        { message: "Payment verification details missing", success: false },
        { status: 400 }
      );
    }

    /* ---------------- PAYMENT RECORD ---------------- */
    const payment = await paymentModels.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment record not found", success: false },
        { status: 404 }
      );
    }

    /* ---------------- SIGNATURE VERIFY ---------------- */
    const generatedSignature = crypto
  .createHmac("sha256", "8tqbuZO9WCk2QIGpyd9aqIwL")
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex");

console.log("Generated Signature:", generatedSignature);
console.log("Razorpay Signature:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      await paymentModels.updateOne(
        { _id: payment._id },
        { $set: { status: "failed" } }
      );

      return NextResponse.json(
        { message: "Payment verification failed", success: false },
        { status: 400 }
      );
    }

    /* ---------------- UPDATE PAYMENT ---------------- */
    await paymentModels.updateOne(
      { _id: payment._id },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid",
          verified: true,
          userId,
          fullName: existingUser.fullName,
          email: existingUser.email,
        },
      }
    );

    /* ---------------- PLAN LOGIC ---------------- */
    const planDetail = payment.planDetail || {};
    const { planDuration, planType } = planDetail;

    const startDate = new Date();
    const endDate = new Date(startDate);

    const dur = (planDuration || "").toLowerCase();
    if (dur === "quarterly" || dur === "quaterly") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (dur.includes("half")) {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (dur.includes("year")) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    let planName = "Combined Plan";
    if (planType === "propertyPlan") planName = "Property Only";
    else if (planType === "servicePlan") planName = "Service Only";

    const planAmount =
      planDetail.planAmount ??
      payment.planAmount ??
      payment.amount ??
      payment.amountPaid ??
      undefined;

    /* ---------------- USER UPDATE (SAFE) ---------------- */
    const userUpdate = {
      currentPlanDetails: {
        planName,
        planAmount,
        isActive: true,
      },
    };

    if (planType === "propertyPlan") {
      userUpdate.propertySubscription = {
        isActive: true,
        startDate,
        endDate,
      };
    } else if (planType === "servicePlan") {
      userUpdate.serviceSubscription = {
        isActive: true,
        startDate,
        endDate,
      };
    } else {
      userUpdate.propertySubscription = {
        isActive: true,
        startDate,
        endDate,
      };
      userUpdate.serviceSubscription = {
        isActive: true,
        startDate,
        endDate,
      };
    }

    await userModels.updateOne(
      { _id: userId },
      { $set: userUpdate }
    );

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json(
      {
        message: "Payment verified successfully and subscription activated.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
