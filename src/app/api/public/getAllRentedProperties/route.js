import { connectDB } from "@/lib/db";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import { NextResponse } from "next/server";

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

    // 🔹 No data case (EXPECTED in your current DB state)
    if (!allRentedProperties || allRentedProperties.length === 0) {
      return NextResponse.json(
        {
          message: "No rented properties found",
          success: false,
          allRentedProperties: [],
        },
        {
          status: 404,
          headers: noCacheHeaders,
        }
      );
    }

    // 🔹 Success case
    return NextResponse.json(
      {
        message: "Rented properties fetched successfully",
        success: true,
        allRentedProperties,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error(error);

    // 🔹 Server error case
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
