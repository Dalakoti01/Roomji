'use client';

import React, { useState } from 'react';
import { MoreHorizontalIcon, StarIcon, CheckIcon } from 'lucide-react';

export default function FeedbackList({ searchQuery }) {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: '1',
      user: 'Rahul Sharma',
      email: 'rahul@example.com',
      rating: 5,
      message: 'Great platform! Found a perfect apartment in just 2 days.',
      date: '12 Jun 2023',
      read: true,
    },
    {
      id: '2',
      user: 'Priya Patel',
      email: 'priya@example.com',
      rating: 4,
      message: 'Very useful website. Would be nice to have more filter options.',
      date: '05 Mar 2023',
      read: true,
    },
    {
      id: '3',
      user: 'Amit Kumar',
      email: 'amit@example.com',
      rating: 2,
      message:
        'Had some issues with contacting property owners. Please improve the messaging system.',
      date: '18 Jan 2023',
      read: false,
    },
    {
      id: '4',
      user: 'Neha Singh',
      email: 'neha@example.com',
      rating: 5,
      message:
        'The premium subscription is worth every penny! Got so many responses for my PG.',
      date: '24 Aug 2023',
      read: true,
    },
    {
      id: '5',
      user: 'Vikram Joshi',
      email: 'vikram@example.com',
      rating: 3,
      message: 'App is good but needs better UI for mobile users.',
      date: '10 Nov 2023',
      read: false,
    },
  ]);

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const markAsRead = (id) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, read: true } : f))
    );
    setActionMenuOpen(null);
  };

  const deleteFeedback = (id) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setActionMenuOpen(null);
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const query = (searchQuery || '').toLowerCase();
    return (
      (f.user?.toLowerCase() || '').includes(query) ||
      (f.email?.toLowerCase() || '').includes(query) ||
      (f.message?.toLowerCase() || '').includes(query)
    );
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Feedback Cards */}
      <div className="divide-y divide-gray-200">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((f) => (
            <div key={f.id} className={`p-6 ${f.read ? '' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#eb4c60] rounded-full flex items-center justify-center text-white font-medium">
                      {f.user.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {f.user}
                      </h3>
                      {!f.read && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{f.email}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < f.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill={i < f.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">{f.date}</span>
                    </div>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setActionMenuOpen(actionMenuOpen === f.id ? null : f.id)
                    }
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === f.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {!f.read && (
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => markAsRead(f.id)}
                          >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Mark as Read
                          </button>
                        )}
                        <button
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => deleteFeedback(f.id)}
                        >
                          Delete Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mt-4">
                <p className="text-sm text-gray-700">{f.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">
            No feedback found matching your search criteria.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredFeedbacks.length}</span> of{' '}
            <span className="font-medium">{feedbacks.length}</span> feedback
            entries
          </div>
          <div className="flex-1 flex justify-end">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3">
              Previous
            </button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
