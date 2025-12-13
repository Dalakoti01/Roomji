'use client';

import React, { useMemo, useState } from 'react';
import {
  MoreHorizontalIcon,
  HomeIcon,
  BuildingIcon,
  ShoppingBagIcon,
  AlertTriangle,
} from 'lucide-react';
import { useSelector } from 'react-redux';

/**
 * Dynamic ReportedPropertiesList
 * - Expects redux slices: adminReportedSellingProperties, adminReportedRentedProperties, adminReportedShops, adminReportedServices
 * - Uses model fields:
 *    - owner.fullName
 *    - reports: [{ reportedBy, reason, reportDate, ... }]
 *    - reportStatus (group-level)
 */

export default function ReportedPropertiesList({ searchQuery = '', category = 'selling' }) {
  const { adminReportedRentedProperties = [] } = useSelector((store) => store.auth || {});
  const { adminReportedSellingProperties = [] } = useSelector((store) => store.auth || {});
  const { adminReportedShops = [] } = useSelector((store) => store.auth || {});
  const { adminReportedServices = [] } = useSelector((store) => store.auth || {});

  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [expandedProperty, setExpandedProperty] = useState(null); // property id showing all reports

  // pick source by category
  const source = useMemo(() => {
    if (category === 'selling') return adminReportedSellingProperties;
    if (category === 'rented') return adminReportedRentedProperties;
    if (category === 'shops') return adminReportedShops;
    if (category === 'services') return adminReportedServices;
    return [];
  }, [
    category,
    adminReportedSellingProperties,
    adminReportedRentedProperties,
    adminReportedShops,
    adminReportedServices,
  ]);

  // icons
  const getPropertyIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'room':
      case 'pg':
      case 'hostel':
        return <HomeIcon className="h-5 w-5 text-blue-500" />;
      case 'apartment':
      case 'villa':
      case 'house':
        return <BuildingIcon className="h-5 w-5 text-purple-500" />;
      case 'shop':
        return <ShoppingBagIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <HomeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // status -> badge classes
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const s = status.toString().toLowerCase();
    if (s.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    if (s.includes('reviewed')) return 'bg-blue-100 text-blue-800';
    if (s.includes('action')) return 'bg-orange-100 text-orange-800';
    if (s.includes('resolved') || s.includes('taken')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // normalize and group incoming source to expected UI shape
  const propertyGroups = useMemo(() => {
    const items = (source || []).map((it) => ({ ...it, _id: it._id || it.id || String(Math.random()).slice(2) }));

    return items
      .map((item) => {
        // get reports using standard key (model uses `reports`)
        const rawReports = Array.isArray(item.reports) ? item.reports : [];

        // normalize each report
        const normalizedReports = rawReports.map((r, idx) => {
          // reportedBy may be ObjectId or populated user object
          let reporterName = 'Unknown';
          if (r && r.reportedBy) {
            if (typeof r.reportedBy === 'object') {
              // populated
              reporterName = r.reportedBy.fullName || r.reportedBy.name || String(r.reportedBy.email || 'Unknown');
            } else {
              // it's an id string
              reporterName = String(r.reportedBy).slice(0, 8);
            }
          }
          const date = r && (r.reportDate || r.reportedDate || r.date) ? new Date(r.reportDate || r.reportedDate || r.date) : null;
          return {
            id: r && (r._id || r.id) ? r._id || r.id : `${item._id}-r-${idx}`,
            reportedBy: reporterName,
            reason: (r && (r.reason || r.reportReason || r.message)) || 'No reason provided',
            date,
            status: (r && r.status) || 'Pending',
            raw: r,
          };
        });

        // get owner name from owner.fullName
        const ownerName =
          (item.owner && (item.owner.fullName || item.owner.name)) ||
          item.ownerName ||
          (item.user && (item.user.fullName || item.user.name)) ||
          'Unknown';

        return {
          propertyId: item._id,
          title: item.title || item.name || item.shopName || 'Untitled',
          type: item.propertyTypes || item.type || item.category || (category === 'shops' ? 'Shop' : 'Property'),
          owner: ownerName,
          location:
            (item.address && (item.address.city || item.address.state)) || item.location || item.city || '—',
          reports: normalizedReports,
          reportStatus: item.reportStatus || null, // prefer model's reportStatus
          raw: item,
        };
      })
      // keep only properties that have >=1 report (should be true for reported lists)
      .filter((g) => (g.reports || []).length > 0);
  }, [source, category]);

  // if store is empty (very unlikely now), show nothing message — no longer using large fallback demo
  const effectiveGroups = propertyGroups;

  // search/filter across property title, owner, report reason or reporter name
  const q = (searchQuery || '').toLowerCase().trim();
  const filteredGroups = effectiveGroups.filter((g) => {
    if (!q) return true;
    const inTitle = (g.title || '').toLowerCase().includes(q);
    const inOwner = (g.owner || '').toLowerCase().includes(q);
    const inReports = g.reports.some(
      (r) => (r.reportedBy || '').toLowerCase().includes(q) || (r.reason || '').toLowerCase().includes(q)
    );
    return inTitle || inOwner || inReports;
  });

  // UI-only actions (replace with API calls + redux refresh)
  const updateSingleReportStatus = (propertyId, reportId, newStatus) => {
    // In production: call API to update report status then refresh store.
    // For now, perform a quick UI-only refresh by toggling expandedProperty (keeps UX responsive)
    setExpandedProperty((cur) => (cur === propertyId ? null : propertyId));
    setTimeout(() => setExpandedProperty(propertyId), 0);
    // Optionally show toast here
  };

  const deleteReport = (propertyId, reportId) => {
    if (!confirm('Delete this report? This action cannot be undone.')) return;
    // Call API to delete report then refresh store. For now show alert.
    alert('Report delete requested — implement server API call and refresh redux store.');
  };

  const viewReportJSON = (report) => {
    alert(JSON.stringify(report.raw || report, null, 2));
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Property', 'Report Details', 'Owner', 'Status', 'Actions'].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((g) => {
              const firstReport = g.reports[0];
              const reportsCount = g.reports.length;
              const isExpanded = expandedProperty === g.propertyId;

              // prefer model's reportStatus; fallback to derive from reports
              const groupStatus =
                (g.reportStatus && g.reportStatus) ||
                (g.reports.some((r) => (r.status || '').toLowerCase().includes('pending'))
                  ? 'Pending'
                  : g.reports.some((r) => (r.status || '').toLowerCase().includes('reviewed'))
                  ? 'Reviewed'
                  : 'Resolved');

              return (
                <React.Fragment key={g.propertyId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          {getPropertyIcon(g.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{g.title}</div>
                          <div className="text-xs text-gray-500">
                            {g.type} • {g.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-[#eb4c60] mr-1" />
                        Reported by: {firstReport?.reportedBy || '—'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{firstReport?.reason || '—'}</div>
                      <div className="text-xs text-gray-500 mt-1">Reported on: {fmtDate(firstReport?.date)}</div>

                      {reportsCount > 1 && (
                        <div className="mt-2">
                          <button
                            className="text-sm underline text-[#eb4c60]"
                            onClick={() => setExpandedProperty(isExpanded ? null : g.propertyId)}
                          >
                            {isExpanded ? 'Hide' : `Show all reports (${reportsCount})`}
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">{g.owner}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(groupStatus)}`}>
                        {groupStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 relative">
                      <button className="text-gray-500 hover:text-gray-700" onClick={() => setActionMenuOpen(actionMenuOpen === g.propertyId ? null : g.propertyId)}>
                        <MoreHorizontalIcon className="h-5 w-5" />
                      </button>

                      {actionMenuOpen === g.propertyId && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => alert(`View property details\n\n${JSON.stringify(g.raw || {}, null, 2)}`)}
                            >
                              View Property Details
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setExpandedProperty(g.propertyId)}
                            >
                              View All Reports
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => alert('Delete property (implement API).')}
                            >
                              Delete Property
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Expanded sub-row with all reports for this property */}
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-3">
                          {g.reports.map((r) => (
                            <div key={r.id} className="border border-gray-200 rounded-md p-3 bg-white flex items-start justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{r.reportedBy}</div>
                                <div className="text-sm text-gray-700">{r.reason}</div>
                                <div className="text-xs text-gray-500 mt-1">Reported on: {fmtDate(r.date)}</div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(r.status)}`}>
                                  {r.status}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button className="text-xs px-2 py-1 border rounded text-gray-700 hover:bg-gray-100" onClick={() => viewReportJSON(r)}>
                                    View
                                  </button>

                                  {String(r.status).toLowerCase() !== 'reviewed' && (
                                    <button className="text-xs px-2 py-1 border rounded text-gray-700 hover:bg-gray-100" onClick={() => updateSingleReportStatus(g.propertyId, r.id, 'Reviewed')}>
                                      Mark Reviewed
                                    </button>
                                  )}

                                  {(String(r.status).toLowerCase() === 'pending' || String(r.status).toLowerCase() === 'reviewed') && (
                                    <button className="text-xs px-2 py-1 border rounded text-gray-700 hover:bg-gray-100" onClick={() => updateSingleReportStatus(g.propertyId, r.id, 'Resolved')}>
                                      Mark Resolved
                                    </button>
                                  )}

                                  <button className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50" onClick={() => deleteReport(g.propertyId, r.id)}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
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
