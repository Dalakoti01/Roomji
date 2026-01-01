
"use client";

import useGetSingleRentedRoom from "@/hooks/public/useGetSingleRentedRoom";
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

const PRIMARY = "#ec4c60";

const propertyTypeOptions = [
  "PG",
  "Room",
  "Villa",
  "Apartment",
  "House",
  "Hostel",
];

const recommendedAmenities = [
  "Wi-Fi",
  "Power Backup",
  "Parking",
  "24/7 Water Supply",
  "Furnished Room",
  "Attached Bathroom",
  "Air Conditioning",
  "Washing Machine",
  "Laundry Service",
  "Housekeeping",
  "CCTV Surveillance",
  "Security Guard",
  "Gym",
  "Mess",
];

export default function EditRentedProperties() {
  const { id } = useParams();
  const router = useRouter();

  useGetSingleRentedRoom(id);
  const { selectedProperty } = useSelector((store) => store.auth);

  const [customAmenity, setCustomAmenity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyTypes: "",
    price: "",
    securityDeposit: "",
    area: "",
    amenities: [],
    policies: [],
    newPolicy: "",
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
        propertyTypes: selectedProperty.propertyTypes || "",
        price: selectedProperty.price || "",
        securityDeposit: selectedProperty.securityDeposit || "",
        area: selectedProperty.area || "",
        amenities: selectedProperty.amenities || [],
        policies: selectedProperty.roomPolicies || [],
        newPolicy: "",
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

  const toggleAmenity = (item) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleAddPolicy = () => {
    const trimmed = form.newPolicy.trim();
    if (!trimmed) return;

    setForm((prev) => ({
      ...prev,
      policies: [...prev.policies, trimmed],
      newPolicy: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      propertyTypes: form.propertyTypes,
      price: form.price,
      securityDeposit: form.securityDeposit,
      area: form.area,
      amenities: form.amenities,
      roomPolicies: form.policies,
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
        `/api/edit/rentedProperty/${id}`,
        payload
      );

      if (data?.success) {
        toast.success("Property updated successfully");
        router.back();
      } else {
        toast.error(data?.message || "Failed to update property");
      }
    } catch (error) {
      console.error("UPDATE RENTED PROPERTY ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProperty) {
    return <div className="p-6 text-center">Loading property...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Rented Property
        </h1>
        <p className="text-gray-500 text-sm">
          Update your property details carefully
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
            placeholder="Property title"
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
            placeholder="Describe your property"
          />
        </div>

        {/* Property Type, Price, Deposit, Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <Label className="text-lg">Property Type</Label>
            <select
              className="mt-2 w-full border rounded-md px-3 py-2 cursor-pointer focus:ring-1"
              value={form.propertyTypes}
              onChange={(e) =>
                updateField("propertyTypes", e.target.value)
              }
            >
              <option value="">Select type</option>
              {propertyTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-lg flex items-center gap-1">
              Price <IndianRupee />
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
              placeholder="e.g. 10000"
            />
          </div>

          <div>
            <Label className="text-lg">Area (sq.ft)</Label>
            <Input
              type="number"
              className="mt-2"
              value={form.area}
              onChange={(e) => updateField("area", e.target.value)}
              placeholder="e.g. 250"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label className="text-lg">Features / Amenities</Label>

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

        {/* Policies */}
        <div>
          <Label className="text-lg">Room Policies</Label>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add a policy"
              value={form.newPolicy}
              onChange={(e) =>
                updateField("newPolicy", e.target.value)
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

          {form.policies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.policies.map((policy, idx) => (
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
                        policies: prev.policies.filter(
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
