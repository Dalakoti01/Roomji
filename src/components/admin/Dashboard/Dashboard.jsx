'use client';

import React from 'react';
import { UsersIcon, BuildingIcon, AlertTriangleIcon, DollarSignIcon } from 'lucide-react';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import QuickStats from './QuickStats';
import RecentActivities from './RecentActivities';
import useGetAdminDashboard from '@/hooks/admin/useGetAdminDashboard';
import { useSelector } from 'react-redux';

export default function DashboardPage() {
  useGetAdminDashboard()
  const stats = [
    {
      title: 'Total Users',
      value: '2,345',
      icon: UsersIcon,
      change: '+12%',
      timeframe: 'from last month',
    },
    {
      title: 'Total Properties',
      value: '4,721',
      icon: BuildingIcon,
      change: '+23%',
      timeframe: 'from last month',
    },
    {
      title: 'Reports',
      value: '48',
      icon: AlertTriangleIcon,
      change: '-8%',
      timeframe: 'from last month',
    },
    {
      title: 'Revenue',
      value: '₹34,500',
      icon: DollarSignIcon,
      change: '+18%',
      timeframe: 'from last month',
    },
  ];

  const {adminDashboard} = useSelector((store) => store.auth)
  console.log("adminDashboard:", adminDashboard)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* QuickStats + Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          <QuickStats />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
