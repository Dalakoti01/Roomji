'use client';

import React, { useMemo, useState } from 'react';
import {
  MoreHorizontalIcon,
  CheckIcon,
  MailIcon,
} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function ContactQueriesList({ searchQuery }) {
  const { allAdminSupports } = useSelector((store) => store.auth);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // 🔹 Flatten users → support messages
  const queries = useMemo(() => {
    if (!Array.isArray(allAdminSupports)) return [];

    return allAdminSupports.flatMap((user) =>
      (user.adminSupportMessages || []).map((msg) => ({
        id: msg._id,
        name: `${msg.firstName || ''} ${msg.lastName || ''}`.trim(),
        email: msg.email,
        message: msg.message,
        date: new Date(msg.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: msg.replyByAdmin ? 'resolved' : 'new',
      }))
    );
  }, [allAdminSupports]);

  // 🔹 Search
  const filteredQueries = queries.filter((q) => {
    const query = (searchQuery || '').toLowerCase();
    return (
      q.name?.toLowerCase().includes(query) ||
      q.email?.toLowerCase().includes(query) ||
      q.message?.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                {/* Name + Status */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      Support Query
                    </h3>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                        q.status
                      )}`}
                    >
                      {q.status === 'new' ? 'New' : 'Resolved'}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    <span className="font-medium text-gray-900 mr-2">
                      {q.name || 'Unknown User'}
                    </span>
                    • <span className="ml-2">{q.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
                          <button className="flex w-full px-4 py-2 text-sm hover:bg-gray-100">
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </button>
                        )}
                        <button className="flex w-full px-4 py-2 text-sm hover:bg-gray-100">
                          Reply
                        </button>
                        <button className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
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

              {/* Contact */}
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <MailIcon className="h-4 w-4 mr-1" />
                <a
                  href={`mailto:${q.email}`}
                  className="hover:text-[#eb4c60]"
                >
                  {q.email}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">
            No queries found.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white px-4 py-3 border-t text-sm text-gray-700">
        Showing <span className="font-medium">{filteredQueries.length}</span>{' '}
        queries
      </div>
    </div>
  );
}
