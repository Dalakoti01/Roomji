"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontalIcon, HomeIcon, BuildingIcon, ShoppingBagIcon } from "lucide-react";
import { useSelector } from "react-redux";

/**
 * Props:
 *  - searchQuery: string
 *  - category: 'selling' | 'rented' | 'shops' | 'services'
 *
 * Expects redux slices to exist at store.auth:
 *  - adminRentedProperties
 *  - adminSellingProperties
 *  - adminAllShops
 *  - adminAllServices
 *
 * NOTE: Replace the placeholder fetch endpoints with your real admin API or dispatch Redux actions.
 */

export default function PropertiesList({ searchQuery = "", category = "selling" }) {
  const { adminRentedProperties = [] } = useSelector((store) => store.auth || {});
  const { adminSellingProperties = [] } = useSelector((store) => store.auth || {});
  const { adminAllShops = [] } = useSelector((store) => store.auth || {});
  const { adminAllServices = [] } = useSelector((store) => store.auth || {});

  // local UI state (derived from selected redux slice)
  const [properties, setProperties] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // format date for en-IN
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // map each model to a common UI shape
  useEffect(() => {
    let source = [];
    if (category === "selling") source = adminSellingProperties;
    else if (category === "rented") source = adminRentedProperties;
    else if (category === "shops") source = adminAllShops;
    else if (category === "services") source = adminAllServices;

    const mapped = (source || []).map((item) => {
      // attempt robust extractions given slightly different model shapes
      const id = item._id || item.id || item.uniqueId || Math.random().toString(36).slice(2, 9);
      // title/title/name fallback
      const title = item.title || item.name || item.shopName || item.serviceName || "Untitled";
      // type - use propertyTypes (rented/selling) or fallback strings
      const type = item.propertyTypes || item.type || (category === "shops" ? "Shop" : category === "services" ? "Service" : "Property");
      // price may be stored as price or rent or amount
      const price =
        typeof item.price === "string"
          ? item.price
          : typeof item.price === "number"
          ? `₹${item.price}`
          : item.rent
          ? item.rent
          : item.amount
          ? `₹${item.amount}`
          : "—";
      // owner: try nested owner object then fallback to a top-level ownerName
      const ownerName =
        (item.owner && (item.owner.fullName || item.owner.name)) ||
        item.ownerName ||
        (item.user && (item.user.fullName || item.user.name)) ||
        "Unknown";
      // location: try address city/state or a location field
      const location =
        (item.address && (item.address.city || `${item.address.detailedAddress || ""} ${item.address.state || ""}`.trim())) ||
        item.location ||
        item.city ||
        "—";
      // status: blocked -> inactive, isPublic maybe active/inactive, or item.blocked boolean
      const status =
        typeof item.blocked === "boolean"
          ? item.blocked
            ? "inactive"
            : "active"
          : item.status || (item.isPublic === false ? "inactive" : "active") || "active";
      // createdAt or postedDate fallback
      const postedDate = fmtDate(item.createdAt || item.postedDate || item.updatedAt);

      return {
        id,
        title,
        type,
        category,
        location,
        price,
        owner: ownerName,
        status,
        postedDate,
        raw: item,
      };
    });

    setProperties(mapped);
    setActionMenuOpen(null);
  }, [adminRentedProperties, adminSellingProperties, adminAllShops, adminAllServices, category]);

  // optimistic toggle status (activate/deactivate)
  const togglePropertyStatus = async (propertyId) => {
    // optimistic UI
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              status: p.status === "active" ? "inactive" : "active",
            }
          : p
      )
    );
    setActionMenuOpen(null);

    // determine api route by category (replace with your real routes)
    let apiPath = "/api/admin/properties";
    if (category === "rented") apiPath = `/api/admin/rented/${propertyId}/toggle-status`;
    else if (category === "selling") apiPath = `/api/admin/selling/${propertyId}/toggle-status`;
    else if (category === "shops") apiPath = `/api/admin/shops/${propertyId}/toggle-status`;
    else if (category === "services") apiPath = `/api/admin/services/${propertyId}/toggle-status`;

    try {
      const res = await fetch(apiPath, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to toggle status on server");
      // optionally refresh store or dispatch an action here
    } catch (err) {
      console.error("toggle status failed:", err);
      // revert optimistic change
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                status: p.status === "active" ? "inactive" : "active",
              }
            : p
        )
      );
      alert("Failed to update status. Check console.");
    }
  };

  // placeholder delete action
  const deleteProperty = async (propertyId, title) => {
    if (!confirm(`Delete ${title}? This action cannot be undone.`)) return;

    const previous = properties;
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    setActionMenuOpen(null);

    let apiPath = "/api/admin/properties";
    if (category === "rented") apiPath = `/api/admin/rented/${propertyId}`;
    else if (category === "selling") apiPath = `/api/admin/selling/${propertyId}`;
    else if (category === "shops") apiPath = `/api/admin/shops/${propertyId}`;
    else if (category === "services") apiPath = `/api/admin/services/${propertyId}`;

    try {
      const res = await fetch(apiPath, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed on server");
      // optionally refresh redux store / re-fetch
    } catch (err) {
      console.error("delete failed:", err);
      setProperties(previous);
      alert("Failed to delete. Check console.");
    }
  };

  const getPropertyIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "room":
      case "pg":
      case "hostel":
        return <HomeIcon className="h-5 w-5 text-blue-500" />;
      case "apartment":
      case "villa":
      case "house":
        return <BuildingIcon className="h-5 w-5 text-purple-500" />;
      case "shop":
        return <ShoppingBagIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <HomeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // filter by searchQuery: title, location, owner
  const q = (searchQuery || "").toLowerCase().trim();
  const filteredProperties = properties.filter((p) => {
    if (!q) return true;
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.location || "").toLowerCase().includes(q) ||
      (p.owner || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Property", "Location", "Price", "Owner", "Status", "Actions"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(p.status)}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 relative">
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setActionMenuOpen(actionMenuOpen === p.id ? null : p.id)}>
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === p.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => alert(`View ${p.title} details\n\n${JSON.stringify(p.raw || {}, null, 2)}`)}>
                          View Details
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => togglePropertyStatus(p.id)}>
                          {p.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => deleteProperty(p.id, p.title)}>
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
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No properties found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
