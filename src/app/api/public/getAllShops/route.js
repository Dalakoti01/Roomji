import { connectDB } from "@/lib/db";
import shopModels from "@/models/shopModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET(req) {
  try {
    await connectDB();

    const allShops = await shopModels
      .find({ isPublic: true, blocked: false })
      .populate({
        path: "ownerId",
        select: "profilePhoto",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: allShops.length
          ? "Shops fetched successfully"
          : "No shops found at this moment",
        success: true,
        allShops: allShops || [],
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
