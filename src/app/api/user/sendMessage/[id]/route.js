import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import conversationModels from "@/models/conversationModels";
import messageModels from "@/models/messageModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
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

    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { message: "Message cannot be empty", success: false },
        { status: 400 }
      );
    }

    let conversation = await conversationModels.findOne({
      participants: { $all: [userId, id] },
    });

    if (!conversation) {
      conversation = new conversationModels({
        participants: [userId, id],
      });
    }

    const newMessage = await messageModels.create({
      message: message,
      sender: userId,
      receiver: id,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    return NextResponse.json(
      { message: "Message sent successfully", success: true },
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
