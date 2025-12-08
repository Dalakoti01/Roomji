'use client';

import React from 'react';
import PricingCard from './PricingCard';

export default function PricingSection() {
  const propertyFeatures = [
    'Post unlimited verified listings without hidden charges.',
    'Chat directly with seekers or providers — no commission involved.',
    'Get instant inquiries from genuine users in your area.',
    'Manage your listings easily from a single dashboard.',
    "Boost trust with Roomji's verified profile system.",
  ];

  const serviceFeatures = [
    'Access to 05 user accounts.',
    'Unlimited service listings with high visibility.',
    'Verified business badge for trust boost.',
    'Dedicated dashboard for service management.',
    '24/7 priority support for premium users.',
    'Monthly performance insights report.',
  ];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      {/* ================= PROPERTY PLANS ================= */}
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Property Plans
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <PricingCard
          title="3 Month Plan"
          price="275"
          planDuration="quaterly" // 👈 important for backend
          description="Ideal for short-term property owners looking for maximum exposure."
          features={propertyFeatures}
          itemType="property"
        />

        <PricingCard
          title="6 Month Plan"
          price="575"
          planDuration="half-yearly" // 👈 important for backend
          description="Perfect for those wanting consistent visibility across seasons."
          isPopular={true}
          features={propertyFeatures}
          itemType="property"
        />

        <PricingCard
          title="12 Month Plan"
          price="1075"
          planDuration="annually" // 👈 important for backend
          description="Best value plan for landlords and agents — save more yearly."
          features={propertyFeatures}
          itemType="property"
        />
      </div>

      {/* ================= SERVICES HEADER ================= */}
      <div className="text-center mb-12">
        <button className="bg-[#eb4c60] text-white rounded-full px-10 py-3 font-medium hover:bg-[#d43b4f] transition-colors">
          Services
        </button>
      </div>

      {/* ================= SERVICE PLANS ================= */}
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Service Plans
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingCard
          title="Pro Plan (3 Months)"
          price="175"
          planDuration="quaterly"
          description="A great starting point for local businesses and freelancers."
          features={serviceFeatures}
          itemType="service"
        />

        <PricingCard
          title="Business Plan (6 Months)"
          price="475"
          planDuration="half-yearly"
          description="Boost your visibility and reach more clients effortlessly."
          isPopular={true}
          features={serviceFeatures}
          itemType="service"
        />

        <PricingCard
          title="Enterprise Plan (12 Months)"
          price="975"
          planDuration="annually"
          description="For growing service providers who want long-term presence."
          features={serviceFeatures}
          itemType="service"
        />
      </div>
    </div>
  );
}
