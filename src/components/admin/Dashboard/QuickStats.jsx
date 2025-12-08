'use client';

import React from 'react';
import { TrendingUpIcon, UsersIcon, BuildingIcon, DollarSignIcon } from 'lucide-react';

export default function QuickStats() {
  const monthlyData = [
    { month: 'January', users: 180, properties: 340, revenue: 18500 },
    { month: 'February', users: 195, properties: 385, revenue: 21200 },
    { month: 'March', users: 210, properties: 420, revenue: 19800 },
    { month: 'April', users: 225, properties: 455, revenue: 22400 },
    { month: 'May', users: 240, properties: 490, revenue: 24100 },
    { month: 'June', users: 255, properties: 525, revenue: 22800 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Monthly Performance
      </h2>
      <div className="space-y-4">
        {monthlyData.map((data, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">{data.month}</h3>
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Users</p>
                  <p className="text-sm font-medium text-gray-900">{data.users}</p>
                </div>
              </div>

              <div className="flex items-center">
                <BuildingIcon className="h-4 w-4 text-purple-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Properties</p>
                  <p className="text-sm font-medium text-gray-900">{data.properties}</p>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSignIcon className="h-4 w-4 text-green-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{data.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
