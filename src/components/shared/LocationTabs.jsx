"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Locate } from "lucide-react";
import { State, City } from "country-state-city";
import { useSelector } from "react-redux";

export default function LocationTabs({ onChange }) {
  const { savedProperty } = useSelector((store) => store.auth);

  const [activeTab, setActiveTab] = useState(0);

  // local state = single source of truth
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [addressInput, setAddressInput] = useState("");

  const [allStates, setAllStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  /* Load states */
  useEffect(() => {
    setAllStates(State.getStatesOfCountry("IN"));
  }, []);

  /* Hydrate ONCE from savedProperty */
  useEffect(() => {
    if (savedProperty) {
      setStateInput(savedProperty.state || "");
      setCityInput(savedProperty.city || "");
      setAddressInput(savedProperty.detailedAddress || "");

      // notify parent ONCE during hydration
      onChange?.({
        state: savedProperty.state || "",
        city: savedProperty.city || "",
        address: savedProperty.detailedAddress || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Handlers ---------- */

  const handleStateChange = (e) => {
    const value = e.target.value;

    setStateInput(value);
    setCityInput("");
    setFilteredCities([]);

    onChange?.({
      state: value,
      city: "",
      address: addressInput,
    });

    if (!value) {
      setFilteredStates([]);
      return;
    }

    setFilteredStates(
      allStates.filter((s) =>
        s.name.toLowerCase().startsWith(value.toLowerCase())
      )
    );
  };

  const handleSelectState = (state) => {
    setStateInput(state.name);
    setFilteredStates([]);
    setAllCities(City.getCitiesOfState("IN", state.isoCode));

    onChange?.({
      state: state.name,
      city: "",
      address: addressInput,
    });
  };

  const handleCityChange = (e) => {
    const value = e.target.value;

    setCityInput(value);

    onChange?.({
      state: stateInput,
      city: value,
      address: addressInput,
    });

    if (!value) {
      setFilteredCities([]);
      return;
    }

    setFilteredCities(
      allCities.filter((c) =>
        c.name.toLowerCase().startsWith(value.toLowerCase())
      )
    );
  };

  const handleSelectCity = (city) => {
    setCityInput(city.name);
    setFilteredCities([]);

    onChange?.({
      state: stateInput,
      city: city.name,
      address: addressInput,
    });
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);

    onChange?.({
      state: stateInput,
      city: cityInput,
      address: value,
    });
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
            className={`flex items-center gap-2 px-4 py-3 rounded-none border-b-2 cursor-pointer ${
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
                {filteredStates.map((s, index) => (
                  <li
                    key={`${s.isoCode}-${index}`}
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
                {filteredCities.map((c, index) => (
                  <li
                    key={`${c.name}-${index}`}
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
              onChange={handleAddressChange}
              placeholder="Enter detailed address..."
              className="mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
