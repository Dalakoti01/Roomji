import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import paymentModels from "@/models/paymentModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export async function GET(req) {
  try {
    await connectDB();

    // admin auth
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const existingAdmin = await userModels.findById(userId).select("-password -otp");
    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden", success: false }, { status: 403 });
    }

    // optional query params
    const { searchParams } = new URL(req.url);
    // year for monthly breakdown (defaults to current year)
    const yearParam = Number(searchParams.get("year")) || new Date().getFullYear();
    const recentLimit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 10));

    // Base match: only paid documents
    const baseMatch = { status: "paid" };

    // 1) Total revenue (sum of amount for paid)
    const totalAgg = await paymentModels.aggregate([
      { $match: baseMatch },
      { $group: { _id: null, totalRevenue: { $sum: { $ifNull: ["$amount", 0] } } } },
    ]);
    const totalRevenue = (totalAgg[0] && totalAgg[0].totalRevenue) || 0;

    // 2) Revenue by planType (propertyPlan, servicePlan)
    const byPlanTypeAgg = await paymentModels.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$planDetail.planType",
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
          count: { $sum: 1 },
        },
      },
    ]);
    // normalize to object { propertyPlan: 0, servicePlan: 0 }
    const revenueByPlanType = {
      propertyPlan: 0,
      servicePlan: 0,
    };
    byPlanTypeAgg.forEach((r) => {
      if (r._id === "propertyPlan") revenueByPlanType.propertyPlan = r.revenue;
      if (r._id === "servicePlan") revenueByPlanType.servicePlan = r.revenue;
    });

    // 3) Revenue breakdown by month for the requested year
    // Use createdAt to get month/year
    const byMonthAgg = await paymentModels.aggregate([
      {
        $match: {
          ...baseMatch,
          createdAt: {
            $gte: new Date(`${yearParam}-01-01T00:00:00.000Z`),
            $lt: new Date(`${yearParam + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          amount: { $ifNull: ["$amount", 0] },
        },
      },
      {
        $group: {
          _id: "$month",
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // convert to array of 12 months with 0 defaults
    const revenueByMonth = MONTH_NAMES.map((name, idx) => {
      const monthNumber = idx + 1;
      const found = byMonthAgg.find((m) => m._id === monthNumber);
      return { month: name, monthNumber, revenue: found ? found.revenue : 0 };
    });

    // 4) Recent transactions (latest paid docs)
    // return only fields needed by frontend
    const recentTransactionsRaw = await paymentModels
      .find({ status: "paid" })
      .sort({ createdAt: -1 })
      .limit(recentLimit)
      .select("fullName email razorpayPaymentId amount planDetail createdAt status")
      .lean();

    const recentTransactions = recentTransactionsRaw.map((t) => ({
      fullName: t.fullName || null,
      email: t.email || null,
      transactionId: t.razorpayPaymentId || t.razorpayOrderId || null,
      planType: t.planDetail?.planType || null,
      planDuration: t.planDetail?.planDuration || null,
      amount: t.amount || 0,
      date: t.createdAt,
      status: t.status || null,
    }));

    // 5) Pie chart: revenue by planDuration (quaterly, half-yearly, annually)
    const byDurationAgg = await paymentModels.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$planDetail.planDuration",
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
        },
      },
    ]);
    // normalize into object and array for charts
    const pieData = {
      quaterly: 0,
      "half-yearly": 0,
      annually: 0,
    };
    byDurationAgg.forEach((p) => {
      if (p._id) pieData[p._id] = p.revenue;
    });
    const pieChartArray = Object.keys(pieData).map((k) => ({ label: k, revenue: pieData[k] }));

    // build response
    return NextResponse.json(
      {
        message: "Finance data fetched successfully",
        success: true,
        totalRevenue,
        revenueByPlanType,
        revenueByMonth, // array of 12 months with revenue
        recentTransactions,
        pieChart: pieChartArray,
        meta: {
          requestedYear: yearParam,
          recentLimit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /admin/finance error:", error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}
