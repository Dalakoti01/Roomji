import { connectDB } from "@/lib/db";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET(req) {
  try {
    await connectDB();

    const allSellingProperties = await sellingPropertiesModels
      .find({ isPublic: true, blocked: false })
      .populate({
        path: "ownerId",
        select: "profilePhoto",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: allSellingProperties.length
          ? "Selling properties fetched successfully"
          : "No selling properties found",
        success: true,
        allSellingProperties: allSellingProperties || [],
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}
