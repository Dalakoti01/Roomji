'use client';

import React from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  UsersIcon,
  CrownIcon,
  CalendarIcon,
} from 'lucide-react';

export default function RevenueOverview() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,670',
      change: '+12.5%',
      timeframe: 'from last month',
      increasing: true,
      icon: DollarSignIcon,
    },
    {
      title: 'Subscribed Users',
      value: '245',
      change: '+18.2%',
      timeframe: 'from last month',
      increasing: true,
      icon: UsersIcon,
    },
    {
      title: 'Premium Subscriptions',
      value: '124',
      change: '+7.4%',
      timeframe: 'from last month',
      increasing: true,
      icon: CrownIcon,
    },
    {
      title: 'Avg. Renewal Rate',
      value: '78%',
      change: '-3.1%',
      timeframe: 'from last month',
      increasing: false,
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-[#eb4c60] bg-opacity-10 flex-shrink-0">
              <stat.icon className="h-6 w-6 text-[#eb4c60]" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {stat.increasing ? (
              <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
            ) : (
              <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
            )}
            <span
              className={`text-sm font-medium ${
                stat.increasing ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-1 truncate">
              {stat.timeframe}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
