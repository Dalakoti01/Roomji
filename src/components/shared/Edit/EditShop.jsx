"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Plus, X, IndianRupee } from "lucide-react";
import useGetSingleShop from "@/hooks/public/useGetSingleShop";

const PRIMARY = "#ec4c60";

/* 🏪 Shop Categories */
const shopCategoryOptions = [
  "Retail Shops",
  "Showrooms",
  "Food & Beverage Outlets",
  "Market Stalls & Booths",
  "Street-facing & Standalone Stores",
];

/* 🏪 Recommended Shop Amenities */
const recommendedAmenities = [
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

export default function EditShop() {
  const { id } = useParams();
  const router = useRouter();

  /* ⚠️ You are still using the same hook */
  useGetSingleShop(id);
  const { selectedProperty } = useSelector((store) => store.auth);

  const [customAmenity, setCustomAmenity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    securityDeposit: "",
    area: "",
    amenities: [],
    shopPolicies: [],
    newShopPolicy: "",
    city: "",
    state: "",
    detailedAddress: "",
    isPublic: true,
  });

  /* ✅ Hydrate form from selectedProperty */
  useEffect(() => {
    if (selectedProperty?._id) {
      setForm({
        title: selectedProperty.title || "",
        description: selectedProperty.description || "",
        category: selectedProperty.category || "",
        price: selectedProperty.price || "",
        securityDeposit: selectedProperty.securityDeposit || "",
        area: selectedProperty.area || "",
        amenities: selectedProperty.amenities || [],
        shopPolicies: selectedProperty.shopPolicies || [],
        newShopPolicy: "",
        city: selectedProperty.address?.city || "",
        state: selectedProperty.address?.state || "",
        detailedAddress: selectedProperty.address?.detailedAddress || "",
        isPublic: selectedProperty.isPublic ?? true,
      });
    }
  }, [selectedProperty]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ✅ Toggle Amenity */
  const toggleAmenity = (item) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  /* ✅ Add Shop Policy */
  const handleAddPolicy = () => {
    const trimmed = form.newShopPolicy.trim();
    if (!trimmed) return;

    setForm((prev) => ({
      ...prev,
      shopPolicies: [...prev.shopPolicies, trimmed],
      newShopPolicy: "",
    }));
  };

  /* ✅ Submit Update */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: form.price,
      securityDeposit: form.securityDeposit,
      area: form.area,
      amenities: form.amenities,
      shopPolicies: form.shopPolicies,
      address: {
        city: form.city,
        state: form.state,
        detailedAddress: form.detailedAddress,
      },
      isPublic: form.isPublic,
    };

    try {
      setIsSubmitting(true);

      const { data } = await axios.put(
        `/api/edit/shop/${id}`,
        payload
      );

      if (data?.success) {
        toast.success("Shop updated successfully");
        router.back();
      } else {
        toast.error(data?.message || "Failed to update shop");
      }
    } catch (error) {
      console.error("UPDATE SHOP ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProperty) {
    return <div className="p-6 text-center">Loading shop...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Shop
        </h1>
        <p className="text-gray-500 text-sm">
          Update your shop details carefully
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-8"
      >
        {/* Title */}
        <div>
          <Label className="text-lg">Title</Label>
          <Input
            className="mt-2"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Shop title"
          />
        </div>

        {/* Description */}
        <div>
          <Label className="text-lg">Description</Label>
          <Textarea
            rows={4}
            className="mt-2"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your shop"
          />
        </div>

        {/* Category, Price, Deposit, Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <Label className="text-lg">Shop Category</Label>
            <select
              className="mt-2 w-full border rounded-md px-3 py-2 cursor-pointer focus:ring-1"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              <option value="">Select category</option>
              {shopCategoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-lg flex items-center gap-1">
              Rent Price <IndianRupee />
            </Label>
            <Input
              type="number"
              className="mt-2"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="Monthly rent"
            />
          </div>

          <div>
            <Label className="text-lg">Security Deposit (₹)</Label>
            <Input
              type="number"
              className="mt-2"
              value={form.securityDeposit}
              onChange={(e) =>
                updateField("securityDeposit", e.target.value)
              }
              placeholder="e.g. 5000"
            />
          </div>

          <div>
            <Label className="text-lg">Area (sq.ft)</Label>
            <Input
              type="number"
              className="mt-2"
              value={form.area}
              onChange={(e) => updateField("area", e.target.value)}
              placeholder="e.g. 300"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label className="text-lg">Shop Amenities</Label>

          <div className="flex flex-wrap gap-2 mt-3">
            {recommendedAmenities.map((item) => (
              <Button
                key={item}
                type="button"
                variant={
                  form.amenities.includes(item)
                    ? "default"
                    : "outline"
                }
                className={`rounded-full text-sm ${
                  form.amenities.includes(item)
                    ? "bg-[#ec4c60] text-white hover:bg-[#f05f70]"
                    : "border hover:border-[#ec4c60] hover:text-[#ec4c60]"
                } cursor-pointer`}
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
              className="bg-[#ec4c60] hover:bg-[#f05f70] text-white cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {form.amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {form.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className="cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Shop Policies */}
        <div>
          <Label className="text-lg">Shop Policies</Label>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add a policy"
              value={form.newShopPolicy}
              onChange={(e) =>
                updateField("newShopPolicy", e.target.value)
              }
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
              className="bg-[#ec4c60] hover:bg-[#f05f70] text-white cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {form.shopPolicies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.shopPolicies.map((policy, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {policy}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        shopPolicies: prev.shopPolicies.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#ec4c60] hover:bg-[#f05f70] text-white cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
