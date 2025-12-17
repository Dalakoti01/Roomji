"use client";

import React, { useState, useMemo } from "react";
import TopFilter from "../Rooms/TopFilter";
import ShortCard from "../ShortCard";
import useGetAllSellingProperties from "@/hooks/public/useGetAllSellingProperties";
import { useDispatch, useSelector } from "react-redux";
import LeftFilter from "./LeftFilter";
import { setSelectedProperty } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

const HeroBuyProperty = () => {
  // 🔹 Fetch all selling properties
  const dispatch = useDispatch();
  const router = useRouter()
  useGetAllSellingProperties();
  const { sellingProperties } = useSelector((store) => store.auth);
  console.log("these are the selling properties", sellingProperties);

  // 🔹 Shared filters
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    locality: "",
    listingStatus: "Buy",
    propertyTypes: [],
    priceRange: [0, 100000],
    rating: 0,
    applyFilters: false,
  });

  // 🔹 Sort order
  const [sortOrder, setSortOrder] = useState("newest");

  // 🔹 Filtering logic
  const filteredProperties = useMemo(() => {
    const all = sellingProperties || [];

    const { state, city, locality, propertyTypes, priceRange, rating } =
      filters;

    if (!all.length) return [];

    const filtered = all.filter((property) => {
      const {
        address,
        price,
        overallratings,
        propertyTypes: type,
      } = property || {};

      const stateMatch = state
        ? address?.state?.toLowerCase().includes(state.toLowerCase())
        : true;
      const cityMatch = city
        ? address?.city?.toLowerCase().includes(city.toLowerCase())
        : true;
      const localityMatch = locality
        ? address?.detailedAddress
            ?.toLowerCase()
            .includes(locality.toLowerCase())
        : true;

      const typeMatch =
        propertyTypes.length > 0 ? propertyTypes.includes(type) : true;

      const numericPrice = Number(price) || 0;
      const priceMatch =
        numericPrice >= priceRange[0] && numericPrice <= priceRange[1];

      const ratingMatch = (overallratings || 0) >= rating;

      return (
        stateMatch &&
        cityMatch &&
        localityMatch &&
        typeMatch &&
        priceMatch &&
        ratingMatch
      );
    });

    console.log("Filtered Buy Properties Count:", filtered.length);
    return sortOrder === "oldest" ? filtered.slice().reverse() : filtered;
  }, [sellingProperties, filters, sortOrder]);

  console.log("all the filtered buy properties", filteredProperties);

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      {/* Top Filter Section */}
      <div className="bg-white shadow-sm p-5 w-full border-b">
        <TopFilter
          selectedCategory="Selling Property"
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 px-5 py-10 w-full max-w-[1400px] mx-auto">
        {/* Left Filter Section */}
        <div className="flex-shrink-0 self-start">
          <h1 className="my-4 text-start font-semibold text-lg">Filters</h1>
          <LeftFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Right Cards Section */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h1 className="text-gray-700 font-medium">
              Showing {filteredProperties.length} results
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
            {filteredProperties.map((property) => (
              <ShortCard
                onClick={() => {
                  dispatch(setSelectedProperty(property));
                  router.push(`/sellProperty/${property._id}`);
                }}
                key={property._id}
                image={property?.photos?.[0] || "/shortCard.png"}
                title={property?.title || "Untitled Property"}
                address={`${property?.address?.city || ""}, ${
                  property?.address?.state || ""
                }`}
                description={
                  property?.description || "No description available"
                }
                price={property?.price ? Number(property.price) : undefined}
                ownerName={property?.owner?.fullName || "Unknown Owner"}
                ownerPhoto={
                  property?.ownerId?.profilePhoto || "/default-avatar.png"
                }
                isVerified={true}
              />
            ))}
          </div>

          {/* Pagination (static placeholder) */}
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

export default HeroBuyProperty;
