import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // verify request (same pattern as your previous route)
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 404 }
      );
    }

    const existingAdmin = await userModels
      .findById(userId)
      .select("-password -otp");

    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        { message: "Admin Not Found. Unauthorized", success: false },
        { status: 401 }
      );
    }

    // optional query param to filter by subscription type
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "both"; // "property" | "service" | "both"

    let query = {};
    if (type === "property") {
      query = { "propertySubscription.isActive": true };
    } else if (type === "service") {
      query = { "serviceSubscription.isActive": true };
    } else {
      // default: either subscription active
      query = {
        $or: [
          { "propertySubscription.isActive": true },
          { "serviceSubscription.isActive": true },
        ],
      };
    }

    // fetch subscribed users (exclude sensitive fields)
    const subscribedUsers = await userModels
      .find(query)
      .select("-password -otp")
      .lean();

    if (!subscribedUsers || subscribedUsers.length === 0) {
      return NextResponse.json(
        {
          message: "No subscribed users found",
          success: false,
          count: 0,
          subscribedUsers: [],
        },
        { status: 404 }
      );
    }

    // Optionally, separate counts for each subscription type for convenience
    const propertyCount = await userModels.countDocuments({
      "propertySubscription.isActive": true,
    });
    const serviceCount = await userModels.countDocuments({
      "serviceSubscription.isActive": true,
    });

    return NextResponse.json(
      {
        message: "Subscribed users fetched successfully",
        success: true,
        count: subscribedUsers.length,
        propertyCount,
        serviceCount,
        subscribedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /admin/subscribed-users error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
