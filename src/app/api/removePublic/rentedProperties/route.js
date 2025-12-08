import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Token is missing", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("-password -otp");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID not provided", success: false },
        { status: 400 }
      );
    }

    const rentedProperty = await rentedPropertiesModels.findById(propertyId);
    if (!rentedProperty) {
      return NextResponse.json(
        { message: "Property not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Toggle rentedProperty field
    const updatedProperty = await rentedPropertiesModels.findByIdAndUpdate(
      propertyId,
      { isPublic: !rentedProperty.isPublic },
      { new: true }
    );

    return NextResponse.json(
      {
        message: `Property rented status changed to ${updatedProperty.isPublic}`,
        success: true,
        rentedProperty: updatedProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling rented property:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
