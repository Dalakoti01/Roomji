"use client";

import {
  DollarSignIcon,
  UsersIcon,
  CrownIcon,
  CalendarIcon,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function RevenueOverview() {
  const { revenueRecords } = useSelector((store) => store.auth);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${revenueRecords?.totalRevenue || 0}`,
      icon: DollarSignIcon,
    },
    {
      title: "Subscribed Users",
      value: revenueRecords?.totalSubscribers || 0,
      icon: UsersIcon,
    },
    {
      title: "Property Plans",
      value: revenueRecords?.propertyPlanCount || 0,
      icon: CrownIcon,
    },
    {
      title: "Service Plans",
      value: revenueRecords?.servicePlanCount || 0,
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-[#eb4c60]/10">
              <stat.icon className="h-6 w-6 text-[#eb4c60]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
