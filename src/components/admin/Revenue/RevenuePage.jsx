'use client';

import React from 'react';
import RevenueOverview from './RevenueOverview';
import RevenueChart from './RevenueChart';
import RevenueByPlan from './RevenuePlan';
import RecentTransactions from './RecentTransaction';


export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
      </div>

      <RevenueOverview />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RevenueByPlan />
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
}
