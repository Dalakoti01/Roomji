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
  useGetAdminDashboard();
  const { adminDashboard } = useSelector((store) => store.auth || {});

  // safe getters with defaults
  const usersCount = adminDashboard?.userCount ?? 0;
  const totalProperties = adminDashboard?.totalPropertiesCount ?? 0;
  const totalRevenue = adminDashboard?.totalRevenue ?? 0;

  // compute a simple change metric: compare last month vs previous month for users & revenue
  const monthIndex = new Date().getMonth(); // 0..11 (not used directly for last-month in dataset)
  const usersByMonth = adminDashboard?.usersByMonth ?? Array(12).fill(0);
  const revenueByMonth = adminDashboard?.revenueByMonth ?? Array(12).fill(0);
  // last two non-null months from the end
  const getLastTwo = (arr) => {
    const rev = (arr || []).slice();
    // take last two numeric values (prefer end of year)
    const last = rev[rev.length - 1] ?? 0;
    const prev = rev[rev.length - 2] ?? 0;
    return [last, prev];
  };
  const [lastUsers, prevUsers] = getLastTwo(usersByMonth);
  const [lastRevenue, prevRevenue] = getLastTwo(revenueByMonth);

  const calcChange = (current, previous) => {
    if (!previous && !current) return '0%';
    if (!previous && current) return `+${Math.round((current - previous) / (previous || 1) * 100)}%`;
    const diff = current - previous;
    const pct = Math.round((diff / (previous || 1)) * 100);
    return (pct >= 0 ? '+' : '') + `${pct}%`;
  };

  const stats = [
    {
      title: 'Total Users',
      value: usersCount.toLocaleString(),
      icon: UsersIcon,
      change: calcChange(lastUsers, prevUsers),
      timeframe: 'last month vs previous',
    },
    {
      title: 'Total Properties',
      value: totalProperties.toLocaleString(),
      icon: BuildingIcon,
      change: undefined, // no historical data here — optional
      timeframe: '',
    },
    {
      title: 'Reports',
      value: '0', // you don't have this in adminDashboard — keep 0 or wire it later
      icon: AlertTriangleIcon,
      change: undefined,
      timeframe: '',
    },
    {
      title: 'Revenue',
      value: `₹${Number(totalRevenue || 0).toLocaleString()}`,
      icon: DollarSignIcon,
      change: calcChange(lastRevenue, prevRevenue),
      timeframe: 'last month vs previous',
    },
  ];

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
