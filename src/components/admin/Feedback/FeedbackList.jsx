'use client';

import React, { useMemo, useState } from 'react';
import { MoreHorizontalIcon, CheckIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function FeedbackList({ searchQuery }) {
  const { allFeedbacks } = useSelector((store) => store.auth);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // 🔹 Flatten users -> feedbacks
  const feedbacks = useMemo(() => {
    if (!Array.isArray(allFeedbacks)) return [];

    return allFeedbacks.flatMap((user) =>
      (user.feedbackToPlatform || []).map((fb) => ({
        id: fb._id,
        user: user.fullName,
        email: user.email,
        message: fb.feedback,
        date: new Date(fb.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        read: fb.isRead,
      }))
    );
  }, [allFeedbacks]);

  // 🔹 Search filter
  const filteredFeedbacks = feedbacks.filter((f) => {
    const query = (searchQuery || '').toLowerCase();
    return (
      f.user?.toLowerCase().includes(query) ||
      f.email?.toLowerCase().includes(query) ||
      f.message?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((f) => (
            <div
              key={f.id}
              className={`p-6 ${f.read ? '' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#eb4c60] rounded-full flex items-center justify-center text-white font-medium">
                    {f.user?.charAt(0)}
                  </div>

                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {f.user}
                      </h3>
                      {!f.read && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{f.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{f.date}</p>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() =>
                      setActionMenuOpen(actionMenuOpen === f.id ? null : f.id)
                    }
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === f.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-10">
                      {!f.read && (
                        <button
                          className="flex w-full px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete Feedback
                      </button>
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
            No feedback found.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white px-4 py-3 border-t text-sm text-gray-700">
        Showing <span className="font-medium">{filteredFeedbacks.length}</span>{' '}
        feedback entries
      </div>
    </div>
  );
}
