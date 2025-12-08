import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import serviceModels from "@/models/serviceModels";
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

    const service = await serviceModels.findById(propertyId);
    if (!service) {
      return NextResponse.json(
        { message: "service not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Toggle rentedProperty field
    const updatedService = await serviceModels.findByIdAndUpdate(
      propertyId,
      { isPublic: !service.isPublic },
      { new: true }
    );

    return NextResponse.json(
      {
        message: `Service  status changed to ${updatedService.isPublic}`,
        success: true,
        service: updatedService,
      },

      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling service :", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
