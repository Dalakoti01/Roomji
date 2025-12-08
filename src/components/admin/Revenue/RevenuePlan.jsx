'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export default function RevenueByPlan() {
  const data = [
    { name: 'Basic Plan', value: 25, color: '#3b82f6' },
    { name: 'Premium Plan', value: 45, color: '#eb4c60' },
    { name: 'Pro Plan', value: 30, color: '#8b5cf6' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 h-96">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Revenue by Plan
      </h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
