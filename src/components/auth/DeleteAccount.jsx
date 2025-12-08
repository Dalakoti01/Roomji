"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Lock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    reason: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!formData.email.trim() || !formData.reason.trim()) {
        toast.error("Please provide both your email and reason for deletion.");
        return;
      }
      const res = await axios.post("/api/auth/deleteAccount", formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/user/deleteAccountVerification");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#eb4c60]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#eb4c60]/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#eb4c60]/10 p-3 rounded-full">
            <XCircle className="text-[#eb4c60] w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Delete Your Account
          </h1>
        </div>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          We're sorry to see you go. Before we proceed, please tell us the
          reason for your account deletion. An OTP will be sent to your
          registered email for confirmation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your registered email"
                className="pl-10"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Reason for deletion */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Reason for Deletion
            </label>
            <Textarea
              rows={4}
              placeholder="Please tell us why you want to delete your account..."
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              className="focus:ring-[#eb4c60] focus:border-[#eb4c60]"
            />
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-[#eb4c60] w-6 h-6 mt-1" />
            <div>
              <h3 className="text-[#eb4c60] font-semibold mb-1">
                Important Notice
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Deleting your account will permanently remove all your data,
                listings, and preferences. This action cannot be undone once
                confirmed.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#eb4c60] hover:bg-[#f05d6f] text-white font-medium py-3 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {isLoading ? "Sending OTP..." : "Send OTP to Delete Account"}
          </Button>
        </form>

        {/* Back or Cancel */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[#eb4c60] font-medium hover:underline cursor-pointer"
          >
            Cancel and Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
