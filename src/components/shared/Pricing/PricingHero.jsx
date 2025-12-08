"use client";

import React from "react";

export default function PricingHero({ billingPeriod, onBillingPeriodChange }) {
  return (
    <div className="w-full py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-6 py-2 border-2 border-gray-900 rounded-full mb-8">
          <span className="text-sm text-gray-700">
            Rent your property to the best price
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Products With the Best Pricing
        </h1>

        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Select from best plan, ensuring a perfect match. Need more or less?
          Customize your subscription for a seamless fit!
        </p>

        <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-full p-1">
          <button
            onClick={() => onBillingPeriodChange("monthly")}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${
              billingPeriod === "monthly"
                ? "bg-red-500 text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onBillingPeriodChange("annually")}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${
              billingPeriod === "annually"
                ? "bg-red-500 text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Annually
          </button>
        </div>
      </div>
    </div>
  );
}
