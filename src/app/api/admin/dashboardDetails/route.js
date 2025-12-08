import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import paymentModels from "@/models/paymentModels";
import RecentActivities from "@/models/recentActivitesModels";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import serviceModels from "@/models/serviceModels";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

/**
 * Admin summary route
 * Query params:
 *  - year (optional): integer year, defaults to current year
 *  - recentLimit (optional): how many recent activities to return, defaults to 20
 */
export async function GET(req) {
  try {
    await connectDB();

    // ----- Auth & role check -----
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token not found", success: false },
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
    if (existingUser.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized - admin only", success: false },
        { status: 403 }
      );
    }

    // ----- query params -----
    const url = new URL(req.url);
    const year = parseInt(url.searchParams.get("year") || `${new Date().getFullYear()}`, 10);
    const recentLimit = parseInt(url.searchParams.get("recentLimit") || "20", 10);

    // Helper: build start and end Date objects for the year in UTC
    const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0)); // Jan 1, 00:00 UTC
    const yearEnd = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0)); // next Jan 1

    // Normalizer: convert aggregation result to array of length 12 with counts for months 1..12
    const normalizeMonths = (agg) => {
      const arr = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
      (agg || []).forEach((r) => {
        const m = Number(r._id); // expecting 1..12
        if (m >= 1 && m <= 12) arr[m - 1].count = r.count;
      });
      return arr;
    };

    // ----- Totals (existing code) -----
    const userCount = await userModels.countDocuments();
    const rentedPropertiesCount = await rentedPropertiesModels.countDocuments();
    const sellingPropertiesCount = await sellingPropertiesModels.countDocuments();
    const servicesCount = await serviceModels.countDocuments();
    const shopsCount = await shopModels.countDocuments();
    const totalPropertiesCount =
      rentedPropertiesCount + sellingPropertiesCount + servicesCount + shopsCount;

    // ----- Total revenue -----
    const revenueResult = await paymentModels.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue = (revenueResult[0] && revenueResult[0].totalRevenue) || 0;

    // ----- Monthly aggregations -----
    // Pipeline template (match by createdAt range, group by month number)
    const monthlyPipeline = [
      { $match: { createdAt: { $gte: yearStart, $lt: yearEnd } } },
      // group by month (1..12)
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];

    // Users by month
    const usersByMonthAgg = await userModels.aggregate(monthlyPipeline);
    const usersByMonth = normalizeMonths(usersByMonthAgg).map((m) => m.count); // array of 12 numbers

    // Properties by month per model (run in parallel)
    const [rentedAgg, sellingAgg, serviceAgg, shopAgg] = await Promise.all([
      rentedPropertiesModels.aggregate(monthlyPipeline),
      sellingPropertiesModels.aggregate(monthlyPipeline),
      serviceModels.aggregate(monthlyPipeline),
      shopModels.aggregate(monthlyPipeline),
    ]);
    // normalize each
    const rentedByMonth = normalizeMonths(rentedAgg).map((m) => m.count);
    const sellingByMonth = normalizeMonths(sellingAgg).map((m) => m.count);
    const serviceByMonth = normalizeMonths(serviceAgg).map((m) => m.count);
    const shopByMonth = normalizeMonths(shopAgg).map((m) => m.count);

    // combined properties per month (sum of the four arrays)
    const propertiesByMonth = Array.from({ length: 12 }, (_, i) => {
      return (
        (rentedByMonth[i] || 0) +
        (sellingByMonth[i] || 0) +
        (serviceByMonth[i] || 0) +
        (shopByMonth[i] || 0)
      );
    });

    // Revenue per month (only paid)
    const revenueMonthlyAgg = await paymentModels.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: yearStart, $lt: yearEnd },
        },
      },
      // group by month
      {
        $group: {
          _id: { $month: "$createdAt" },
          monthRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // Normalize into 12 months (0 for months with no revenue)
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
      const found = (revenueMonthlyAgg || []).find((r) => Number(r._id) === i + 1);
      return found ? found.monthRevenue : 0;
    });

    // ----- Recent activities (NEW: pull from RecentActivities model) -----
    // The RecentActivities schema includes: user (ObjectId ref 'User'), fullName, type, content, timestamps
    // We populate the user (if available) to include quick user meta.
    const rawRecentActivities = await RecentActivities
      .find({})
      .sort({ createdAt: -1 })
      .limit(recentLimit)
      .populate("user", "fullName uniqueId email role")
      .lean();

    // Normalize each recent activity into a compact object the frontend expects
    const activities = (rawRecentActivities || []).map((r) => {
      // create a short slug for the type (e.g., 'User Joined' -> 'user_joined')
      const typeSlug = (r.type || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

      return {
        type: typeSlug, // normalized type string
        date: r.createdAt,
        meta: {
          fullName: r.fullName || (r.user && r.user.fullName) || null,
          content: r.content || null,
          // attach populated user info if available
          user: r.user
            ? {
                _id: r.user._id,
                fullName: r.user.fullName,
                uniqueId: r.user.uniqueId,
                email: r.user.email,
                role: r.user.role,
              }
            : null,
        },
        refId: r._id,
      };
    });

    // ----- Return payload -----
    return NextResponse.json(
      {
        success: true,
        message: "Admin dashboard data fetched successfully",
        adminDashboard: {
          year,
          // totals
          userCount,
          totalPropertiesCount,
          totalRevenue,
          // monthly breakdowns (arrays for charts)
          usersByMonth, // [12 numbers Jan..Dec]
          propertiesByMonth, // [12 numbers Jan..Dec] (combined)
          breakdown: {
            rentedByMonth,
            sellingByMonth,
            serviceByMonth,
            shopByMonth,
          },
          revenueByMonth, // [12 numbers Jan..Dec]
          // recent activities (from RecentActivities model)
          recentActivities: activities,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
