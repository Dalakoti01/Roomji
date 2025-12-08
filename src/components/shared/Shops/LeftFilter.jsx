"use client";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const LeftFilter = ({ filters, setFilters }) => {
  const [localFilter, setLocalFilter] = useState({
    listingStatus: filters?.listingStatus || "Shop",
    category: filters?.category || "", // ✅ Single category instead of array
    priceRange: filters?.priceRange || [10000, 100000],
    rating: filters?.rating || 0,
  });

  // Handle rating
  const handleRating = (value) =>
    setLocalFilter((prev) => ({ ...prev, rating: value }));

  // Handle single category selection
  const handleCategoryChange = (cat) =>
    setLocalFilter((prev) => ({
      ...prev,
      category: prev.category === cat ? "" : cat,
    }));

  // Apply filters
  const applyFilters = () => {
    setFilters?.((prev) => ({
      ...prev,
      listingStatus: localFilter.listingStatus,
      category: localFilter.category,
      priceRange: localFilter.priceRange,
      rating: localFilter.rating,
      applyFilters: true,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    const resetState = {
      listingStatus: "Shop",
      category: "",
      priceRange: [10000, 100000],
      rating: 0,
    };
    setLocalFilter(resetState);
    setFilters?.((prev) => ({
      ...prev,
      ...resetState,
      applyFilters: false,
    }));
  };

  return (
    <div
      className="bg-white rounded-[10px] border border-[rgba(206,208,210,0.40)] p-5 shadow-sm
                 w-full md:w-1/2 lg:w-[301px] flex-shrink-0"
    >
      <h2 className="text-lg font-semibold mb-4">Find Your Shop</h2>

      {/* Listing Status */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Listing Status</h3>
        <div className="flex flex-col gap-2">
          {["Buy", "Rent", "Shops", "Service"].map((item) => (
            <label
              key={item}
              className={`flex items-center gap-2 text-sm ${
                item !== "Shops"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="status"
                checked={item === "Shops"}
                readOnly
                disabled={item !== "Shops"}
                className="accent-[#eb4c60]"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Shop Category (Single Select) */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Shop Category</h3>
        <div className="flex flex-col gap-2">
          {[
            "Retail Shops",
            "Showrooms",
            "Food & Beverage Outlets",
            "Market Stalls & Booths",
            "Street-facing & Standalone Stores",
          ].map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={localFilter.category === cat}
                onChange={() => handleCategoryChange(cat)}
                className="accent-[#eb4c60] cursor-pointer"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <Slider
          value={localFilter.priceRange}
          min={0}
          max={200000}
          step={1000}
          onValueChange={(val) =>
            setLocalFilter((prev) => ({ ...prev, priceRange: val }))
          }
          className="mb-3 cursor-pointer"
        />
        <div className="flex justify-between gap-2">
          <Input value={localFilter.priceRange[0]} readOnly className="cursor-pointer" />
          <Input value={localFilter.priceRange[1]} readOnly className="cursor-pointer" />
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Rating</h3>
        <div className="flex gap-1 cursor-pointer">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              className={`w-5 h-5 cursor-pointer ${
                num <= localFilter.rating
                  ? "fill-[#eb4c60] text-[#eb4c60]"
                  : "text-gray-300"
              }`}
              onClick={() => handleRating(num)}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <Button
        onClick={applyFilters}
        className="w-full bg-[#eb4c60] hover:bg-[#e93c54] text-white mb-3 cursor-pointer"
      >
        Search
      </Button>
      <button
        onClick={resetFilters}
        className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-[#eb4c60] transition cursor-pointer"
      >
        ⟳ Reset Filters
      </button>
    </div>
  );
};

export default LeftFilter;
