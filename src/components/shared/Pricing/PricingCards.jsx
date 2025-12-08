"use client";

import React from "react";
import PricingCard from "./PricingCard";

export default function PricingCards({ billingPeriod }) {
  const plans = [
    {
      name: "Pro Plan",
      price: 275,
      description:
        "Leverage advanced AI to create content for multiple brands on campaigns.",
      isPopular: false,
    },
    {
      name: "Pro Plan",
      price: 575,
      description:
        "Leverage advanced AI to create content for multiple brands on campaigns.",
      isPopular: true,
    },
    {
      name: "Pro Plan",
      price: 1075,
      description:
        "Leverage advanced AI to create content for multiple brands on campaigns.",
      isPopular: false,
    },
  ];

  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} billingPeriod={billingPeriod} />
          ))}
        </div>
      </div>
    </div>
  );
}
