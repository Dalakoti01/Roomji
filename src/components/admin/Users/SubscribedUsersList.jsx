'use client';

import React, { useState } from 'react';
import { MoreHorizontalIcon, UserIcon, CrownIcon } from 'lucide-react';

export default function SubscribedUsersList({ searchQuery }) {
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      plan: 'Premium',
      startDate: '12 Jun 2023',
      endDate: '12 Jun 2024',
      amount: '₹1,999',
      autoRenew: true,
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      plan: 'Basic',
      startDate: '05 Mar 2023',
      endDate: '05 Mar 2024',
      amount: '₹999',
      autoRenew: true,
    },
    {
      id: '4',
      name: 'Neha Singh',
      email: 'neha@example.com',
      plan: 'Pro',
      startDate: '24 Aug 2023',
      endDate: '24 Aug 2024',
      amount: '₹2,999',
      autoRenew: false,
    },
  ]);

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

 const filteredUsers = users.filter((user) => {
  const query = (searchQuery || '').toLowerCase();
  return (
    (user.name?.toLowerCase() || '').includes(query) ||
    (user.email?.toLowerCase() || '').includes(query) ||
    (user.plan?.toLowerCase() || '').includes(query)
  );
});


  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['User', 'Plan', 'Subscription Period', 'Amount', 'Auto Renew', 'Actions'].map(
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CrownIcon
                      className={`h-4 w-4 mr-1 ${
                        user.plan === 'Basic'
                          ? 'text-blue-500'
                          : user.plan === 'Premium'
                          ? 'text-[#eb4c60]'
                          : 'text-purple-600'
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        user.plan === 'Basic'
                          ? 'text-blue-500'
                          : user.plan === 'Premium'
                          ? 'text-[#eb4c60]'
                          : 'text-purple-600'
                      }`}
                    >
                      {user.plan}
                    </span>
                  </div>
                </td>

                {/* Subscription */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{user.startDate}</div>
                  <div>to {user.endDate}</div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.amount}
                </td>

                {/* Auto Renew */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.autoRenew
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.autoRenew ? 'Yes' : 'No'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setActionMenuOpen(
                        actionMenuOpen === user.id ? null : user.id
                      )
                    }
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>
                  {actionMenuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() =>
                            alert(`View ${user.name}'s subscription details`)
                          }
                        >
                          View Details
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() =>
                            alert(`Edit ${user.name}'s subscription`)
                          }
                        >
                          Edit Subscription
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() =>
                            alert(`Cancel ${user.name}'s subscription?`)
                          }
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No subscribed users found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
