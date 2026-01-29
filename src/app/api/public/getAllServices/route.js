import { connectDB } from "@/lib/db";
import serviceModels from "@/models/serviceModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";

export async function GET(req) {
  try {
    await connectDB();

    const allServices = await serviceModels
      .find({ isPublic: true, blocked: false })
      .populate({
        path: "ownerId",
        select: "profilePhoto", // <-- Only this field will come
      })
      .sort({ createdAt: -1 });

    if (!allServices || allServices.length === 0) {
      return NextResponse.json(
        { message: "No Services found at this moment", success: false },
        {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
      );
    }

    return NextResponse.json(
      {
        message: "All The Services fetched successfully",
        success: true,
        allServices,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
