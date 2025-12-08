'use client';

import React, { useState } from 'react';
import { TrendingUpIcon } from 'lucide-react';

export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState('yearly');

  const yearlyData = [
    { name: 'January', revenue: 18500, growth: '+12%' },
    { name: 'February', revenue: 21200, growth: '+15%' },
    { name: 'March', revenue: 19800, growth: '-7%' },
    { name: 'April', revenue: 22400, growth: '+13%' },
    { name: 'May', revenue: 24100, growth: '+8%' },
    { name: 'June', revenue: 22800, growth: '-5%' },
    { name: 'July', revenue: 25600, growth: '+12%' },
    { name: 'August', revenue: 28300, growth: '+11%' },
    { name: 'September', revenue: 27900, growth: '-1%' },
    { name: 'October', revenue: 29500, growth: '+6%' },
    { name: 'November', revenue: 31200, growth: '+6%' },
    { name: 'December', revenue: 34500, growth: '+11%' },
  ];

  const monthlyData = [
    { name: 'Week 1', revenue: 7800, growth: '+8%' },
    { name: 'Week 2', revenue: 9200, growth: '+18%' },
    { name: 'Week 3', revenue: 8500, growth: '-8%' },
    { name: 'Week 4', revenue: 9000, growth: '+6%' },
  ];

  const weeklyData = [
    { name: 'Monday', revenue: 1200, growth: '+5%' },
    { name: 'Tuesday', revenue: 1400, growth: '+17%' },
    { name: 'Wednesday', revenue: 1100, growth: '-21%' },
    { name: 'Thursday', revenue: 1500, growth: '+36%' },
    { name: 'Friday', revenue: 1700, growth: '+13%' },
    { name: 'Saturday', revenue: 2100, growth: '+24%' },
    { name: 'Sunday', revenue: 1900, growth: '-10%' },
  ];

  const data =
    timeframe === 'yearly'
      ? yearlyData
      : timeframe === 'monthly'
      ? monthlyData
      : weeklyData;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Revenue Breakdown
        </h2>
        <div className="flex space-x-2">
          {['weekly', 'monthly', 'yearly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                timeframe === tf
                  ? 'bg-[#eb4c60] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Data Cards */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#eb4c60]/10 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 text-[#eb4c60]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ₹{item.revenue.toLocaleString()}
              </p>
              <p
                className={`text-xs font-medium ${
                  item.growth.startsWith('+')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {item.growth}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
