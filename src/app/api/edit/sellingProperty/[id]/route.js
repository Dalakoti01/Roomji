import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
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

    const sellingProperty = await sellingPropertiesModels.findById(id);
    if (!sellingProperty) {
      return NextResponse.json(
        { message: "Selling property not found", success: false },
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
    if (sellingProperty.ownerId.toString() !== userId.toString()) {
      return NextResponse.json(
        {
          message: "You are not allowed to edit this property",
          success: false,
        },
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
      policies,
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
    if (Array.isArray(policies)) updateData.policies = policies;
    if (typeof isPublic === "boolean")
      updateData.isPublic = isPublic;

    /* ✅ Merge address safely */
    if (address && typeof address === "object") {
      updateData.address = {
        ...sellingProperty.address,
        ...address,
      };
    }

    /* 🔥 Guard: no empty updates */
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          message: "No valid fields provided for update",
          success: false,
        },
        { status: 400 }
      );
    }

    /* ✅ Update selling property */
    const updatedProperty =
      await sellingPropertiesModels.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

    return NextResponse.json(
      {
        message: "Selling property updated successfully",
        success: true,
        property: updatedProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("EDIT SELLING PROPERTY ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
