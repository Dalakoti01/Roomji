'use client';

import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { StarIcon, CheckCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingCard({
  title,
  price,
  description,
  isPopular = false,
  features,
  itemType, // 'property' or 'service'
  planDuration, // 'quaterly' | 'half-yearly' | 'annually'
}) {

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const router = useRouter()

  const handlePayment = async () => {
    try {
      const planType = itemType === 'property' ? 'propertyPlan' : 'servicePlan';
      const amount = Number(price);

      const res = await axios.post(
        '/api/payment/createOrder',
        { amount, planDuration, planType },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error('Razorpay SDK failed to load');
          return;
        }

        const options = {
          key: res.data.key,
          amount: res.data.order.amount,
          currency: 'INR',
          name: 'Roomji',
          description: `${planDuration} ${itemType} plan`,
          order_id: res.data.order.id,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                '/api/payment/verifyPayment',
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentId: res.data.paymentId,
                },
                { withCredentials: true }
              );

              if (verifyRes.data.success) {
                toast.success(verifyRes.data.message);
                router.push("/")
              } else {
                toast.error(verifyRes.data.message);
              }
            } catch (err) {
              toast.error(err.response?.data?.message || 'Verification failed');
            }
          },
          theme: { color: '#eb4c60' },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
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
          className="w-full cursor-pointer py-2 border border-[#eb4c60] text-[#eb4c60] rounded-md hover:bg-[#eb4c60] hover:text-white transition-colors mb-4"
        >
          Switch to this Plan
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
