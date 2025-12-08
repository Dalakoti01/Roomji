import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import serviceModels from "@/models/serviceModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token not found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels.findById(userId).select("-password -otp");
    if (!existingUser) {
      return NextResponse.json(
        { message: "No such user found", success: false },
        { status: 404 }
      );
    }

    const ownerServices = await serviceModels.find({ ownerId: userId });
    if (!ownerServices || ownerServices.length === 0) {
      return NextResponse.json(
        { message: "No services found for this owner", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Services fetched successfully",
        success: true,
        ownerServices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
