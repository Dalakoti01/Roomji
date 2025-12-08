import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // verify admin
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token not found", success: false },
        { status: 401 }
      );
    }

    const existingAdmin = await userModels.findById(userId).select("-password -otp");
    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: admin required", success: false },
        { status: 401 }
      );
    }

    // find users who have at least one feedback in feedbackToPlatform
    // we return only basic user info + feedbackToPlatform to keep the response light
    const usersWithFeedback = await userModels
      .find({ "feedbackToPlatform.0": { $exists: true } })
      .select("fullName email profilePhoto feedbackToPlatform")
      .lean();

    return NextResponse.json(
      {
        message: "Feedbacks fetched successfully",
        success: true,
        count: usersWithFeedback.length,
        users: usersWithFeedback,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /admin/feedback-to-platform error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
