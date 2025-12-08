'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function RevenueChart() {
  const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
    { name: 'Aug', revenue: 4000 },
    { name: 'Sep', revenue: 4500 },
    { name: 'Oct', revenue: 5200 },
    { name: 'Nov', revenue: 4800 },
    { name: 'Dec', revenue: 6000 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 h-96">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Revenue Overview
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
          <Bar dataKey="revenue" fill="#eb4c60" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
