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
import { useSelector } from 'react-redux';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function RevenueChart() {
  const { adminDashboard } = useSelector((store) => store.auth || {});
  const revenueByMonth = adminDashboard?.revenueByMonth ?? Array(12).fill(0);

  const data = MONTH_NAMES.map((m, i) => ({
    name: m,
    revenue: Number(revenueByMonth[i] ?? 0),
  }));

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
