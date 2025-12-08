import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModels";
import RecentActivities from "@/models/recentActivitesModels";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password, phoneNumber, fullName } = await req.json();

    // Basic validation
    if (!email || !password || !phoneNumber || !fullName) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NEXTCONNECTHUB, // ⚠️ Use your app's env vars
        pass: process.env.PASSWORD_NEXTCONNECTHUB,
      },
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        // Already verified user
        return NextResponse.json(
          { message: "User already exists", success: false },
          { status: 400 }
        );
      } else {
        // Exists but not verified → update OTP and resend
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.password = hashedPassword;
        existingUser.phoneNumber = phoneNumber;
        existingUser.fullName = fullName;
        existingUser.otp = otp;
        existingUser.otpExpire = Date.now() + 10 * 60 * 1000; // valid for 10 mins

        await existingUser.save();

        await transporter.sendMail({
          from: process.env.EMAIL_NEXTCONNECTHUB,
          to: email,
          subject: "Your OTP Code - Roomji",
          text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        });

        return NextResponse.json(
          {
            message: "OTP resent to your email. Please verify.",
            success: true,
            user: {
              email: email,
              phoneNumber: phoneNumber,
              fullName: fullName,
            },
          },
          { status: 200 }
        );
      }
    }

    // Case 2: New user → create and send OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      phoneNumber,
      fullName,
      otp,
      otpExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
    });

    await newUser.save();

    await RecentActivities.create({
      user : newUser._id,
      fullName : newUser.fullName,
      type : 'User Joined',
      content : `${newUser.fullName} has registered with Roomji.`,
    })

    await transporter.sendMail({
      from: process.env.EMAIL_NEXTCONNECTHUB,
      to: email,
      subject: "Your OTP Code - Roomji",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return NextResponse.json(
      {
        message: "User registered successfully. OTP sent to email.",
        success: true,
        user: {
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          fullName: newUser.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
