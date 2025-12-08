import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Get User ID
    const userId = await getUserIdFromRequest();

    // ❌ wrong earlier — should check for !userId
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 404 }
      );
    }

    // Check Admin
    const existingAdmin = await userModels
      .findById(userId)
      .select("-password -otp");

    if (!existingAdmin || existingAdmin.role !== "admin") {
      return NextResponse.json(
        { message: "Admin Not Found. Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Fetch users
    const allUsers = await userModels.find();

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json(
        {
          message: "No Users Found At The Moment in the database",
          success: false,
        },
        { status: 404 }
      );
    }

    // SUCCESS → return users also
    return NextResponse.json(
      {
        message: "All The Users Fetched Successfully",
        success: true,
        allUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
