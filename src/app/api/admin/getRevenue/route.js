import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import paymentModels from "@/models/paymentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Verify token
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    // 🔐 Verify admin
    const existingAdmin = await userModels
      .findById(userId)
      .select("-password -otp");

    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin only", success: false },
        { status: 403 }
      );
    }

    // 🟢 Fetch only PAID payments
    const payments = await paymentModels
      .find({ status: "paid" })
      .sort({ createdAt: -1 })
      .lean();

    // ---------------------------
    // 📊 Calculations
    // ---------------------------
    let totalRevenue = 0;
    let propertyPlanCount = 0;
    let servicePlanCount = 0;

    const uniqueUsers = new Set();

    for (const payment of payments) {
      totalRevenue += payment.amount || 0;

      if (payment.planDetail?.planType === "propertyPlan") {
        propertyPlanCount++;
      }

      if (payment.planDetail?.planType === "servicePlan") {
        servicePlanCount++;
      }

      if (payment.userId) {
        uniqueUsers.add(payment.userId.toString());
      }
    }

    // ---------------------------
    // 🧾 Recent Transactions
    // ---------------------------
    const recentTransactions = payments.map((payment) => ({
      transactionId: payment.razorpayPaymentId,
      fullName: payment.fullName,
      email: payment.email,
      planType: payment.planDetail?.planType,
      planDuration: payment.planDetail?.planDuration,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      date: payment.createdAt,
    }));

    // ---------------------------
    // ✅ Response
    // ---------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Finance data fetched successfully",
        revenue: {
          totalRevenue,
          propertyPlanCount,
          servicePlanCount,
          totalSubscribers: uniqueUsers.size,
          recentTransactions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin finance route error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
