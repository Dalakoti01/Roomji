'use client';

import React from 'react';

export default function StatsCard({ title, value, icon: Icon, change, timeframe }) {
  const isPositive = typeof change === 'string' && change.startsWith('+');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-[#eb4c60]/10">
          <Icon className="h-6 w-6 text-[#eb4c60]" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>

      {change ? (
        <div className="mt-4">
          <span
            className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {change}
          </span>
          {timeframe ? <span className="text-sm text-gray-500"> {timeframe}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
