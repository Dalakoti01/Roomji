'use client';

import React from 'react';

export default function HeroSection() {
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

      <div className="mb-12">
        <button className="bg-[#eb4c60] text-white rounded-full px-10 py-3 font-medium hover:bg-[#d43b4f] transition-colors">
          Property
        </button>
      </div>
    </section>
  );
}
