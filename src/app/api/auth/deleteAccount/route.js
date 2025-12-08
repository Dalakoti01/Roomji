import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    const existingUser = await userModels.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }

    const { email, reason } = await req.json();

    if (!email || !reason) {
      return NextResponse.json(
        { message: "Something is Missing", success: false },
        { status: 401 }
      );
    }
    console.log(email,reason)

    if (existingUser.email !== email) {
      return NextResponse.json(
        { message: "This Email is not registered with us", success: false },
        { status: 400 }
      );
    }

    // --------------------------
    // 1️⃣ Generate OTP
    // --------------------------
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    existingUser.otp = otp;
    existingUser.otpExpire = otpExpire;

    await existingUser.save();

    // --------------------------
    // 2️⃣ Send Email with OTP
    // --------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NEXTCONNECTHUB,
        pass: process.env.PASSWORD_NEXTCONNECTHUB,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_NEXTCONNECTHUB,
      to: email,
      subject: "Roomji Account Deletion OTP",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Your Account Deletion OTP</h2>
          <p>Your OTP for deleting your Roomji account is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        message: "OTP Sent Successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Delete OTP Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
