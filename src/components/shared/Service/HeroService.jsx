"use client";

import React, { useState, useMemo } from "react";
import TopFilter from "../Rooms/TopFilter";
import LeftFilter from "./LeftFilter";
import ShortCard from "../ShortCard";
import useGetAllServices from "@/hooks/public/useGetAllServices";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProperty } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

const HeroService = () => {
  // 🔹 Fetch all services
  const dispatch = useDispatch();
  const router = useRouter()
  useGetAllServices();
  const { allServices } = useSelector((store) => store.auth);
  console.log("these are the services", allServices);

  // 🔹 Shared filters
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    locality: "",
    listingStatus: "Service",
    propertyTypes: [],
    priceRange: [0, 100000],
    rating: 0,
    applyFilters: false,
  });

  // 🔹 Sort order
  const [sortOrder, setSortOrder] = useState("newest");

  // 🔹 Filtering logic
  const filteredServices = useMemo(() => {
    const all = allServices || [];

    const { state, city, locality, propertyTypes, priceRange, rating } =
      filters;
    if (!all.length) return [];

    const filtered = all.filter((service) => {
      const {
        address,
        price,
        overallratings,
        propertyTypes: type,
      } = service || {};

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

      const numericPrice = parseFloat(price);
      const priceMatch = !isNaN(numericPrice)
        ? numericPrice >= priceRange[0] && numericPrice <= priceRange[1]
        : true;

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

    console.log("Filtered Services Count:", filtered.length);
    return sortOrder === "oldest" ? filtered.slice().reverse() : filtered;
  }, [allServices, filters, sortOrder]);

  console.log("filtered services", filteredServices);

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      {/* Top Filter */}
      <div className="bg-white shadow-sm p-5 w-full border-b">
        <TopFilter
          selectedCategory="Services"
          filters={filters}
          setFilters={setFilters}
        />
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
              Showing {filteredServices.length} results
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
            {filteredServices.map((service) => (
              <ShortCard
                onClick={() => {
                  dispatch(setSelectedProperty(service));
                  router.push(`/service/${service._id}`);
                }}
                key={service._id}
                image={service?.photos?.[0] || "/shortCard.png"}
                title={service?.title || "Untitled Service"}
                address={`${service?.address?.city || ""}, ${
                  service?.address?.state || ""
                }`}
                description={service?.description || "No description available"}
                price={service?.price ? Number(service.price) : undefined}
                ownerName={service?.owner?.fullName || "Unknown Owner"}
                ownerPhoto={
                  service?.ownerId?.profilePhoto || "/default-avatar.png"
                }
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

export default HeroService;
