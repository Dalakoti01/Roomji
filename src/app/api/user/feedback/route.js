import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(); // pass req here
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
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

    const { fullName, email, feedback } = await req.json();

    if (!fullName || !email || !feedback) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Push new feedback entry
    existingUser.feedbackToPlatform.push({
      fullName,
      email,
      feedback,
      date: new Date(),
      userId: userId,
    });

    await existingUser.save();

    return NextResponse.json(
      { message: "Feedback submitted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
