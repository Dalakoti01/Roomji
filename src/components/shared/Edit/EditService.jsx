"use client";

import useGetSingleService from "@/hooks/public/useGetSingleService";
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

const recommendedFeatures = [
  "Home Visit Available",
  "24/7 Support",
  "Certified Professional",
  "Free Consultation",
  "Warranty Included",
  "Fast Response",
  "Eco-Friendly Materials",
  "Online Booking",
  "Flexible Scheduling",
];

const categories = [
  "Barber",
  "Tiffin Service",
  "Repairing",
  "Electrician",
  "House Cleaning",
  "Beauty",
  "Grooming",
  "Tutoring",
  "Others",
];

export default function EditService() {
  const { id } = useParams();
  const router = useRouter();

  useGetSingleService(id);
  const { selectedProperty } = useSelector((store) => store.auth);

  const [customFeature, setCustomFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    features: [],
    policies: [],
    newPolicy: "",
    isPublic: true,
  });

  /* ✅ Hydrate form from selected service */
  useEffect(() => {
    if (selectedProperty?._id) {
      setForm({
        title: selectedProperty.title || "",
        description: selectedProperty.description || "",
        category: selectedProperty.category || "",
        price: selectedProperty.owner?.price || "",
        duration: selectedProperty.owner?.duration || "",
        features: selectedProperty.serviceFeatures || [],
        policies: selectedProperty.owner?.policies || [],
        newPolicy: "",
        isPublic: selectedProperty.isPublic ?? true,
      });
    }
  }, [selectedProperty]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
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
      category: form.category,
      serviceFeatures: form.features,
      owner: {
        price: form.price,
        duration: form.duration,
        policies: form.policies,
      },
      isPublic: form.isPublic,
    };

    try {
      setIsSubmitting(true);

      const { data } = await axios.put(
        `/api/edit/service/${id}`,
        payload
      );

      if (data?.success) {
        toast.success("Service updated successfully");
        router.back();
      } else {
        toast.error(data?.message || "Failed to update service");
      }
    } catch (error) {
      console.error("UPDATE SERVICE ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProperty) {
    return <div className="p-6 text-center">Loading service...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Service
        </h1>
        <p className="text-gray-500 text-sm">
          Update your service details carefully
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-8"
      >
        {/* Title */}
        <div>
          <Label className="text-lg">Service Title</Label>
          <Input
            className="mt-2"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Service title"
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
            placeholder="Describe your service"
          />
        </div>

        {/* Category */}
        <div>
          <Label className="text-lg">Category</Label>
          <select
            className="mt-2 w-full border rounded-md px-3 py-2 cursor-pointer"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-lg flex items-center gap-1">
              Base Price <IndianRupee />
            </Label>
            <Input
              type="number"
              className="mt-2"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <div>
            <Label className="text-lg">Duration</Label>
            <Input
              className="mt-2"
              value={form.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="e.g. 1 hour"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <Label className="text-lg">Service Features</Label>

          <div className="flex flex-wrap gap-2 mt-3">
            {recommendedFeatures.map((feature) => (
              <Button
                key={feature}
                type="button"
                variant={form.features.includes(feature) ? "default" : "outline"}
                className={`rounded-full text-sm ${
                  form.features.includes(feature)
                    ? "bg-[#ec4c60] text-white hover:bg-[#f05f70]"
                    : "border hover:border-[#ec4c60] hover:text-[#ec4c60]"
                } cursor-pointer`}
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </Button>
            ))}
          </div>

          {/* Custom Feature */}
          <div className="flex items-center gap-2 mt-4">
            <Input
              placeholder="Add another feature..."
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => {
                if (customFeature.trim()) {
                  toggleFeature(customFeature.trim());
                  setCustomFeature("");
                }
              }}
              className="bg-[#ec4c60] hover:bg-[#f05f70] text-white cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {form.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {form.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature)}
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
          <Label className="text-lg">Service Policies</Label>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add a policy"
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
                        policies: prev.policies.filter((_, i) => i !== idx),
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
