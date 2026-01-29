import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

export async function GET(req) {
  try {
    await connectDB();

    const allRentedProperties = await rentedPropertiesModels
      .find({ isPublic: true, blocked: false })
      // ✅ Only include the "profilePhoto" field from ownerId
      .populate({
        path: "ownerId",
        select: "profilePhoto", // <-- Only this field will come
      })
      .sort({ createdAt: -1 });

    if (!allRentedProperties || allRentedProperties.length === 0) {
      return NextResponse.json(
        { message: "No rented properties found", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Rented properties fetched successfully",
        success: true,
        allRentedProperties,
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
    console.log(error);

    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
