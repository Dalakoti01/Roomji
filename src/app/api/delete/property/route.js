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

    const { propertyId, propertyType } = await req.json();

    if (!propertyId) {
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

      if (!result.deletedCount) {
        return NextResponse.json(
          { message: "Rented Property not found", success: false },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalProperties: { $gt: 0 } },
        { $inc: { totalProperties: -1 } }
      );

      const updatedData = await rentedPropertiesModels.find({ ownerId: userId });

      return NextResponse.json({
        success: true,
        message: "Rented Property deleted successfully",
        deletedType: "rentedProperties",
        updatedData,
      });
    }

    /* ---------------- SELLING PROPERTY ---------------- */
    if (propertyType === "sellingProperties") {
      const result = await sellingPropertiesModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (!result.deletedCount) {
        return NextResponse.json(
          { message: "Selling Property not found", success: false },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalProperties: { $gt: 0 } },
        { $inc: { totalProperties: -1 } }
      );

      const updatedData = await sellingPropertiesModels.find({ ownerId: userId });

      return NextResponse.json({
        success: true,
        message: "Selling Property deleted successfully",
        deletedType: "sellingProperties",
        updatedData,
      });
    }

    /* ---------------- SHOP ---------------- */
    if (propertyType === "shop") {
      const result = await shopModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (!result.deletedCount) {
        return NextResponse.json(
          { message: "Shop not found", success: false },
          { status: 404 }
        );
      }

      const updatedData = await shopModels.find({ ownerId: userId });

      return NextResponse.json({
        success: true,
        message: "Shop deleted successfully",
        deletedType: "shop",
        updatedData,
      });
    }

    /* ---------------- SERVICE ---------------- */
    if (propertyType === "service") {
      const result = await serviceModels.deleteOne({
        _id: propertyId,
        ownerId: userId,
      });

      if (!result.deletedCount) {
        return NextResponse.json(
          { message: "Service not found", success: false },
          { status: 404 }
        );
      }

      await userModels.updateOne(
        { _id: userId, totalService: { $gt: 0 } },
        { $inc: { totalService: -1 } }
      );

      const updatedData = await serviceModels.find({ ownerId: userId });

      return NextResponse.json({
        success: true,
        message: "Service deleted successfully",
        deletedType: "service",
        updatedData,
      });
    }

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
