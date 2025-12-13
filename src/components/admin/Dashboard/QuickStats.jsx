'use client';

import React from 'react';
import { TrendingUpIcon, UsersIcon, BuildingIcon, DollarSignIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const MONTH_NAMES_FULL = [
  'January','February','March','April','May','June','July','August','September','October','November','December'
];

function lastN(arr, n) {
  const a = (arr || []).slice(-n);
  // pad left with zeros if shorter
  if (a.length < n) {
    return Array(n - a.length).fill(0).concat(a);
  }
  return a;
}

export default function QuickStats() {
  const { adminDashboard } = useSelector((store) => store.auth || {});
  const usersByMonth = adminDashboard?.usersByMonth ?? Array(12).fill(0);
  const propertiesByMonth = adminDashboard?.propertiesByMonth ?? Array(12).fill(0);
  const revenueByMonth = adminDashboard?.revenueByMonth ?? Array(12).fill(0);

  // show last 6 months for compact UI
  const last6Users = lastN(usersByMonth, 6);
  const last6Properties = lastN(propertiesByMonth, 6);
  const last6Revenue = lastN(revenueByMonth, 6);

  // labels — last 6 month names (relative to calendar end). We'll map indices from end.
  const monthNames = MONTH_NAMES_FULL;
  const startIdx = Math.max(0, 12 - 6);
  const last6MonthNames = monthNames.slice(startIdx);

  const monthlyData = last6MonthNames.map((monthName, idx) => ({
    month: monthName,
    users: last6Users[idx] ?? 0,
    properties: last6Properties[idx] ?? 0,
    revenue: last6Revenue[idx] ?? 0,
  }));

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
                    ₹{Number(data.revenue || 0).toLocaleString()}
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
