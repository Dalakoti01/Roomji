import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const id = await getUserIdFromRequest();
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(id)
      .select("-password -otp -otpExpire");

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const { firstName, lastName, email, message } = await req.json();
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    existingUser.adminSupportMessages.push({
      firstName,
      lastName,
      email,
      message,
      userId: id,
    });

    await existingUser.save();

    return NextResponse.json(
      { message: "Message sent to admin successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/support:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
