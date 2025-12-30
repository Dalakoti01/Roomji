import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { parseForm } from "@/lib/parseForm";
import cloudinary from "@/lib/cloudinary";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import serviceModels from "@/models/serviceModels";
import RecentActivities from "@/models/recentActivitesModels";



export async function POST(req) {
  try {
    await connectDB();

    // ✅ Authenticate user
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
    const serviceSub = existingUser.serviceSubscription;
    let subscriptionActive = false;

    if (serviceSub && serviceSub.isActive) {
      // If endDate is expired, deactivate
      if (serviceSub.endDate && new Date(serviceSub.endDate) < now) {
        serviceSub.isActive = false;
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
              "You have exhausted your free trial. Please buy a subscription to keep posting services.",
            code: "FREE_TRIAL_EXHAUSTED",
            success: false,
          },
          { status: 403 }
        );
      }
    }

    // ✅ Parse multipart form data
    const { fields, files } = await parseForm(req);

    // Flatten single-element arrays
    for (const key in fields) {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    }

    const {
      title,
      description,
      price,
      duration,
      category,
      uniqueCode,
      serviceFeatures,
      city,
      state,
      policies,
      detailedAddress,
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

    console.log(
      "all",
      title,
      description,
      price,
      duration,
      uniqueCode,
      email,
      phoneNumber
    );

    // ✅ Validation
    if (
      !title ||
      !description ||
      !price ||
      !uniqueCode ||
      !email ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { message: "Some required fields are missing", success: false },
        { status: 400 }
      );
    }

    // ✅ Handle file uploads
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
          folder: "service_uploads",
        });
        uploadedUrls.push(uploadRes.secure_url);
      }
    }

    // ✅ Parse service features (array of strings)
    const finalServiceFeatures = Array.isArray(serviceFeatures)
      ? serviceFeatures.flatMap((f) =>
          f.includes(",") ? f.split(",").map((i) => i.trim()) : [f.trim()]
        )
      : typeof serviceFeatures === "string"
      ? serviceFeatures.split(",").map((f) => f.trim())
      : [];

    // ✅ Create new Service document
    const newService = new serviceModels({
      ownerId: existingUser._id,
      title,
      description,
      duration,
      category,
      policies: Array.isArray(policies)
        ? policies
        : typeof policies === "string"
        ? policies.split(",").map((r) => r.trim())
        : [],
      price,
      uniqueCode,
      serviceFeatures: finalServiceFeatures,
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

    await newService.save();
    existingUser.totalService++;
    await existingUser.save();

    await RecentActivities.create({
      user : existingUser._id,
      fullName : existingUser.fullName,
      type : 'Property Posted',
      content : `${existingUser.fullName} has posted a new service: ${newService.title}.`,
    })

    return NextResponse.json(
      {
        message: "Service added successfully!",
        success: true,
        newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating service:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
