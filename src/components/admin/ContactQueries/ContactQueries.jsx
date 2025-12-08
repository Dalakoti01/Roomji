'use client';

import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
import ContactQueriesList from './ContactQueriesList';

export default function ContactQueriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contact Queries</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#eb4c60] focus:border-[#eb4c60] sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FilterIcon className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Contact Queries List */}
      <ContactQueriesList searchQuery={searchQuery} />
    </div>
  );
}
