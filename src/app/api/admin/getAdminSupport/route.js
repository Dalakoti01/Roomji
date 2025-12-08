import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // admin auth same pattern as your other routes
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

    // find users who have at least one admin support message
    // return only basic user info + adminSupportMessages to keep response light
    const usersWithSupportMessages = await userModels
      .find({ "adminSupportMessages.0": { $exists: true } })
      .select("fullName email profilePhoto adminSupportMessages")
      .lean();

    return NextResponse.json(
      {
        message: "Admin support messages fetched successfully",
        success: true,
        count: usersWithSupportMessages.length,
        users: usersWithSupportMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /admin/admin-support-messages error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
