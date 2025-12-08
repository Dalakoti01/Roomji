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

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { message: "Token Not Found", success: false },
        { status: 404 }
      );
    }

    // DO NOT EXCLUDE OTP FIELDS
    const existingUser = await userModels.findById(userId).select("-password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json(
        { message: "OTP Not Found", success: false },
        { status: 401 }
      );
    }

    // Check OTP existence
    if (!existingUser.otp || !existingUser.otpExpire) {
      return NextResponse.json(
        { message: "OTP was not generated", success: false },
        { status: 400 }
      );
    }

    // Check expiry
    if (existingUser.otpExpire < Date.now()) {
      return NextResponse.json(
        { message: "OTP Expired", success: false },
        { status: 400 }
      );
    }

    // Check OTP match
    if (existingUser.otp !== Number(otp)) {
      return NextResponse.json(
        { message: "The OTP does not match", success: false },
        { status: 400 }
      );
    }

    // Delete user + related data
    await userModels.findByIdAndDelete(userId);
    await rentedPropertiesModels.deleteMany({ owner: userId });
    await sellingPropertiesModels.deleteMany({ owner: userId });
    await shopModels.deleteMany({ owner: userId });
    await serviceModels.deleteMany({ owner: userId });

    return NextResponse.json(
      { message: "Account Deleted Successfully", success: true },
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
