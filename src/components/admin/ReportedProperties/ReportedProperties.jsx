'use client';

import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
import ReportedPropertiesList from '../Properties/ReportedPropertiesList';
import useGetAdminReportedProperties from '@/hooks/admin/useGetAdminReportedProperties';

export default function ReportedPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('selling');

  
  useGetAdminReportedProperties()
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reported Properties</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['selling', 'rented', 'shops', 'services'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-[#eb4c60] text-[#eb4c60]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'selling'
                  ? 'Selling Properties'
                  : tab === 'rented'
                  ? 'Rented Properties'
                  : tab === 'shops'
                  ? 'Shops'
                  : 'Services'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#eb4c60] focus:border-[#eb4c60] sm:text-sm"
                placeholder="Search reported properties..."
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

          {/* Reported Properties Table */}
          <ReportedPropertiesList searchQuery={searchQuery} category={activeTab} />
        </div>
      </div>
    </div>
  );
}
