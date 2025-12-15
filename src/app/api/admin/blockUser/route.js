import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // 🔐 Check admin auth
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("-password -otp");

    if (!existingUser || existingUser.role !== "admin") {
      return NextResponse.json(
        { message: "User not authorized", success: false },
        { status: 403 }
      );
    }

    // 🎯 Target user id
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "No user id provided", success: false },
        { status: 400 }
      );
    }

    const targetUser = await userModels.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { message: "Target user not found", success: false },
        { status: 404 }
      );
    }

    // 🔁 Toggle blocked status
    targetUser.blocked = !targetUser.blocked;
    await targetUser.save();

    return NextResponse.json(
      {
        message: `User ${targetUser.blocked ? "blocked" : "unblocked"} successfully`,
        success: true,
        blocked: targetUser.blocked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
