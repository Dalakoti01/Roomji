import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import serviceModels from "@/models/serviceModels";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("totalService totalProperties");

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const { propertyId, propertyType } = await req.json();

    if (!propertyId || propertyId.trim() === "") {
      return NextResponse.json(
        { message: "Property ID is required", success: false },
        { status: 400 }
      );
    }

    /* ---------------- RENTED PROPERTY ---------------- */
    if (propertyType === "rentedProperties") {
      const result = await rentedPropertiesModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            message: "Rented Property not found or not authorized",
            success: false,
          },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalProperties: { $gt: 0 } },
        { $inc: { totalProperties: -1 } }
      );

      return NextResponse.json(
        { message: "Rented Property deleted successfully", success: true },
        { status: 200 }
      );
    }

    /* ---------------- SELLING PROPERTY ---------------- */
    if (propertyType === "sellingProperties") {
      const result = await sellingPropertiesModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            message: "Selling Property not found or not authorized",
            success: false,
          },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalProperties: { $gt: 0 } },
        { $inc: { totalProperties: -1 } }
      );

      return NextResponse.json(
        { message: "Selling Property deleted successfully", success: true },
        { status: 200 }
      );
    }

    /* ---------------- SHOP ---------------- */
    if (propertyType === "shop") {
      const result = await shopModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { message: "Shop not found or not authorized", success: false },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalProperties: { $gt: 0 } },
        { $inc: { totalProperties: -1 } }
      );

      return NextResponse.json(
        { message: "Shop deleted successfully", success: true },
        { status: 200 }
      );
    }

    /* ---------------- SERVICE ---------------- */
    if (propertyType === "service") {
      const result = await serviceModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { message: "Service not found or not authorized", success: false },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalService: { $gt: 0 } },
        { $inc: { totalService: -1 } }
      );

      return NextResponse.json(
        { message: "Service deleted successfully", success: true },
        { status: 200 }
      );
    }

    /* ---------------- INVALID TYPE ---------------- */
    return NextResponse.json(
      { message: "Invalid property type", success: false },
      { status: 400 }
    );
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
