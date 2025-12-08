"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// --- Move these OUTSIDE ---
const PasswordInput = ({
  label,
  field,
  placeholder = "••••••••",
  value,
  onChange,
  show,
  toggleShow,
}) => (
  <div className="space-y-2">
    <Label htmlFor={field} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="relative">
      <Input
        id={field}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <button
        type="button"
        onClick={() => toggleShow(field)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? (
          <EyeOff className="h-4 w-4 cursor-pointer" />
        ) : (
          <Eye className="h-4  cursor-pointer w-4" />
        )}
      </button>
    </div>
  </div>
);

const TwoFactorOption = ({ title, description, isEnabled, onToggle }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <Switch
      checked={isEnabled}
      onCheckedChange={onToggle}
      className="data-[state=checked]:bg-blue-600 cursor-pointer"
    />
  </div>
);
// --- End moved components ---

const PasswordSecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [twoFactorSettings, setTwoFactorSettings] = useState({
    primaryEmail: true,
    smsRecovery1: false,
    smsRecovery2: false,
  });

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTwoFactorToggle = (setting) => {
    setTwoFactorSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const changePasswordHandler = async () => {
    try {
      setLoading(true);
      console.log("body", passwords);
      const res = await axios.post("/api/user/change-password", passwords, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/");
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full   p-4 sm:p-6 lg:p-8 lg:px-12 bg-white space-y-8">
      {/* Change Password Section */}
      <div className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Change Password
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="md:col-span-1">
            <PasswordInput
              label="Old Password"
              field="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              show={showPasswords.oldPassword}
              toggleShow={togglePasswordVisibility}
            />
          </div>

          <div className="md:col-span-1">
            <PasswordInput
              label="New Password"
              field="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              show={showPasswords.newPassword}
              toggleShow={togglePasswordVisibility}
            />
          </div>

          <div className="md:col-span-2">
            <PasswordInput
              label="Confirm Password"
              field="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              show={showPasswords.confirmPassword}
              toggleShow={togglePasswordVisibility}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          {loading ? (
            <Button className="bg-[#eb4c60] cursor-pointer hover:bg-[#e9324b] px-6 py-2.5">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving ...
            </Button>
          ) : (
            <Button
              onClick={changePasswordHandler}
              className="bg-[#eb4c60] cursor-pointer hover:bg-[#e9324b] px-6 py-2.5"
            >
              Save Change
            </Button>
          )}

          <Button
            variant="outline"
            className="border-red-300 text-red-600 cursor-pointer hover:bg-red-50 hover:border-red-400 px-6 py-2.5"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Two-Factor Authentication
        </h2>

        <div className="space-y-1">
          <TwoFactorOption
            title="Primary E-mail"
            description="E-mail used to send notifications"
            isEnabled={twoFactorSettings.primaryEmail}
            onToggle={() => handleTwoFactorToggle("primaryEmail")}
          />

          <div className="border-t border-gray-100"></div>

          <TwoFactorOption
            title="SMS Recovery"
            description="Your phone number or something"
            isEnabled={twoFactorSettings.smsRecovery1}
            onToggle={() => handleTwoFactorToggle("smsRecovery1")}
          />

          <div className="border-t border-gray-100"></div>

          <TwoFactorOption
            title="SMS Recovery"
            description="Your phone number or something"
            isEnabled={twoFactorSettings.smsRecovery2}
            onToggle={() => handleTwoFactorToggle("smsRecovery2")}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordSecuritySettings;
