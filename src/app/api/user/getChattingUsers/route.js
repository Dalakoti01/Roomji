import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import conversationModels from "@/models/conversationModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find all conversations for this user
    const conversations = await conversationModels
      .find({ participants: userId })
      .populate("participants", "fullName profilePhoto _id");

    // Extract the other participant from each conversation
    const chattingUsers = [];
    conversations.forEach((conv) => {
      conv.participants.forEach((p) => {
        if (p._id.toString() !== userId.toString()) {
          chattingUsers.push(p);
        }
      });
    });

    return NextResponse.json({
      message: "Chatting users fetched successfully",
      chattingUsers,
    });
  } catch (error) {
    console.error("Error fetching chatting users:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
