'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { StarIcon, CheckCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ---------------------------------------------
   Load Razorpay SDK ONLY ONCE (global promise)
---------------------------------------------- */
let razorpayPromise;

const loadRazorpayScript = () => {
  if (!razorpayPromise) {
    razorpayPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  return razorpayPromise;
};

export default function PricingCard({
  title,
  price,
  description,
  isPopular = false,
  features,
  itemType,
  planDuration,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;

    /* ---------------- SANITIZE PRICE ---------------- */
    const amount = Number(String(price).replace(/[^\d]/g, ''));

    if (!amount || isNaN(amount)) {
      toast.error('Invalid plan amount');
      return;
    }

    const planType =
      itemType === 'property' ? 'propertyPlan' : 'servicePlan';

    try {
      setLoading(true);

      /* ---------------- CREATE ORDER ---------------- */
      const res = await axios.post(
        '/api/payment/createOrder',
        { amount, planDuration, planType },
        { withCredentials: true }
      );

      if (!res.data?.success || !res.data?.order?.id) {
        toast.error(res.data?.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      /* ---------------- LOAD SDK ---------------- */
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      console.log('🟢 Razorpay order created:', res.data.order.id);

      /* ---------------- CHECKOUT OPTIONS ---------------- */
     const options = {
  key: 'rzp_test_Re0UG0czfqFcZu',
  order_id: res.data.order.id,
  name: 'Test',
  handler: () => alert('SUCCESS'),
};


      /* ---------------- OPEN CHECKOUT ---------------- */
      const razorpay = new window.Razorpay(options);

      /* 🔥 PAYMENT FAILURE LISTENER (CRITICAL) */
      razorpay.on('payment.failed', function (response) {
        console.error('❌ RAZORPAY PAYMENT FAILED', response);

        toast.error(
          response.error?.description ||
            response.error?.reason ||
            'Payment failed'
        );

        setLoading(false);
      });

      console.log('🟡 Opening Razorpay checkout...');
      razorpay.open();
    } catch (error) {
      console.error('❌ PAYMENT FLOW ERROR', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:scale-105 border ${
        isPopular ? 'border-[#eb4c60]/30' : 'border-gray-200'
      }`}
    >
      <div className="p-6 pb-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          {isPopular && (
            <span className="bg-[#eb4c60] text-white text-xs px-3 py-1 rounded-full flex items-center">
              <StarIcon className="h-3 w-3 mr-1" />
              Popular
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex items-baseline mb-4">
          <span className="text-gray-500 text-lg">₹</span>
          <span className="text-3xl font-bold">{price}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full cursor-pointer py-2 border rounded-md transition-colors mb-4 ${
            loading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'border-[#eb4c60] text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white'
          }`}
        >
          {loading ? 'Processing…' : 'Switch to this Plan'}
        </button>

        <p className="text-sm text-center text-gray-600">
          Start With Listing Your 1st {itemType} for free
        </p>
      </div>

      <div className="border-t border-gray-200" />

      <div className="p-6">
        <h4 className="font-semibold mb-2">Features</h4>
        <p className="text-sm text-gray-600 mb-4">Everything Creator & Plus</p>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-[#eb4c60] mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
