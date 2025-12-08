"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

export function RegisterForm({ onToggle }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false); // ✅ new state
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // ✅ Real-time password match check
  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordMatchError(password !== confirmPassword);
    } else {
      setPasswordMatchError(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordMatchError) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "/api/auth/register",
        { fullName: name, email, phoneNumber: phone, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser({ email: email }));
        toast.success(res.data.message);
        router.push("/verify-email?from=register");
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Create an account</h1>
        <p className="text-gray-500 mt-2">
          Please enter your details to sign up
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-gray-300 focus:ring-[#EB4C60]/30 focus:border-[#EB4C60] transition"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300 focus:ring-[#EB4C60]/30 focus:border-[#EB4C60] transition"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{10}"
            maxLength={10}
            required
            className="border-gray-300 focus:ring-[#EB4C60]/30 focus:border-[#EB4C60] transition"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-300 focus:ring-[#EB4C60]/30 focus:border-[#EB4C60] pr-10 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-gray-700">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`pr-10 transition ${
                passwordMatchError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#EB4C60]/30 focus:border-[#EB4C60]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordMatchError && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>
        {loading ? (
          <Button variant="outline" className="disabled w-full">
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please Wait ...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full cursor-pointer bg-[#EB4C60] hover:bg-[#d43c50] text-white font-medium py-3 rounded-lg shadow-md transition"
          >
            Sign Up
          </Button>
        )}
      </form>

      <div className="text-center mt-8">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={onToggle}
            type="button"
            className="text-[#EB4C60] font-medium hover:underline cursor-pointer transition"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
