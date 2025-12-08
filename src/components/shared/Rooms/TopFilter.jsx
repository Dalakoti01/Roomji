"use client";

import React, { useState } from "react";
import {
  Building,
  Home,
  Search,
  SlidersHorizontal,
  Store,
  Wrench,
} from "lucide-react";
import { State, City } from "country-state-city";
console.log("States:", State.getStatesOfCountry("IN").length);


const TopFilter = ({ selectedCategory, filters, setFilters }) => {
  const categories = [
    { icon: <Home className="w-5 h-5" />, label: "Rented Property" },
    { icon: <Store className="w-5 h-5" />, label: "Shops" },
    { icon: <Wrench className="w-5 h-5" />, label: "Services" },
    { icon: <Building className="w-5 h-5" />, label: "Selling Property" },
  ];

  // 🔹 Suggestion states
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // 🔹 Handle input changes
  const handleInputChange = (e) => {
  const { name, value } = e.target;

  // compute the next filter state immediately
  const updatedFilters = { ...filters, [name]: value };
  setFilters(updatedFilters);

if (name === "state") {
  const allStates = State.getStatesOfCountry("IN");
  if (value.trim()) {
    const matches = allStates.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );

    // 👇 Add this line right here
    console.log("State suggestions:", matches.map((s) => s.name));

    setStateSuggestions(matches.slice(0, 5));
    setShowStateSuggestions(true);
  } else {
    setShowStateSuggestions(false);
  }
}

  if (name === "city") {
    const selectedState = State.getStatesOfCountry("IN").find(
      (s) =>
        s.name.toLowerCase() === updatedFilters.state.toLowerCase() ||
        s.isoCode.toLowerCase() === updatedFilters.state.toLowerCase()
    );

    if (selectedState && value.trim()) {
      const cities = City.getCitiesOfState("IN", selectedState.isoCode);
      const matches = cities.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(matches.slice(0, 5));
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  }
};


  // 🔹 Select from suggestions
  const handleSelectState = (stateName) => {
    setFilters((prev) => ({ ...prev, state: stateName, city: "" }));
    setShowStateSuggestions(false);
  };

  const handleSelectCity = (cityName) => {
    setFilters((prev) => ({ ...prev, city: cityName }));
    setShowCitySuggestions(false);
  };

  return (
    <div className="bg-white border lg:h-[148px] lg:w-[904px] rounded-3xl shadow-xl px-4 sm:px-6 md:px-10 py-6 w-full mx-auto max-w-4xl relative">
      {/* Unified Search Section */}
      <div className="border border-gray-300 lg:rounded-full overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full">
          {/* State Input */}
          <div className="relative flex flex-col items-center flex-1 px-5 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0">
              State
            </h3>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleInputChange}
              placeholder="Search States"
              className="w-full text-center bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-0"
              onFocus={() => setShowStateSuggestions(true)}

            />
            {/* ✅ State Suggestions */}
            {showStateSuggestions && stateSuggestions.length > 0 && (
              <ul className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg w-[90%] max-h-40 overflow-y-auto text-gray-700 shadow-md z-50">
                {stateSuggestions.map((s) => (
                  <li
                    key={s.isoCode}
                    onClick={() => handleSelectState(s.name)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* City Input */}
          <div className="relative flex flex-col items-center flex-1 px-5 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0">
              City
            </h3>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleInputChange}
              placeholder="Search Cities"
              className="w-full text-center bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-0"
             onFocus={() => setShowCitySuggestions(true)}

            />
            {/* ✅ City Suggestions */}
            {showCitySuggestions && citySuggestions.length > 0 && (
              <ul className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg w-[90%] max-h-40 overflow-y-auto text-gray-700 shadow-md z-50">
                {citySuggestions.map((c) => (
                  <li
                    key={c.name}
                    onClick={() => handleSelectCity(c.name)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Locality Input */}
          <div className="flex flex-col items-center flex-1 px-5 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0">
              Locality
            </h3>
            <input
              type="text"
              name="locality"
              value={filters.locality}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, locality: e.target.value }))
              }
              placeholder="Search Locality"
              className="w-full text-center bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-0"
            />
          </div>

          {/* Search + Filter Buttons */}
          <div className="flex items-center justify-between flex-1 px-5 py-3 sm:py-4">
            <div className="flex w-full items-center justify-center gap-2 ml-3 sm:ml-4 flex-shrink-0">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <SlidersHorizontal className="text-gray-600 w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-2 bg-[#eb4c60] rounded-full hover:bg-[#d94456] transition cursor-pointer"
              >
                <Search className="text-white w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex justify-center flex-wrap gap-6 text-gray-700 text-sm sm:text-base mt-5">
        {categories.map(({ icon, label }) => {
          const isSelected =
            label.toLowerCase().replace(/\s/g, "") ===
            selectedCategory?.toLowerCase().replace(/\s/g, "");

          return (
            <div
              key={label}
              className={`flex items-center gap-2 transition ${
                isSelected
                  ? "text-[#eb4c60] cursor-default"
                  : "cursor-pointer hover:text-[#eb4c60]"
              }`}
            >
              {icon} <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopFilter;
