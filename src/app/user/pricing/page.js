"use client";

import React, { useState } from "react";
import HeroSection from "../../../components/shared/Pricing/HeroSection";
import PricingSection from "../../../components/shared/Pricing/PricingSection";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <main className="w-full">
       <HeroSection/>
       <PricingSection/>
      </main>
    </div>
  );
}
