import { connectDB } from "@/lib/db";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; 


export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email Cannot Be Empty", success: false },
        { status: 401 }
      );
    }

    const existingUser = await userModels
      .findOne({ email })
      .select("-password -otp");
    if (!existingUser || existingUser?.verified === false) {
      return NextResponse.json(
        { message: "No Such User Found", success: false },
        { status: 404 }
      );
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000);

    existingUser.otp = generatedOtp;
    existingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins expiry
    await existingUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NEXTCONNECTHUB,
        pass: process.env.PASSWORD_NEXTCONNECTHUB,
      },
    });

    const mailOptions = {
      from: `"Doctors Online" <${process.env.EMAIL_NEXTCONNECTHUB}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <b>${generatedOtp}</b></p>
               <p>This OTP is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email",
        user: { email: email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending OTP",
      },
      { status: 500 }
    );
  }
}
