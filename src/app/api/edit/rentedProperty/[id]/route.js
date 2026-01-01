import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Property ID is required", success: false },
        { status: 400 }
      );
    }

    const rentedProperty = await rentedPropertiesModels.findById(id);
    if (!rentedProperty) {
      return NextResponse.json(
        { message: "Rented Property not found", success: false },
        { status: 404 }
      );
    }

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    /* ✅ Ownership check */
    if (rentedProperty.ownerId.toString() !== userId.toString()) {
      return NextResponse.json(
        { message: "You are not allowed to edit this property", success: false },
        { status: 403 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("fullName email");

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    /* ✅ Read request body */
    const body = await req.json();

    const {
      title,
      description,
      propertyTypes,
      price,
      securityDeposit,
      area,
      amenities,
      roomPolicies,
      address,
      isPublic,
    } = body;

    /* ✅ Build update object dynamically */
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (propertyTypes !== undefined)
      updateData.propertyTypes = propertyTypes;
    if (price !== undefined) updateData.price = price;
    if (securityDeposit !== undefined)
      updateData.securityDeposit = securityDeposit;
    if (area !== undefined) updateData.area = area;
    if (Array.isArray(amenities)) updateData.amenities = amenities;
    if (Array.isArray(roomPolicies))
      updateData.roomPolicies = roomPolicies;
    if (typeof isPublic === "boolean")
      updateData.isPublic = isPublic;

    /* ✅ Nested address merge */
    if (address && typeof address === "object") {
      updateData.address = {
        ...rentedProperty.address,
        ...address,
      };
    }

    /* 🔥 IMPORTANT GUARD: no empty updates */
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          message: "No valid fields provided for update",
          success: false,
        },
        { status: 400 }
      );
    }

    /* ✅ Update property */
    const updatedProperty =
      await rentedPropertiesModels.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

    return NextResponse.json(
      {
        message: "Rented property updated successfully",
        success: true,
        property: updatedProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("EDIT RENTED PROPERTY ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
