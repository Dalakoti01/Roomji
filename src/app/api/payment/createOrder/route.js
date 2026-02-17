import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import paymentModels from "@/models/paymentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
 key_id: "rzp_test_Re0UG0czfqFcZu",
  key_secret: "8tqbuZO9WCk2QIGpyd9aqIwL",
});

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

    const existingUser = await userModels.findById(userId).select("-password -otp");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const { amount, planDuration, planType } = await req.json();
    if (!amount || !planDuration || !planType) {
      return NextResponse.json(
        { message: "Missing payment details", success: false },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await paymentModels.create({
      razorpayOrderId: order.id,
      amount,
      planDetail: { planDuration, planType },
    });

    console.log("Order created:", payment);

    return NextResponse.json(
  {
    message: "Order Created Successfully",
    success: true,
    order,
    paymentId: payment._id,
    key: "rzp_test_Re0UG0czfqFcZu", // 👈 HARD-CODED PUBLIC KEY
  },
  { status: 201 }
);

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
