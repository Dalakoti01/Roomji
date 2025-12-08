import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
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

    const ownerSellingProperties = await sellingPropertiesModels.find({ ownerId: userId });
    if (!ownerSellingProperties || ownerSellingProperties.length === 0) {
      return NextResponse.json(
        { message: "No selling properties found for this owner", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Selling properties fetched successfully",
        success: true,
        ownerSellingProperties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching selling properties:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
