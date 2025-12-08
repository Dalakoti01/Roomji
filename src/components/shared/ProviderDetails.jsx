"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, Phone, Briefcase, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // using shadcn/ui Switch

export default function ProviderDetails({
  email,
  fullName,
  uniqueId,
  phoneNumber,
  showPhoneNumber: initialShowPhone = true, // default true
  photo,
  onChange, // ✅ callback to parent
}) {
  // ✅ Local state for editable fields
  const [details, setDetails] = useState({
    fullName: fullName || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
    uniqueId: uniqueId || "",
    personalNote: "",
    profession: "",
    showPhoneNumber: initialShowPhone,
  });

  // When parent data changes (on user load), sync it
  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      fullName: fullName || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      uniqueId: uniqueId || "",
      showPhoneNumber: initialShowPhone,
    }));
  }, [fullName, email, phoneNumber, uniqueId, initialShowPhone]);

  // Handle input changes
  const handleChange = (field, value) => {
    const updated = { ...details, [field]: value };
    setDetails(updated);
    onChange && onChange(updated); // ✅ send updated data back to parent
  };

  return (
    <div className="bg-gray-50 p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Provider Details
      </h2>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative flex flex-col items-center">
          <Image
            src={
              photo ||
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=256&q=80"
            }
            alt="Provider"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Editable Inputs */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <Label className="text-gray-700">Full Name</Label>
          <Input
            value={details.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Provider ID */}
        <div>
          <Label className="text-gray-700">Provider ID</Label>
          <Input
            value={details.uniqueId}
            readOnly
            className="mt-1 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <Input
            type="email"
            value={details.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Phone with Toggle */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <Input
              type="tel"
              value={details.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between mt-1">
            <Label className="text-gray-700 text-sm">
              Show my contact number publicly
            </Label>
            <Switch
              checked={details.showPhoneNumber}
              onCheckedChange={(checked) =>
                handleChange("showPhoneNumber", checked)
              }
            />
          </div>
        </div>

        {/* Personal Note */}
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Add a personal note (optional)"
            value={details.personalNote}
            onChange={(e) => handleChange("personalNote", e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Profession */}
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Profession"
            value={details.profession}
            onChange={(e) => handleChange("profession", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
