"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm({ onToggle }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((store) => store.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));

        toast.success(res.data.message);

        const role = res.data.user.role;

        if (role !== "admin") {
          router.push("/");
        } else {
          router.push("/admin/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
        <p className="text-gray-500 mt-2">
          Please enter your details to sign in
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300 focus:ring-[#EB4C60]/30 focus:border-[#EB4C60] transition"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Link
              href="/forget-password"
              className="text-sm text-[#EB4C60] hover:underline transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

        {/* Submit */}
        {loading ? (
          <Button className="w-full cursor-pointer bg-[#EB4C60] hover:bg-[#d43c50] text-white font-medium py-3 rounded-lg shadow-md transition">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Please Wait ...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full cursor-pointer bg-[#EB4C60] hover:bg-[#d43c50] text-white font-medium py-3 rounded-lg shadow-md transition"
          >
            Sign In
          </Button>
        )}
      </form>

      <div className="text-center mt-8">
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <button
            onClick={onToggle}
            type="button"
            className="text-[#EB4C60] font-medium hover:underline cursor-pointer transition"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
