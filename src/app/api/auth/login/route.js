import { connectDB } from "@/lib/db";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if email is verified
    if (!existingUser.verified) {
      return NextResponse.json(
        {
          message: "Please verify your email before logging in",
          success: false,
        },
        { status: 403 }
      );
    }

    // Check if user is blocked
    if (existingUser.blocked) {
      return NextResponse.json(
        {
          message: "Your account has been blocked by the admin",
          success: false,
        },
        { status: 403 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    // Remove password before sending user data
    const userWithoutPassword = await User.findById(existingUser._id).select(
      "-password"
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );

    // Set token cookie (7 days)
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
