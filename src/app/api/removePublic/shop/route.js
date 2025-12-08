import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import shopModels from "@/models/shopModels";
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

    const shop = await shopModels.findById(propertyId);
    if (!shop) {
      return NextResponse.json(
        { message: "shop not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Toggle rentedProperty field
    const updateShop = await shopModels.findByIdAndUpdate(
      propertyId,
      { isPublic: !shop.isPublic },
      { new: true }
    );

    return NextResponse.json(
      {
        message: `Shop  status changed to ${updateShop.isPublic}`,
        success: true,
        shop: updateShop,
      },

      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling Shop :", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
