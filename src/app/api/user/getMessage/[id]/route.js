import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import conversationModels from "@/models/conversationModels";
import userModels from "@/models/userModels";
import messageModels from "@/models/messageModels";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const { id } = await params; // ✅ FIXED — no await here

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("-password -otp -otpExpiry");

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const conversation = await conversationModels
      .findOne({
        participants: { $all: [userId, id] },
      })
      .populate("messages");

    if (!conversation) {
      return NextResponse.json(
        {
          message: "No conversation found",
          success: true,
          messages: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Conversation fetched successfully",
        success: true,
        messages: conversation.messages,
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
