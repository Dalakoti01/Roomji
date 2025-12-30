"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function ServiceForm({ onChange }) {
  const { savedProperty } = useSelector((store) => store.auth);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    features: [],
    policies: [], // ✅ Changed from string → array
    newPolicy: "", // ✅ Added for input field
  });

  const [customFeature, setCustomFeature] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

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
    "Electrician",
    "Others",
  ];

  const updateField = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange && onChange(updated);
  };

  const toggleFeature = (feature) => {
    const updated = form.features.includes(feature)
      ? form.features.filter((f) => f !== feature)
      : [...form.features, feature];
    updateField("features", updated);
  };

  // ✅ Add policy like ApartmentForm
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
        Service Form
      </h2>

      {/* Title */}
      <div className="mb-6">
        <Label htmlFor="title" className="text-lg">
          Service Title
        </Label>
        <Input
          type="text"
          id="title"
          placeholder="Service title here..."
          className="mt-2"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <Label htmlFor="description" className="text-lg">
          Service Description
        </Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe your service..."
          className="mt-2"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <Label htmlFor="category" className="text-lg">
          Service Category
        </Label>
        <select
          id="category"
          className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#FF5A5F]"
          value={isCustomCategory ? "Other" : form.category}
          onChange={(e) => {
            if (e.target.value === "Other") {
              setIsCustomCategory(true);
              updateField("category", "");
            } else {
              setIsCustomCategory(false);
              updateField("category", e.target.value);
            }
          }}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {isCustomCategory && (
          <div className="mt-3 flex items-center gap-2">
            <Input
              placeholder="Enter custom category..."
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                updateField("category", e.target.value);
              }}
            />
            <Button
              type="button"
              className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white"
              onClick={() => {
                if (customCategory.trim()) setIsCustomCategory(false);
              }}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Price + Duration */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <Label htmlFor="price" className="text-lg flex items-center gap-1">
            Base Price <IndianRupee size={14} />
          </Label>
          <Input
            type="text"
            id="price"
            placeholder="500"
            className="mt-2"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="duration" className="text-lg">
            Service Duration
          </Label>
          <Input
            type="text"
            id="duration"
            placeholder="1 hour / 30 min / Custom"
            className="mt-2"
            value={form.duration}
            onChange={(e) => updateField("duration", e.target.value)}
          />
        </div>
      </div>

      {/* Service Features */}
      <div className="mb-6">
        <Label className="text-lg">Service Features</Label>
        <div className="flex flex-wrap gap-2 mt-3">
          {recommendedFeatures.map((feature) => (
            <Button
              key={feature}
              type="button"
              variant={form.features.includes(feature) ? "default" : "outline"}
              className={`px-3 py-1 rounded-full text-sm ${
                form.features.includes(feature)
                  ? "bg-[#FF5A5F] text-white hover:bg-[#ff6a6f]"
                  : "border border-gray-300 hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
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
            className="bg-[#FF5A5F] hover:bg-[#ff6a6f] text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Features */}
        {form.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className="text-pink-600 hover:text-pink-800 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Service Policies — same structure as ApartmentForm */}
      <div className="mb-8 mt-4">
        <Label className="text-lg">Service Policies</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Add a policy (e.g. 'No cancellation within 24 hrs')"
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

        {/* Show added policies */}
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
