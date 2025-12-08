import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token not found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId).select("-password -otp");
    if (!existingUser) {
      return NextResponse.json(
        { message: "No such user found", success: false },
        { status: 404 }
      );
    }

    const ownerShops = await shopModels.find({ ownerId: userId });
    if (!ownerShops || ownerShops.length === 0) {
      return NextResponse.json(
        { message: "No shops found for this owner", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Shops fetched successfully",
        success: true,
        ownerShops,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
