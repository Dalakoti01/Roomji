'use client';

import React from 'react';
import RevenueOverview from './RevenueOverview';
import RecentTransactions from './RecentTransaction';
import useGetPlatformRevenue from '@/hooks/admin/useGetPlatformRevenue';


export default function RevenuePage() {
  useGetPlatformRevenue()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
      </div>

      <RevenueOverview />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
      </div>

      <RecentTransactions />
    </div>
  );
}
