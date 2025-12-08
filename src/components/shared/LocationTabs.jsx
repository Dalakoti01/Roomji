"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Locate } from "lucide-react";
import { State, City } from "country-state-city";

export default function LocationTabs({ onChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [addressInput, setAddressInput] = useState("");

  const [allStates, setAllStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const states = State.getStatesOfCountry("IN");
    setAllStates(states);
  }, []);

  useEffect(() => {
    onChange &&
      onChange({
        state: stateInput,
        city: cityInput,
        address: addressInput,
      });
  }, [stateInput, cityInput, addressInput]);

  const handleStateChange = (e) => {
    const value = e.target.value;
    setStateInput(value);
    if (!value) return setFilteredStates([]);
    const filtered = allStates.filter((s) =>
      s.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredStates(filtered);
  };

  const handleSelectState = (state) => {
    setStateInput(state.name);
    setFilteredStates([]);
    setAllCities(City.getCitiesOfState("IN", state.isoCode));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    if (!value) return setFilteredCities([]);
    const filtered = allCities.filter((c) =>
      c.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSelectCity = (city) => {
    setCityInput(city.name);
    setFilteredCities([]);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Select Location
      </h2>

      {/* Tabs Header */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        {[
          { id: 0, label: "State of India", icon: <MapPin className="h-4 w-4" /> },
          { id: 1, label: "City", icon: <Building2 className="h-4 w-4" /> },
          { id: 2, label: "Proper Location", icon: <Locate className="h-4 w-4" /> },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-none border-b-2 transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "border-[#FF5A5F] text-[#FF5A5F] font-medium"
                : "border-transparent text-gray-600 hover:text-[#FF5A5F]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="mt-4">
        {activeTab === 0 && (
          <div className="relative">
            <Label>State of India</Label>
            <Input
              value={stateInput}
              onChange={handleStateChange}
              placeholder="Start typing your state..."
              className="mt-2"
            />
            {filteredStates.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md shadow-md max-h-48 overflow-auto w-full">
                {filteredStates.map((s) => (
                  <li
                    key={s.isoCode}
                    onClick={() => handleSelectState(s)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="relative">
            <Label>City</Label>
            <Input
              value={cityInput}
              onChange={handleCityChange}
              placeholder="Start typing your city..."
              className="mt-2"
            />
            {filteredCities.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md shadow-md max-h-48 overflow-auto w-full">
                {filteredCities.map((c) => (
                  <li
                    key={c.name}
                    onClick={() => handleSelectCity(c)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <Label>Proper Location</Label>
            <Input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter detailed address..."
              className="mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
