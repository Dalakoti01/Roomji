'use client';

import React from 'react';
import { useSelector } from 'react-redux';

function timeAgo(date) {
  if (!date) return '';
  const then = new Date(date);
  const diff = Math.floor((Date.now() - then.getTime()) / 1000); // seconds
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RecentActivities() {
  const { adminDashboard } = useSelector((store) => store.auth || {});
  const activities = adminDashboard?.recentActivities ?? [];

  return (
    <div className="bg-white rounded-lg shadow p-6 h-96 overflow-hidden">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>

      <div className="space-y-4 overflow-y-auto h-[calc(100%-2rem)]">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activities yet.</p>
        ) : (
          activities.map((activity, index) => {
            // activity expected shape from route: { type, date, meta: { fullName, content, user }, refId }
            const name = activity?.meta?.fullName || activity?.meta?.user?.fullName || 'Unknown';
            const action = activity?.meta?.content || activity?.type || '';
            const time = activity?.date || activity?.createdAt || null;
            const initials = (name && name.charAt(0)) || '?';

            return (
              <div key={activity.refId ?? index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#eb4c60] rounded-full flex items-center justify-center text-white font-medium">
                    {initials}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {name}{' '}
                    <span className="text-gray-500 font-normal"> {action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{time ? timeAgo(time) : ''}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
