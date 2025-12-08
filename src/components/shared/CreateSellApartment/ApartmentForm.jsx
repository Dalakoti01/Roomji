"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, X } from "lucide-react";

export default function ApartmentForm({ onChange }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    policies: [], // ✅ Changed from string to array
    newPolicy: "", // ✅ Added newPolicy for input field
    amenities: [],
    securityDeposit: "",
    area: "",
  });
  const [customAmenity, setCustomAmenity] = useState("");

  const recommended = [
    "Wi-Fi",
    "Commercial Zone",
    "Power Backup",
    "Parking",
    "24/7 water supply",
    "Furnished room",
    "Attached Bathroom",
    "Shared Bathroom",
    "Air conditioning",
    "Washing Machine",
    "Laundry Service",
    "Regular housekeeping",
    "CCTV Surveillance",
    "Security Guard",
    "Parking space",
    "Gym",
    "Mess",
  ];

  const toggleAmenity = (item) => {
    const updated = form.amenities.includes(item)
      ? form.amenities.filter((a) => a !== item)
      : [...form.amenities, item];
    updateField("amenities", updated);
  };

  const updateField = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange && onChange(updated);
  };

  // ✅ Add Policy Function (same as RoomForm)
  const handleAddPolicy = () => {
    const trimmed = form.newPolicy.trim();
    if (!trimmed) return;

    setForm((prev) => {
      const updated = {
        ...prev,
        policies: [...prev.policies, trimmed],
        newPolicy: "",
      };
      onChange && onChange(updated);
      return updated;
    });
  };

  return (
    <form className="bg-gray-50 p-6 rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Sell Property Form
      </h2>

      {/* Title */}
      <div className="mb-6">
        <Label htmlFor="title" className="text-lg">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Room title here..."
          className="mt-2"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <Label htmlFor="description" className="text-lg">
          Description
        </Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Room Description here..."
          className="mt-2"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <Label htmlFor="category" className="text-lg">
          Property Type
        </Label>
        <select
          id="category"
          className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A5F] text-gray-700 cursor-pointer"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Select Property Type</option>
          <option value="PG">PG</option>
          <option value="Room">Room</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Hostel">Hostel</option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-6">
        <Label htmlFor="price" className="text-lg flex items-center gap-1">
          Price <IndianRupee />
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="5000"
          className="mt-2"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
        />
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <Label className="text-lg">Features / Amenities</Label>
        <div className="flex flex-wrap gap-2 mt-3">
          {recommended.map((item) => (
            <Button
              key={item}
              type="button"
              variant={form.amenities.includes(item) ? "default" : "outline"}
              className={`px-3 py-1 rounded-full text-sm ${
                form.amenities.includes(item)
                  ? "bg-[#FF5A5F] text-white cursor-pointer hover:bg-[#ff6a6f]"
                  : "border border-gray-300 cursor-pointer hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
              }`}
              onClick={() => toggleAmenity(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        {/* Custom Amenity */}
        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Add another amenity..."
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              if (customAmenity.trim()) {
                toggleAmenity(customAmenity.trim());
                setCustomAmenity("");
              }
            }}
            className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* ✅ Visible List of Selected Amenities */}
        {form.amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className="text-pink-600 hover:text-pink-800 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Deposit & Area */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <div className="flex-1">
          <Label className="text-sm text-gray-600">Security Deposit (₹)</Label>
          <Input
            type="number"
            value={form.securityDeposit}
            onChange={(e) => updateField("securityDeposit", e.target.value)}
            placeholder="e.g. 1000"
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label className="text-sm text-gray-600">Area (sq.ft)</Label>
          <Input
            type="number"
            value={form.area}
            onChange={(e) => updateField("area", e.target.value)}
            placeholder="e.g. 250"
            className="mt-1"
          />
        </div>
      </div>

      {/* ✅ Policies (copied from RoomForm) */}
      <div className="mb-8 mt-4">
        <Label className="text-lg">Apartment Policies</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Add a policy (e.g. 'No smoking')"
            value={form.newPolicy}
            onChange={(e) => updateField("newPolicy", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPolicy();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddPolicy}
            className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* ✅ Display Policies */}
        {form.policies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.policies.map((policy, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {policy}
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => {
                      const updated = {
                        ...prev,
                        policies: prev.policies.filter((_, i) => i !== idx),
                      };
                      onChange && onChange(updated);
                      return updated;
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
