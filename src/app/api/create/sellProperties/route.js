import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { parseForm } from "@/lib/parseForm";
import cloudinary from "@/lib/cloudinary";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import sellingPropertiesModels from "@/models/sellingPropertiesModels";
import RecentActivities from "@/models/recentActivitesModels";

// ✅ Disable Next.js body parser for file uploads
export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Token not found", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findById(userId)
      .select("-password -otp");

    if (!existingUser) {
      return NextResponse.json(
        { message: "No such user found", success: false },
        { status: 404 }
      );
    }

    // ✅ 2. Check if property subscription has expired
    const now = new Date();
    const propertySub = existingUser.propertySubscription;
    let subscriptionActive = false;

    if (propertySub && propertySub.isActive) {
      // If endDate is expired, deactivate
      if (propertySub.endDate && new Date(propertySub.endDate) < now) {
        propertySub.isActive = false;
        await existingUser.save();
      } else {
        subscriptionActive = true;
      }
    }

    // ✅ 3. Handle free trial logic
    const freeTrial = existingUser.freeTrial;
    const freeTrialUsed = freeTrial?.oneTimeDone || false;
    const freeTrialActive = freeTrial?.isActive || false;

    // ✅ 4. Decide if posting is allowed
    if (!subscriptionActive) {
      // Subscription not active — check free trial
      if (!freeTrialUsed) {
        // Allow posting once and mark trial as used
        existingUser.freeTrial.oneTimeDone = true;
        existingUser.freeTrial.isActive = true;
        existingUser.freeTrial.startDate = new Date();
        existingUser.freeTrial.endDate = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ); // example: 7-day trial
        await existingUser.save();
      } else {
        console.log(
          "🛑 Free trial exhausted — blocking request for user:",
          existingUser._id
        );
        return NextResponse.json(
          {
            message:
              "You have exhausted your free trial. Please buy a subscription to keep posting properties.",
            code: "FREE_TRIAL_EXHAUSTED",
            success: false,
          },
          { status: 403 }
        );
      }
    }

    // ✅ Parse multipart form data (text fields + files)
    const { fields, files } = await parseForm(req);

    // ✅ Flatten all single-element arrays
    for (const key in fields) {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    }

    const {
      title,
      description,
      city,
      state,
      detailedAddress,
      category,
      price,
      area,
      securityDeposit,
      duration,
      policies,
      uniqueCode,
      amenities,
      googleLat,
      googleLng,
      googlePlaceId,
      fullName,
      email,
      phoneNumber,
      showPhoneNumber,
      profession,
      personalNote,
    } = fields;

    // ✅ Validate required fields
    if (
      !title ||
      !description ||
      !city ||
      !state ||
      !detailedAddress ||
      !category ||
      !price ||
      !policies ||
      !uniqueCode ||
      !email ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { message: "Some required fields are missing", success: false },
        { status: 400 }
      );
    }

    console.log("this is the data", category);

    // ✅ Handle file uploads (max 5)
    let uploadedUrls = [];
    if (files && files.photos) {
      const photoArray = Array.isArray(files.photos)
        ? files.photos
        : [files.photos];

      if (photoArray.length > 5) {
        return NextResponse.json(
          { message: "You can upload a maximum of 5 photos.", success: false },
          { status: 400 }
        );
      }

      for (const file of photoArray) {
        const uploadRes = await cloudinary.uploader.upload(file.filepath, {
          folder: "room_uploads",
        });
        uploadedUrls.push(uploadRes.secure_url);
      }
    }

    // ✅ Safe amenities parsing
    const finalAmenities = Array.isArray(amenities)
      ? amenities.flatMap((a) =>
          a.includes(",") ? a.split(",").map((i) => i.trim()) : [a.trim()]
        )
      : typeof amenities === "string"
      ? amenities.split(",").map((a) => a.trim())
      : [];

    // ✅ Create new Room document
    const sellingProperty = new sellingPropertiesModels({
      ownerId: existingUser._id,
      title,
      description,
      price,
      area,
      securityDeposit,
      duration,
      policies: Array.isArray(policies)
        ? policies
        : typeof policies === "string"
        ? policies.split(",").map((r) => r.trim())
        : [],
      uniqueCode,
      amenities: finalAmenities,
      address: {
        city,
        state,
        detailedAddress,
        googleLocation: {
          lat: googleLat ? parseFloat(googleLat) : null,
          lng: googleLng ? parseFloat(googleLng) : null,
          placeId: googlePlaceId || null,
        },
      },
      propertyTypes: category,

      owner: {
        fullName,
        email,
        phoneNumber,
        showPhoneNumber,
        profession,
        personalNote,
        uniqueId: existingUser.uniqueId || "",
      },
      photos: uploadedUrls,
    });

    await sellingProperty.save();
    existingUser.totalProperties++;
    await existingUser.save()

    await RecentActivities.create({
      user : existingUser._id,
      fullName : existingUser.fullName,
      type : 'Property Posted',
      content : `${existingUser.fullName} has posted a new property for sale: ${sellingProperty.title}.`,
      })

    return NextResponse.json(
      {
        message: "Property added successfully!",
        success: true,
        rentedProperties: sellingProperty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while adding room:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
