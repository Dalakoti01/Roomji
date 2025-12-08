'use client';

import React, { useState } from 'react';
import { MoreHorizontalIcon, UserIcon } from 'lucide-react';

export default function UsersList({ searchQuery }) {
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      joinDate: '12 Jun 2023',
      status: 'active',
      propertiesCount: 3,
      servicesCount: 2,
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      joinDate: '05 Mar 2023',
      status: 'active',
      propertiesCount: 2,
      servicesCount: 0,
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91 76543 21098',
      joinDate: '18 Jan 2023',
      status: 'blocked',
      propertiesCount: 0,
      servicesCount: 0,
    },
    {
      id: '4',
      name: 'Neha Singh',
      email: 'neha@example.com',
      phone: '+91 65432 10987',
      joinDate: '24 Aug 2023',
      status: 'active',
      propertiesCount: 5,
      servicesCount: 1,
    },
    {
      id: '5',
      name: 'Vikram Joshi',
      email: 'vikram@example.com',
      phone: '+91 54321 09876',
      joinDate: '10 Nov 2023',
      status: 'active',
      propertiesCount: 1,
      servicesCount: 3,
    },
    {
      id: '6',
      name: 'Ananya Gupta',
      email: 'ananya@example.com',
      phone: '+91 43210 98765',
      joinDate: '02 Feb 2023',
      status: 'blocked',
      propertiesCount: 0,
      servicesCount: 0,
    },
    {
      id: '7',
      name: 'Rajesh Verma',
      email: 'rajesh@example.com',
      phone: '+91 32109 87654',
      joinDate: '15 Apr 2023',
      status: 'active',
      propertiesCount: 4,
      servicesCount: 2,
    },
  ]);

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const toggleBlockUser = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
          : user
      )
    );
    setActionMenuOpen(null);
  };

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
            {[
              'User',
              'Contact',
              'Join Date',
              'Properties',
              'Services',
              'Status',
              'Actions',
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* User column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joinDate}
                </td>

                {/* Properties */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.propertiesCount}
                </td>

                {/* Services */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.servicesCount}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                          onClick={() => alert(`View ${user.name}'s details`)}
                        >
                          View Details
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => toggleBlockUser(user.id)}
                        >
                          {user.status === 'active'
                            ? 'Block User'
                            : 'Unblock User'}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => alert(`Delete ${user.name}?`)}
                        >
                          Delete User
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
                colSpan={7}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No users found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex-1 flex justify-end">
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
