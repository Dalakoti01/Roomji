'use client';

import React from 'react';

export default function RecentActivities() {
  const activities = [
    { user: 'Rahul Sharma', action: 'subscribed to Premium', time: '2 minutes ago' },
    { user: 'Priya Patel', action: 'posted a new property', time: '10 minutes ago' },
    { user: 'Amit Kumar', action: 'reported a property', time: '25 minutes ago' },
    { user: 'Neha Singh', action: 'updated their profile', time: '1 hour ago' },
    { user: 'Vikram Joshi', action: 'contacted admin support', time: '2 hours ago' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 h-96 overflow-hidden">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
      <div className="space-y-4 overflow-y-auto h-[calc(100%-2rem)]">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[#eb4c60] rounded-full flex items-center justify-center text-white font-medium">
                {activity.user.charAt(0)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.user}{' '}
                <span className="text-gray-500 font-normal">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
