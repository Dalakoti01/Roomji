'use client';

import React, { useState } from 'react';
import {
  MoreHorizontalIcon,
  HomeIcon,
  BuildingIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
} from 'lucide-react';

export default function ReportedPropertiesList({ searchQuery }) {
  const [properties, setProperties] = useState([
    {
      id: '1',
      title: 'Fake PG Listing',
      type: 'PG',
      reportedBy: 'Rahul Sharma',
      reportReason: 'Fake listing, property does not exist',
      reportedDate: '12 Jun 2023',
      owner: 'Amit Kumar',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Misleading Room Photos',
      type: 'Room',
      reportedBy: 'Priya Patel',
      reportReason: 'Photos do not match the actual property',
      reportedDate: '05 Mar 2023',
      owner: 'Neha Singh',
      status: 'reviewed',
    },
  ]);

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const updateReportStatus = (id, newStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    setActionMenuOpen(null);
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case 'Room':
      case 'PG':
      case 'Hostel':
        return <HomeIcon className="h-5 w-5 text-blue-500" />;
      case 'Apartment':
        return <BuildingIcon className="h-5 w-5 text-purple-500" />;
      case 'Shop':
        return <ShoppingBagIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <HomeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filtered = properties.filter((p) => {
    const query = (searchQuery || '').toLowerCase();
    return (
      (p.title?.toLowerCase() || '').includes(query) ||
      (p.reportedBy?.toLowerCase() || '').includes(query) ||
      (p.owner?.toLowerCase() || '').includes(query) ||
      (p.reportReason?.toLowerCase() || '').includes(query)
    );
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Property', 'Report Details', 'Owner', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                      {getPropertyIcon(p.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.type}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <AlertTriangleIcon className="h-4 w-4 text-[#eb4c60] mr-1" />
                    Reported by: {p.reportedBy}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{p.reportReason}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Reported on: {p.reportedDate}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">{p.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      p.status
                    )}`}
                  >
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500 relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setActionMenuOpen(actionMenuOpen === p.id ? null : p.id)
                    }
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === p.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => alert(`View ${p.title} details`)}
                        >
                          View Details
                        </button>
                        {p.status === 'pending' && (
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => updateReportStatus(p.id, 'reviewed')}
                          >
                            Mark as Reviewed
                          </button>
                        )}
                        {(p.status === 'pending' || p.status === 'reviewed') && (
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => updateReportStatus(p.id, 'resolved')}
                          >
                            Mark as Resolved
                          </button>
                        )}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => alert(`Delete ${p.title}?`)}
                        >
                          Delete Property
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No reported properties found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
