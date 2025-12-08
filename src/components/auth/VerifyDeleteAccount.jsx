"use client";

import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function VerifyDeleteAccountPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter()

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto move to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    setShowConfirm(true);
  };

  const finalDeleteAccount = async () => {
    try {
      setLoading(true);
      const code = otp.join("");

     const res = await axios.post('/api/auth/verifyDeleteAccount',{otp:code},{withCredentials:true});
     if(res.data.success){
        toast.success(res.data.message)
        dispatch(setUser(null));
        router.push('/')

     } else{
        toast.error(res.data.message)
     }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "#eb4c60" }}>
          Verify OTP
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email to proceed with account deletion.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 outline-none bg-gray-50"
              style={{ borderColor: "#eb4c60" }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full py-3 rounded-xl text-white font-semibold transition-all"
          style={{ backgroundColor: "#eb4c60" }}
        >
          Verify OTP
        </button>
      </div>

      {/* Final Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: "#eb4c60" }}
            >
              Are you absolutely sure?
            </h2>

            <p className="text-gray-600 mb-6">
              Deleting your account is irreversible. All your properties,
              services, shops, and data will be permanently removed. This action
              cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={finalDeleteAccount}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#eb4c60" }}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
