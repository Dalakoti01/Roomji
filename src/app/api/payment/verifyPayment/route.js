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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
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

    // ✅ Verify signature
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

    // ✅ Mark payment as verified
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.verified = true;
    await payment.save();

    // ✅ Activate user's subscription
    const { planDuration, planType } = payment.planDetail;
    const startDate = new Date();
    let endDate = new Date(startDate);

    if (planDuration === "quaterly") endDate.setMonth(endDate.getMonth() + 3);
    if (planDuration === "half-yearly") endDate.setMonth(endDate.getMonth() + 6);
    if (planDuration === "annually") endDate.setFullYear(endDate.getFullYear() + 1);

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
    }

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
