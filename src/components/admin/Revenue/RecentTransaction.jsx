'use client';

import React from 'react';
import { CheckCircleIcon } from 'lucide-react';

export default function RecentTransactions() {
  const transactions = [
    {
      id: '1',
      user: 'Rahul Sharma',
      email: 'rahul@example.com',
      plan: 'Premium',
      amount: '₹1,999',
      date: '12 Jun 2023',
      status: 'successful',
    },
    {
      id: '2',
      user: 'Priya Patel',
      email: 'priya@example.com',
      plan: 'Basic',
      amount: '₹999',
      date: '05 Mar 2023',
      status: 'successful',
    },
    {
      id: '3',
      user: 'Amit Kumar',
      email: 'amit@example.com',
      plan: 'Basic',
      amount: '₹999',
      date: '18 Jan 2023',
      status: 'successful',
    },
    {
      id: '4',
      user: 'Neha Singh',
      email: 'neha@example.com',
      plan: 'Pro',
      amount: '₹2,999',
      date: '24 Aug 2023',
      status: 'successful',
    },
    {
      id: '5',
      user: 'Vikram Joshi',
      email: 'vikram@example.com',
      plan: 'Basic',
      amount: '₹999',
      date: '10 Nov 2023',
      status: 'successful',
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Recent Transactions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Transaction ID', 'User', 'Plan', 'Amount', 'Date', 'Status'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{t.id.padStart(6, '0')}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {t.user}
                  </div>
                  <div className="text-sm text-gray-500">{t.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.plan}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {t.amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
                    <span className="text-sm text-green-800 font-medium">
                      Successful
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
