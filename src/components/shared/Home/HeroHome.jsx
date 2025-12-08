"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  Home,
  Store,
  Wrench,
  Building,
} from "lucide-react";
import { Country, State, City } from "country-state-city";

export default function HeroHome({ filters, setFilters }) {
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // ✅ Handle change and fetch matching states or cities
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      if (value.trim()) {
        const matches = State.getStatesOfCountry("IN").filter((s) =>
          s.name.toLowerCase().includes(value.toLowerCase())
        );
        setStateSuggestions(matches.slice(0, 5));
        setShowStateSuggestions(true);
      } else {
        setShowStateSuggestions(false);
      }
    }

    if (name === "city") {
      if (filters.state) {
        const selectedState = State.getStatesOfCountry("IN").find(
          (s) =>
            s.name.toLowerCase() === filters.state.toLowerCase() ||
            s.isoCode.toLowerCase() === filters.state.toLowerCase()
        );
        if (selectedState) {
          const cities = City.getCitiesOfState("IN", selectedState.isoCode);
          const matches = cities.filter((c) =>
            c.name.toLowerCase().includes(value.toLowerCase())
          );
          setCitySuggestions(matches.slice(0, 5));
          setShowCitySuggestions(true);
        }
      }
      if (!value.trim()) setShowCitySuggestions(false);
    }
  };

  // ✅ When user selects suggestion
  const handleSelectState = (stateName) => {
    setFilters((prev) => ({ ...prev, state: stateName }));
    setShowStateSuggestions(false);
  };

  const handleSelectCity = (cityName) => {
    setFilters((prev) => ({ ...prev, city: cityName }));
    setShowCitySuggestions(false);
  };

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/heroHome.jpg"
          alt="Hero background"
          fill
          className="object-cover object-center brightness-90"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Content */}
      <div className="text-center px-4 sm:px-6 md:px-12 text-white max-w-4xl w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Find Your Dream <span className="text-[#eb4c60]">Property</span> in India
        </h1>

        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-200">
          Discover the perfect home, shop property across major Indian cities
        </p>

        {/* Search Card */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl px-4 sm:px-6 md:px-10 py-6 w-full mx-auto max-w-4xl relative">
          {/* Unified Search Section */}
          <div className="border border-gray-300 lg:rounded-full overflow-hidden w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full">
              {/* State Input */}
              <div className="relative flex flex-col items-center sm:items-center flex-1 px-5 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0">
                  State
                </h3>
                <input
                  type="text"
                  name="state"
                  value={filters.state}
                  onChange={handleInputChange}
                  placeholder="Search States"
                  className="w-full text-center sm:w-auto flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-0"
                  onFocus={() =>
                    filters.state && setShowStateSuggestions(true)
                  }
                />

                {/* ✅ State Suggestions Dropdown */}
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
              <div className="relative flex flex-col items-center sm:items-center flex-1 px-5 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0">
                  City
                </h3>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleInputChange}
                  placeholder="Search Cities"
                  className="w-full text-center sm:w-auto flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-0"
                  onFocus={() => filters.city && setShowCitySuggestions(true)}
                />

                {/* ✅ City Suggestions Dropdown */}
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
              <div className="flex flex-col items-center sm:items-center flex-1 px-5 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0">
                  Locality
                </h3>
                <input
                  type="text"
                  name="locality"
                  value={filters.locality}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      locality: e.target.value,
                    }))
                  }
                  placeholder="Search Locality"
                  className="w-full text-center bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-0"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between flex-1 px-5 py-3 sm:py-4">
                <div className="flex items-center gap-2 ml-3 sm:ml-4 flex-shrink-0">
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
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#eb4c60] transition">
              <Home className="w-5 h-5" /> <span>Homes</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#eb4c60] transition">
              <Store className="w-5 h-5" /> <span>Shops</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#eb4c60] transition">
              <Wrench className="w-5 h-5" /> <span>Services</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#eb4c60] transition">
              <Building className="w-5 h-5" /> <span>Appartments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
