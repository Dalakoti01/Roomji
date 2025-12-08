import { connectDB } from "@/lib/db";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Room ID is required", success: false },
        { status: 400 }
      );
    }

    // ✅ Populate both ownerId and reviews.userId (with selected fields)
    const rentedProperty = await rentedPropertiesModels
      .findById(id)
      .populate("ownerId", "fullName profilePhoto")
      .populate("reviews.userId", "fullName profilePhoto");

    if (!rentedProperty) {
      return NextResponse.json(
        { message: "Rented Property not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Rented Property fetched successfully",
        success: true,
        rentedProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
