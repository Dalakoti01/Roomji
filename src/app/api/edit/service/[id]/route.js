import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import serviceModels from "@/models/serviceModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    /* ✅ IMPORTANT: params is async in your setup */
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required", success: false },
        { status: 400 }
      );
    }

    const service = await serviceModels.findById(id);
    if (!service) {
      return NextResponse.json(
        { message: "Service not found", success: false },
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
    if (service.ownerId.toString() !== userId.toString()) {
      return NextResponse.json(
        {
          message: "You are not allowed to edit this service",
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
      category,
      serviceFeatures,
      owner,
      isPublic,
      address,
      amenities,
    } = body;

    /* ✅ Build update object dynamically */
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (Array.isArray(serviceFeatures))
      updateData.serviceFeatures = serviceFeatures;
    if (typeof isPublic === "boolean")
      updateData.isPublic = isPublic;
    if (Array.isArray(amenities)) updateData.amenities = amenities;

    /* ✅ Nested OWNER updates */
    if (owner && typeof owner === "object") {
      updateData.owner = {
        ...service.owner,
        ...(owner.price !== undefined && { price: owner.price }),
        ...(owner.duration !== undefined && { duration: owner.duration }),
        ...(Array.isArray(owner.policies) && {
          policies: owner.policies,
        }),
      };
    }

    /* ✅ Optional address merge */
    if (address && typeof address === "object") {
      updateData.address = {
        ...service.address,
        ...address,
      };
    }

    /* 🔥 Guard: prevent empty updates */
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          message: "No valid fields provided for update",
          success: false,
        },
        { status: 400 }
      );
    }

    /* ✅ Update service */
    const updatedService =
      await serviceModels.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

    return NextResponse.json(
      {
        message: "Service updated successfully",
        success: true,
        service: updatedService,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("EDIT SERVICE ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
