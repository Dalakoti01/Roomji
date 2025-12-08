"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const RoomPolicies = () => {
  const [showAllPolicies, setShowAllPolicies] = useState(false);
  const { selectedProperty } = useSelector((store) => store.auth);

  // ✅ Dynamic policies from selectedProperty
  const policies = selectedProperty?.roomPolicies || [];

  // ✅ If there are more than 3 policies, slice accordingly
  const displayedPolicies = showAllPolicies ? policies : policies.slice(0, 3);

  // ✅ Handle no policies
  if (!policies || policies.length === 0) {
    return (
      <div className="my-8 w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Room Policies</h2>
        <p className="text-gray-500 text-sm">No room policies available.</p>
      </div>
    );
  }

  return (
    <div className="my-8 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Room Policies</h2>

      {/* Policies List */}
      <ul className="space-y-2">
        {displayedPolicies.map((policy, index) => (
          <li key={index} className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2"></span>
            <span className="text-gray-700">{policy}</span>
          </li>
        ))}
      </ul>

      {/* Toggle Button — only show if more than 3 policies */}
      {policies.length > 3 && (
        <Button
          variant="ghost"
          className="text-[#eb4c60] cursor-pointer text-sm font-medium mt-4 px-0 hover:bg-transparent"
          onClick={() => setShowAllPolicies(!showAllPolicies)}
        >
          {showAllPolicies ? "Hide room policies" : "View All room policies"}
        </Button>
      )}
    </div>
  );
};

export default RoomPolicies;
