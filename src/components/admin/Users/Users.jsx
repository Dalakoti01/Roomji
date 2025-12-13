'use client';

import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
import UsersList from './UsersList';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <button className="px-4 py-2 bg-[#eb4c60] text-white rounded-md hover:bg-[#d43b4f] transition-colors">
          Add New User
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#eb4c60] focus:border-[#eb4c60] sm:text-sm"
            placeholder="Search users by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FilterIcon className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <UsersList searchQuery={searchQuery} />
    </div>
  );
}
