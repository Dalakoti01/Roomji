import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import { parseForm } from "@/lib/parseForm";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

// ✅ Disable Next.js body parser for file uploads
export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Get logged-in user
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token not found", success: false },
        { status: 401 }
      );
    }

    // ✅ Parse form data (fields + files)
    const { fields, files } = await parseForm(req);

    // ✅ Flatten all single-element arrays
    for (const key in fields) {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    }

    const {
      firstName,
      lastName,
      address,
      instagramLink,
      facebookLink,
      linkedinLink,
      twitterLink,
      phoneNumber,
      whatsappNumber,
      phoneNumberShow,
      whatsappNumberShow,
    } = fields;

    const coverPhoto = files.coverPhoto?.[0];
    const profilePhoto = files.profilePhoto?.[0];

    // ✅ Check if there’s any data at all
    const hasData =
      firstName ||
      lastName ||
      address ||
      instagramLink ||
      facebookLink ||
      linkedinLink ||
      twitterLink ||
      phoneNumber ||
      whatsappNumber ||
      phoneNumberShow !== undefined ||
      whatsappNumberShow !== undefined ||
      coverPhoto ||
      profilePhoto;

    if (!hasData) {
      return NextResponse.json(
        { message: "No data provided to update profile", success: false },
        { status: 400 }
      );
    }

    // ✅ Prepare update object
    const updateData = {};

    // Full name
    if (firstName || lastName)
      updateData.fullName = `${firstName || ""} ${lastName || ""}`.trim();

    // Address
    if (address) updateData.address = address;

    // Social links
    if (instagramLink || facebookLink || linkedinLink || twitterLink) {
      updateData.socialLinks = {
        instagram: instagramLink,
        facebook: facebookLink,
        linkedIn: linkedinLink,
        twitter: twitterLink,
      };
    }

    // ✅ Phone & WhatsApp numbers
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (whatsappNumber) updateData.whatsappNumber = whatsappNumber;

    // ✅ Handle visibility toggles (convert "true"/"false" strings to booleans)
    if (phoneNumberShow !== undefined) {
      updateData.phoneNumberShow =
        phoneNumberShow === "true" || phoneNumberShow === true;
    }
    if (whatsappNumberShow !== undefined) {
      updateData.whatsappNumberShow =
        whatsappNumberShow === "true" || whatsappNumberShow === true;
    }

    // ✅ Upload profile photo if provided
    if (profilePhoto) {
      const upload = await cloudinary.uploader.upload(profilePhoto.filepath, {
        folder: "users/profilePhotos",
      });
      updateData.profilePhoto = upload.secure_url;
    }

    // ✅ Upload cover photo if provided
    if (coverPhoto) {
      const upload = await cloudinary.uploader.upload(coverPhoto.filepath, {
        folder: "users/coverPhotos",
      });
      updateData.coverPhoto = upload.secure_url;
    }

    // ✅ Update user in database
    const updatedUser = await userModels
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password -otp");

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        success: true,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
