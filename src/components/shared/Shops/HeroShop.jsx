"use client";

import React, { useState, useMemo } from "react";
import TopFilter from "../Rooms/TopFilter";
import LeftFilter from "./LeftFilter";
import ShortCard from "../ShortCard";
import useGetAllShops from "@/hooks/public/useGetAllShops";
import { useSelector } from "react-redux";

const HeroShop = () => {
  // 🔹 Fetch all shops
  useGetAllShops();
  const { allShops } = useSelector((store) => store.auth);
  console.log("these are the shops", allShops);

  // 🔹 Shared filters
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    locality: "",
    listingStatus: "Shop",
    propertyTypes: [],
    priceRange: [0, 200000],
    rating: 0,
    applyFilters: false,
  });

  // 🔹 Sort order
  const [sortOrder, setSortOrder] = useState("newest");

  // 🔹 Filtering logic
  const filteredShops = useMemo(() => {
    const all = allShops || [];

const { state, city, locality, category, priceRange, rating } = filters;
    if (!all.length) return [];

const filtered = all.filter((shop) => {
  const { address, price, overallratings, category: shopCategory } = shop || {};

  const stateMatch = state ? address?.state?.toLowerCase().includes(state.toLowerCase()) : true;
  const cityMatch = city ? address?.city?.toLowerCase().includes(city.toLowerCase()) : true;
  const localityMatch = locality
    ? address?.detailedAddress?.toLowerCase().includes(locality.toLowerCase())
    : true;

  const categoryMatch = category ? shopCategory === category : true;

  const numericPrice = parseFloat(price);
  const priceMatch =
    !isNaN(numericPrice)
      ? numericPrice >= priceRange[0] && numericPrice <= priceRange[1]
      : true;

  const ratingMatch = (overallratings || 0) >= rating;

  return stateMatch && cityMatch && localityMatch && categoryMatch && priceMatch && ratingMatch;
});

    console.log("Filtered Shops Count:", filtered.length);
    return sortOrder === "oldest" ? filtered.slice().reverse() : filtered;
  }, [allShops, filters, sortOrder]);

  console.log("filtered shops", filteredShops);

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      {/* Top Filter */}
      <div className="bg-white shadow-sm p-5 w-full border-b">
        <TopFilter selectedCategory="Shops" filters={filters} setFilters={setFilters} />
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-8 px-5 py-10 w-full max-w-[1400px] mx-auto">
        {/* Left Filter */}
        <div className="flex-shrink-0 self-start">
          <h1 className="my-4 text-start font-semibold text-lg">Filters</h1>
          <LeftFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Cards Section */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h1 className="text-gray-700 font-medium">
              Showing {filteredShops.length} results
            </h1>

            {/* Sort Dropdown */}
            <div className="flex items-center mr-5 gap-2 text-sm">
              <span className="text-gray-500">Sort by</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#eb4c60] cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div
            className="grid gap-8 
              grid-cols-1 
              sm:grid-cols-1 
              md:grid-cols-2 
              xl:grid-cols-3"
          >
            {filteredShops.map((shop) => (
              <ShortCard
                key={shop._id}
                image={shop?.photos?.[0] || "/shortCard.png"}
                title={shop?.title || "Untitled Shop"}
                address={`${shop?.address?.city || ""}, ${shop?.address?.state || ""}`}
                description={shop?.description || "No description available"}
                price={shop?.price ? Number(shop.price) : undefined}
                ownerName={shop?.owner?.fullName || "Unknown Owner"}
                ownerPhoto={shop?.ownerId?.profilePhoto || "/default-avatar.png"}
                isVerified={true}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className="px-3 py-1 border rounded-md hover:bg-[#eb4c60] hover:text-white transition"
              >
                {num}
              </button>
            ))}
            <span className="px-2">...</span>
            <button className="px-3 py-1 border rounded-md hover:bg-[#eb4c60] hover:text-white transition">
              13
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroShop;
