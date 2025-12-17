import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import paymentModels from "@/models/paymentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

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

    const payment = await paymentModels.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment record not found", success: false },
        { status: 404 }
      );
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      return NextResponse.json(
        { message: "Payment verification failed", success: false },
        { status: 400 }
      );
    }

    // Mark payment as verified
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.verified = true;
    payment.userId = userId;
    payment.fullName = existingUser.fullName;
    payment.email = existingUser.email;
    await payment.save();

    // Activate user's subscription + update currentPlanDetails
    // Expect payment.planDetail to contain planDuration and planType, and optionally planAmount
    const planDetail = payment.planDetail || {};
    const { planDuration, planType } = planDetail;

    // Determine start & end dates
    const startDate = new Date();
    const endDate = new Date(startDate);

    // defensive: handle common spellings in your earlier code
    const dur = (planDuration || "").toString().toLowerCase();
    if (dur === "quaterly" || dur === "quarterly") endDate.setMonth(endDate.getMonth() + 3);
    else if (dur === "half-yearly" || dur === "half yearly" || dur === "halfyearly") endDate.setMonth(endDate.getMonth() + 6);
    else if (dur === "annually" || dur === "yearly") endDate.setFullYear(endDate.getFullYear() + 1);
    // else: no change (or you may add other durations)

    // Map planType -> human readable planName (match currentPlanDetails enum)
    let planName = "Combined Plan";
    if (planType === "propertyPlan") planName = "Property Only";
    else if (planType === "servicePlan") planName = "Service Only";
    else planName = "Combined Plan";

    // Determine plan amount: try payment.planDetail.planAmount, fallback to payment.amount or payment.amountPaid
    const planAmount =
      typeof planDetail.planAmount === "number"
        ? planDetail.planAmount
        : typeof payment.planAmount === "number"
        ? payment.planAmount
        : typeof payment.amount === "number"
        ? payment.amount
        : typeof payment.amountPaid === "number"
        ? payment.amountPaid
        : null;

    // Update respective subscription object (keep previous behavior)
    if (planType === "propertyPlan") {
      existingUser.propertySubscription = {
        isActive: true,
        startDate,
        endDate,
      };
    } else if (planType === "servicePlan") {
      existingUser.serviceSubscription = {
        isActive: true,
        startDate,
        endDate,
      };
    } else {
      // if combined / unknown, set both (optional)
      existingUser.propertySubscription = {
        isActive: true,
        startDate,
        endDate,
      };
      existingUser.serviceSubscription = {
        isActive: true,
        startDate,
        endDate,
      };
    }

    // Update the new field currentPlanDetails on user
    existingUser.currentPlanDetails = {
      planName,
      planAmount: planAmount !== null ? planAmount : undefined,
      isActive: true,
    };

    // Save user
    await existingUser.save();

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
