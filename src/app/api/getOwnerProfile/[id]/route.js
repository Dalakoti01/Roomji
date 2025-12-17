import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import serviceModels from "@/models/serviceModels";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Owner ID is required", success: false },
        { status: 400 }
      );
    }

    // ✅ Validate current logged-in user
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("-password -otp -otpExpire");

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Fetch owner profile WITH populated reviews.userId
    const ownerProfile = await userModels
      .findById(id)
      .select("-password -otp -otpExpire")
      .populate({
        path: "reviews.userId",
        select: "fullName profilePhoto",
      });

    if (!ownerProfile) {
      return NextResponse.json(
        { message: "Owner profile not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Fetch all property-related data
    const [
      rentedProperties,
      sellingProperties,
      ownersService,
      ownersShop,
    ] = await Promise.all([
      rentedPropertiesModels.find({ ownerId: id, isPublic: true }),
      sellingPropertiesModels.find({ ownerId: id, isPublic: true }),
      serviceModels.find({ ownerId: id, isPublic: true }),
      shopModels.find({ ownerId: id, isPublic: true }),
    ]);

    // ✅ Final response
    return NextResponse.json(
      {
        message: "Owner profile and properties fetched successfully",
        success: true,
        ownerProfile,
        rentedProperties: rentedProperties || [],
        sellingProperties: sellingProperties || [],
        services: ownersService || [],
        shops: ownersShop || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching owner details:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
