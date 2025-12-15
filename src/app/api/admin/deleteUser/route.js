import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import rentedPropertiesModels from "@/models/rentedPropertiesModels";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import serviceModels from "@/models/serviceModels";
import shopModels from "@/models/shopModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // 🔐 Admin authentication
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("-password -otp");

    if (!existingUser || existingUser.role !== "admin") {
      return NextResponse.json(
        { message: "User not authorized", success: false },
        { status: 403 }
      );
    }

    // 🎯 Target user to delete
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "No user id provided", success: false },
        { status: 400 }
      );
    }

    // 🚫 Prevent admin from deleting themselves
    if (id === String(existingUser._id)) {
      return NextResponse.json(
        { message: "Admin cannot delete their own account", success: false },
        { status: 400 }
      );
    }

    // 🧹 Delete all resources owned by this user
    const [
      rentedResult,
      sellingResult,
      serviceResult,
      shopResult,
    ] = await Promise.all([
      rentedPropertiesModels.deleteMany({ ownerId: id }),
      sellingPropertiesModels.deleteMany({ ownerId: id }),
      serviceModels.deleteMany({ ownerId: id }),
      shopModels.deleteMany({ ownerId: id }),
    ]);

    // ❌ Delete user
    const deletedUser = await userModels.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User and all related data deleted successfully",
        success: true,
        deletedUserId: deletedUser._id,
        deletedRecords: {
          rentedProperties: rentedResult.deletedCount,
          sellingProperties: sellingResult.deletedCount,
          services: serviceResult.deletedCount,
          shops: shopResult.deletedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
