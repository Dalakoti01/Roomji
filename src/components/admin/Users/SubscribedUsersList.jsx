"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontalIcon, UserIcon, CrownIcon } from "lucide-react";
import useGetAllSubscribedUsers from "@/hooks/admin/useGetAllSubscribedUsers";
import { useSelector } from "react-redux";

export default function SubscribedUsersList({ searchQuery = "" }) {
  // ensure data is fetched
  useGetAllSubscribedUsers();

  // subscribedUsers comes from your redux auth slice
  const { subscribedUsers = [] } = useSelector((store) => store.auth || {});

  // local UI state derived from subscribedUsers
  const [users, setUsers] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // helper: format date for en-IN
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // map redux data -> UI rows
  useEffect(() => {
    const mapped = (subscribedUsers || [])
      .map((u) => {
        // pick subscription start/end: prefer serviceSubscription then propertySubscription
        const subStart =
          u?.serviceSubscription?.startDate ||
          u?.propertySubscription?.startDate ||
          u?.currentPlanDetails?.startDate ||
          null;
        const subEnd =
          u?.serviceSubscription?.endDate ||
          u?.propertySubscription?.endDate ||
          u?.currentPlanDetails?.endDate ||
          null;

        return {
          id: u._id,
          name: u.fullName || u.email || "Unknown",
          email: u.email || "—",
          plan: (u.currentPlanDetails && u.currentPlanDetails.planName) || "—",
          startDate: fmt(subStart),
          endDate: fmt(subEnd),
          amount:
            typeof (u.currentPlanDetails && u.currentPlanDetails.planAmount) === "number"
              ? `₹${u.currentPlanDetails.planAmount}`
              : "—",
          autoRenew: false, // per your requirement: always No
          raw: u,
        };
      })
      // keep only those that look like active subscribers (optionally filter)
      .filter((row) => {
        // If you want to show only users with currentPlanDetails.isActive, uncomment below:
        // return row.raw?.currentPlanDetails?.isActive;
        // For safety, include all provided subscribedUsers (your hook probably only returns subscribed ones)
        return true;
      });

    setUsers(mapped);
  }, [subscribedUsers]);

  // search filter (name, email, plan)
  const q = (searchQuery || "").toLowerCase().trim();
  const filteredUsers = users.filter((user) => {
    if (!q) return true;
    return (
      (user.name || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.plan || "").toLowerCase().includes(q)
    );
  });

  // View details placeholder
  const viewDetails = (user) => {
    // use modal or route to `/admin/users/${user.id}` if you have it
    alert(JSON.stringify(user.raw, null, 2));
  };

  // Edit subscription placeholder
  const editSubscription = (user) => {
    // open modal or navigate to edit page
    alert(`Open edit UI for ${user.name}`);
  };

  // Cancel subscription (optimistic): replace endpoint with your real route
  const cancelSubscription = async (userId) => {
    if (!confirm("Cancel this user's subscription?")) return;

    // optimistic update: mark as cancelled (remove from list)
    const prev = users;
    setUsers((u) => u.filter((x) => x.id !== userId));
    setActionMenuOpen(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}/cancel-subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by admin" }),
      });

      if (!res.ok) throw new Error("Failed to cancel on server");

      // optionally you can re-fetch via your hook
    } catch (err) {
      // revert on error
      setUsers(prev);
      console.error("Cancel subscription failed:", err);
      alert("Failed to cancel subscription. See console for details.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["User", "Plan", "Subscription Period", "Amount", "Auto Renew", "Actions"].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CrownIcon
                      className={`h-4 w-4 mr-1 ${
                        user.plan === "Basic" ? "text-blue-500" : user.plan === "Premium" ? "text-[#eb4c60]" : "text-purple-600"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        user.plan === "Basic" ? "text-blue-500" : user.plan === "Premium" ? "text-[#eb4c60]" : "text-purple-600"
                      }`}
                    >
                      {user.plan}
                    </span>
                  </div>
                </td>

                {/* Subscription */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{user.startDate}</div>
                  <div>to {user.endDate}</div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.amount}</td>

                {/* Auto Renew (always No) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800`}>
                    No
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}>
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => viewDetails(user)}>
                          View Details
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => editSubscription(user)}>
                          Edit Subscription
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => cancelSubscription(user.id)}>
                          Cancel Subscription
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
                No subscribed users found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
