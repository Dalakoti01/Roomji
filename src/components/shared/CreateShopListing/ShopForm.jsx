"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function ShopForm({ onChange }) {
  const { savedProperty } = useSelector((store) => store.auth);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "", // ✅ New field for Shop Type
    price: "",
    shopPolicies: [], // ✅ Now an array, not string
    newShopPolicy: "", // ✅ Input field for adding
    amenities: [],
    securityDeposit: "",
    area: "",
  });
  const [customAmenity, setCustomAmenity] = useState("");

  /* ✅ Hydrate form ONCE from savedProperty */
  useEffect(() => {
    if (savedProperty?.title) {
      const hydrated = {
        ...form,
        title: savedProperty.title || "",
        description: savedProperty.description || "",
        price: savedProperty.price || "",
      };

      setForm(hydrated);
      onChange && onChange(hydrated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🏪 Shop-related amenities
  const recommended = [
    "Power Backup",
    "Parking Space",
    "CCTV Surveillance",
    "Security Guard",
    "Storage Room",
    "Display Window",
    "Street Facing",
    "Washroom",
    "Water Supply",
    "Air Conditioning",
    "Fire Safety System",
    "Lift Access",
    "Loading/Unloading Area",
    "High Footfall Area",
    "Signage Space",
    "Shutter Door",
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

  // ✅ Add policy just like in RoomForm
  const handleAddPolicy = () => {
    const trimmed = form.newShopPolicy.trim();
    if (!trimmed) return;

    setForm((prev) => {
      const updated = {
        ...prev,
        shopPolicies: [...prev.shopPolicies, trimmed],
        newShopPolicy: "",
      };
      onChange && onChange(updated);
      return updated;
    });
  };

  return (
    <form className="bg-gray-50 p-6 rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Rent Shop Form
      </h2>

      {/* Title */}
      <div className="mb-6">
        <Label htmlFor="title" className="text-lg">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Shop title here..."
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
          placeholder="Shop description here..."
          className="mt-2"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* ✅ Select Shop Type */}
      <div className="mb-6">
        <Label htmlFor="category" className="text-lg">
          Select Shop Type
        </Label>
        <select
          id="category"
          className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A5F] text-gray-700 cursor-pointer"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Select Shop Type</option>
          <option value="Retail Shops">Retail Shops</option>
          <option value="Showrooms">Showrooms</option>
          <option value="Food & Beverage Outlets">
            Food & Beverage Outlets
          </option>
          <option value="Market Stalls & Booths">Market Stalls & Booths</option>
          <option value="Street-facing & Standalone Stores">
            Street-facing & Standalone Stores
          </option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-6">
        <Label htmlFor="price" className="text-lg flex items-center gap-1">
          Rent Price <IndianRupee />
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="e.g. 15000"
          className="mt-2"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
        />
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <Label className="text-lg">Shop Features / Amenities</Label>
        <div className="flex flex-wrap gap-2 mt-3">
          {recommended.map((item) => (
            <Button
              key={item}
              type="button"
              variant={form.amenities.includes(item) ? "default" : "outline"}
              className={`px-3 py-1 rounded-full text-sm ${
                form.amenities.includes(item)
                  ? "bg-[#FF5A5F] cursor-pointer text-white hover:bg-[#ff6a6f]"
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (customAmenity.trim()) {
                  toggleAmenity(customAmenity.trim());
                  setCustomAmenity("");
                }
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              if (customAmenity.trim()) {
                toggleAmenity(customAmenity.trim());
                setCustomAmenity("");
              }
            }}
            className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white cursor-pointer"
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
            placeholder="e.g. 5000"
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label className="text-sm text-gray-600">Area (sq.ft)</Label>
          <Input
            type="number"
            value={form.area}
            onChange={(e) => updateField("area", e.target.value)}
            placeholder="e.g. 300"
            className="mt-1"
          />
        </div>
      </div>

      {/* ✅ Shop Policies Section */}
      <div className="mb-8 mt-4">
        <Label className="text-lg">Shop Policies</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Add a policy (e.g. 'No food stalls')"
            value={form.newShopPolicy}
            onChange={(e) => updateField("newShopPolicy", e.target.value)}
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

        {/* Display Policies */}
        {form.shopPolicies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.shopPolicies.map((policy, idx) => (
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
                        shopPolicies: prev.shopPolicies.filter(
                          (_, i) => i !== idx
                        ),
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
