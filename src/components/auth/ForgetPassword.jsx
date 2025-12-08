"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { setUser } from "@/redux/authSlice";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  // 📨 Send OTP Request
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/forget-password", { email });

      if (res.data.success) {
        dispatch(setUser({email : email}));
        toast.success(res.data.message);
        setOtpSent(true);
        setTimer(30);
        router.push("/verify-email?from=forget");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Timer Countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF5F6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#EB4C60]">
          Forgot Password
        </h2>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter your email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-[#EB4C60] hover:bg-[#e42e46] text-white font-medium py-2"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">
              ✅ OTP has been sent to your email: {email}
            </p>

            <Button
              onClick={() => {
                if (timer === 0) {
                  setOtpSent(false);
                }
              }}
              variant="outline"
              disabled={timer > 0}
              className={`w-full cursor-pointer transition-all ${
                timer > 0
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-[#EB4C60] hover:text-white"
              }`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Send Again"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
