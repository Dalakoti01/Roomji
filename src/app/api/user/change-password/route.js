
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";

export async function POST(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    console.log("userid", userId);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "No Such User Found" },
        { status: 404 }
      );
    }

    const { oldPassword, newPassword, confirmPassword } = await req.json();
    console.log("backend data", oldPassword, newPassword, confirmPassword);
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "New passwords do not match" },
        { status: 400 }
      );
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect Old Password", success: false },
        { status: 401 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    existingUser.password = await bcrypt.hash(newPassword, salt);

    await existingUser.save();

    return NextResponse.json(
      { success: true, message: "Password Changed Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
