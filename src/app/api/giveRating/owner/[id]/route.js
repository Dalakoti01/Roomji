import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
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

    const { feedback, rating } = await req.json();

    const existingOwner = await userModels.findById(id);
    if (!existingOwner) {
      return NextResponse.json(
        { message: "Owner not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Create a new review object
    const newReview = {
      rating,
      feedback,
      feedbackDate: new Date(),
      userId: existingUser._id,
    };

    // ✅ Push and save
    existingOwner.reviews.push(newReview);

    // ✅ Recalculate overall rating
    const allRatings = existingOwner.reviews.map((rev) => rev.rating);
    const averageRating =
      allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;

    existingOwner.overallratings = Number(averageRating.toFixed(1)); // rounded to 1 decimal

    await existingOwner.save();

    // ✅ Return latest review and new overall rating
    return NextResponse.json(
      {
        message: "Rating submitted successfully",
        success: true,
        latestReview: newReview,
        overallratings: existingOwner.overallratings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in rating route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
