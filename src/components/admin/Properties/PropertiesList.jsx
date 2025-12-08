'use client';

import React, { useState } from 'react';
import { MoreHorizontalIcon, HomeIcon, BuildingIcon, ShoppingBagIcon } from 'lucide-react';

export default function PropertiesList({ searchQuery, category }) {
  const [properties, setProperties] = useState([
    {
      id: '1',
      title: 'Cozy Studio Room',
      type: 'Room',
      category: 'rented',
      location: 'Koramangala, Bangalore',
      price: '₹8,000/month',
      owner: 'Rahul Sharma',
      status: 'active',
      postedDate: '12 Jun 2023',
    },
    {
      id: '4',
      title: '3BHK Premium Apartment',
      type: 'Apartment',
      category: 'selling',
      location: 'Indiranagar, Bangalore',
      price: '₹85,00,000',
      owner: 'Neha Singh',
      status: 'active',
      postedDate: '24 Aug 2023',
    },
    {
      id: '5',
      title: 'Commercial Shop Space',
      type: 'Shop',
      category: 'shops',
      location: 'MG Road, Bangalore',
      price: '₹35,000/month',
      owner: 'Vikram Joshi',
      status: 'active',
      postedDate: '10 Nov 2023',
    },
    {
      id: '6',
      title: 'Tiffin Service',
      type: 'Service',
      category: 'services',
      location: 'Whitefield, Bangalore',
      price: '₹3,500/month',
      owner: 'Ananya Gupta',
      status: 'pending',
      postedDate: '02 Feb 2023',
    },
  ]);

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const togglePropertyStatus = (propertyId) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              status:
                p.status === 'active'
                  ? 'inactive'
                  : p.status === 'inactive'
                  ? 'active'
                  : 'active',
            }
          : p
      )
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = properties
    .filter((p) => p.category === category)
    .filter((p) => {
      const query = (searchQuery || '').toLowerCase();
      return (
        (p.title?.toLowerCase() || '').includes(query) ||
        (p.location?.toLowerCase() || '').includes(query) ||
        (p.owner?.toLowerCase() || '').includes(query)
      );
    });

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Property', 'Location', 'Price', 'Owner', 'Status', 'Actions'].map((h) => (
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
          {filteredProperties.length > 0 ? (
            filteredProperties.map((p) => (
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
                <td className="px-6 py-4 text-sm text-gray-500">{p.location}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.price}</td>
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
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => togglePropertyStatus(p.id)}
                        >
                          {p.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
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
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No properties found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
