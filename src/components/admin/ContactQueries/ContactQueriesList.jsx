'use client';

import React, { useState } from 'react';
import {
  MoreHorizontalIcon,
  CheckIcon,
  MailIcon,
  PhoneIcon,
} from 'lucide-react';

export default function ContactQueriesList({ searchQuery }) {
  const [queries, setQueries] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      subject: 'Subscription Issue',
      message:
        "I paid for the premium subscription but it's not showing in my account. Please help.",
      date: '12 Jun 2023',
      status: 'new',
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      subject: 'How to delete my property',
      message:
        'I want to remove my property listing as it has been rented out. How can I do that?',
      date: '05 Mar 2023',
      status: 'in-progress',
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91 76543 21098',
      subject: 'Refund Request',
      message:
        'I accidentally subscribed twice. Can I get a refund for one of them?',
      date: '18 Jan 2023',
      status: 'resolved',
    },
    {
      id: '4',
      name: 'Neha Singh',
      email: 'neha@example.com',
      phone: '+91 65432 10987',
      subject: 'Account Verification',
      message:
        'My account is showing as unverified. I submitted all documents yesterday.',
      date: '24 Aug 2023',
      status: 'new',
    },
    {
      id: '5',
      name: 'Vikram Joshi',
      email: 'vikram@example.com',
      phone: '+91 54321 09876',
      subject: 'Technical Issue',
      message:
        'The app keeps crashing when I try to upload photos of my property.',
      date: '10 Nov 2023',
      status: 'in-progress',
    },
  ]);

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const updateQueryStatus = (id, newStatus) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    setActionMenuOpen(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQueries = queries.filter((q) => {
    const query = (searchQuery || '').toLowerCase();
    return (
      (q.name?.toLowerCase() || '').includes(query) ||
      (q.email?.toLowerCase() || '').includes(query) ||
      (q.subject?.toLowerCase() || '').includes(query) ||
      (q.message?.toLowerCase() || '').includes(query)
    );
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((q) => (
            <div
              key={q.id}
              className={`p-6 ${q.status === 'new' ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                {/* Subject + Status */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {q.subject}
                    </h3>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                        q.status
                      )}`}
                    >
                      {q.status === 'in-progress'
                        ? 'In Progress'
                        : q.status.charAt(0).toUpperCase() +
                          q.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-900 mr-2">
                      {q.name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="ml-2">{q.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setActionMenuOpen(actionMenuOpen === q.id ? null : q.id)
                    }
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === q.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {q.status === 'new' && (
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => updateQueryStatus(q.id, 'in-progress')}
                          >
                            Mark as In Progress
                          </button>
                        )}
                        {(q.status === 'new' || q.status === 'in-progress') && (
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => updateQueryStatus(q.id, 'resolved')}
                          >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </button>
                        )}
                        <button
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => alert(`Reply to ${q.name}`)}
                        >
                          Reply
                        </button>
                        <button
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => alert(`Delete query from ${q.name}?`)}
                        >
                          Delete Query
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mt-4">
                <p className="text-sm text-gray-700">{q.message}</p>
              </div>

              {/* Contact Info */}
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MailIcon className="h-4 w-4 mr-1" />
                  <a
                    href={`mailto:${q.email}`}
                    className="hover:text-[#eb4c60]"
                  >
                    {q.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  <a href={`tel:${q.phone}`} className="hover:text-[#eb4c60]">
                    {q.phone}
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">
            No queries found matching your search criteria.
          </div>
        )}
      </div>

      {/* Footer Pagination */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredQueries.length}</span> of{' '}
            <span className="font-medium">{queries.length}</span> queries
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
