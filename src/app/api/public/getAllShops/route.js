import { connectDB } from "@/lib/db";
import shopModels from "@/models/shopModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

export async function GET(req) {
  try {
    await connectDB();

    const allShops = await shopModels
      .find({ isPublic: true, blocked: false })
      .populate({
        path: "ownerId",
        select: "profilePhoto", // <-- Only this field will come
      })
      .sort({ createdAt: -1 });

    if (!allShops || allShops.length === 0) {
      return NextResponse.json(
        { message: "No Shops found at this moment", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "All The Shops fetched successfully",
        success: true,
        allShops,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
