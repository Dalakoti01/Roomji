import { connectDB } from "@/lib/db";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET(req) {
  try {
    await connectDB();

    const allRentedProperties = await rentedPropertiesModels
      .find({ isPublic: true, blocked: false })
      .populate({
        path: "ownerId",
        select: "profilePhoto",
      })
      .sort({ createdAt: -1 });

    // ✅ ALWAYS 200
    return NextResponse.json(
      {
        message: allRentedProperties.length
          ? "Rented properties fetched successfully"
          : "No rented properties found",
        success: true,
        allRentedProperties: allRentedProperties || [],
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
