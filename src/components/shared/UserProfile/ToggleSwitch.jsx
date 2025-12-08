"use client";

import React, { useState } from "react";

export default function ToggleSwitch({ initialState = false, onChange }) {
  const [isActive, setIsActive] = useState(initialState);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onChange) onChange(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors 
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
        ${isActive ? "bg-red-500" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
          ${isActive ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}
