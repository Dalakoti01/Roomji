"use client";

import React from "react";
import { Plus } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

export default function AddListingSection({ title, initialToggleState = false }) {
  return (
    <div className="container mx-auto px-6 py-6">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <ToggleSwitch initialState={initialToggleState} />
      </div>

      {/* Add Image Box */}
      <div
        className="max-w-xs border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center 
        cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <Plus size={20} className="text-gray-500" />
        </div>
        <p className="text-gray-500 text-sm">Add Image</p>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mt-8"></div>
    </div>
  );
}
