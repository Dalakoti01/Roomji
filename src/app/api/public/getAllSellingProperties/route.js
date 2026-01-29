import { connectDB } from "@/lib/db";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

export async function GET(req) {
  try {
    await connectDB();

    const allSellingProperties = await sellingPropertiesModels
      .find({ isPublic: true, blocked: false })
      .populate({
        path: "ownerId",
        select: "profilePhoto", // <-- Only this field will come
      })
      .sort({ createdAt: -1 });

    if (!allSellingProperties || allSellingProperties.length === 0) {
      return NextResponse.json(
        { message: "No selling properties found", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Selling properties fetched successfully",
        success: true,
        allSellingProperties,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
