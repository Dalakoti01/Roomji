import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ no await here
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

    // ✅ Make sure property exists
    const existingProperty = await sellingPropertiesModels.findById(id);
    if (!existingProperty) {
      return NextResponse.json(
        { message: "Property not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Create new review object
    const newReview = {
      rating,
      feedback,
      feedbackDate: new Date(),
      userId: existingUser._id,
    };

    // ✅ Push and save
    existingProperty.reviews.push(newReview);
     // ✅ Recalculate overall rating
    const allRatings = existingProperty.reviews.map((rev) => rev.rating);
    const averageRating =
      allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;

    existingProperty.overallratings = Number(averageRating.toFixed(1)); // rounded to 1 decimal

    await existingProperty.save();

    // ✅ Return latest review in response
    return NextResponse.json(
      {
        message: "Rating submitted successfully",
        success: true,
        latestReview: newReview, // ✅ Added this
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
