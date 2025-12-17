'use client';

import React from 'react';
import { useSelector } from 'react-redux';

export default function HeroSection() {
  const { user } = useSelector((store) => store.auth);

  const propertySub = user?.propertySubscription;
  const serviceSub = user?.serviceSubscription;

  const hasPropertySub = propertySub?.isActive;
  const hasServiceSub = serviceSub?.isActive;

  const hasAnySubscription = hasPropertySub || hasServiceSub;

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="py-12 bg-gray-50 text-center px-4">
      <div className="rounded-full bg-gray-100 text-sm py-2 px-4 mx-auto w-max mb-6">
        Rent your property to the best price
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
        Discover Products
        <br />
        With the Best Pricing
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Select from the best plan, ensuring a perfect match. Need more or less?
        Customize your subscription for a seamless fit!
      </p>

      {/* ✅ Subscription Details */}
      {hasAnySubscription && (
        <div className="max-w-xl mx-auto mb-8 bg-white rounded-xl shadow-sm border p-6 text-left">
          <h3 className="text-lg font-semibold mb-4 text-[#eb4c60]">
            Your Active Subscription
          </h3>

          {hasPropertySub && (
            <div className="mb-4">
              <p className="font-medium">🏠 Property Subscription</p>
              <p className="text-sm text-gray-600">
                {formatDate(propertySub.startDate)} →{' '}
                {formatDate(propertySub.endDate)}
              </p>
            </div>
          )}

          {hasServiceSub && (
            <div>
              <p className="font-medium">🛠 Service Subscription</p>
              <p className="text-sm text-gray-600">
                {formatDate(serviceSub.startDate)} →{' '}
                {formatDate(serviceSub.endDate)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ CTA Button */}
      <div className="mb-12">
        {hasAnySubscription ? (
          <button
            className="bg-[#eb4c60] text-white rounded-full px-10 py-3 font-medium hover:bg-[#d43b4f] transition-colors cursor-pointer"
          >
            Manage Subscription
          </button>
        ) : (
          <button
            className="bg-[#eb4c60] text-white rounded-full px-10 py-3 font-medium hover:bg-[#d43b4f] transition-colors cursor-pointer"
          >
            Get Subscription
          </button>
        )}
      </div>
    </section>
  );
}
