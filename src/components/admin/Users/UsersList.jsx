"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontalIcon, UserIcon } from "lucide-react";
import useGetAllUsers from "@/hooks/admin/useGetAllUsers";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function UsersList({ searchQuery = "" }) {
  // ensure global fetch/hook runs
  useGetAllUsers();

  // grab users from redux (auth slice per your project)
  const { allUsers = [] } = useSelector((store) => store.auth || {});

  // local UI state (derived from allUsers)
  const [users, setUsers] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // map server user documents to the UI shape we need
  useEffect(() => {
    const mapped = (allUsers || []).map((u) => {
      const joinDate = u?.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";

      return {
        id: u._id,
        name: u.fullName || u.email || "Unknown",
        email: u.email || "—",
        phone: u.phoneNumber || "—",
        joinDate,
        status: u.blocked ? "blocked" : "active",
        propertiesCount: typeof u.totalProperties === "number" ? u.totalProperties : 0,
        servicesCount: typeof u.totalService === "number" ? u.totalService : 0,
        raw: u, // preserve original object if needed
      };
    });

    setUsers(mapped);
  }, [allUsers]);

  // optimistic toggle block/unblock
  const toggleBlockUser = async (userId) => {
    // optimistic update
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user
      )
    );
    setActionMenuOpen(null);

    // Try to call backend to persist change.
    // Replace endpoint with your real admin route.
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // you could send the desired new status, or server can toggle
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Failed to update user status on server");
      }
      // optionally re-fetch users via your hook or dispatch if needed
    } catch (err) {
      // revert optimistic change on error
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: user.status === "active" ? "blocked" : "active" }
            : user
        )
      );
      // optionally surface toast/notification (not included to keep dep-free)
      console.error("Could not toggle block:", err);
      alert("Failed to update user status. Check console.");
    }
  };

  // placeholder view details handler
  const viewDetails = (user) => {
    // navigate to details page if you have one, e.g. /admin/users/[id]
    // or open modal
    // router.push(`/admin/users/${user.id}`);
    alert(`View details for ${user.name}`);
  };

  // placeholder delete handler
  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    // optimistic remove
    const prev = users;
    setUsers((u) => u.filter((x) => x.id !== userId));
    setActionMenuOpen(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      // optionally re-fetch users via hook/dispatch
    } catch (err) {
      // revert on error
      setUsers(prev);
      console.error("Delete failed:", err);
      alert("Failed to delete user. Check console.");
    }
  };

  // filter by searchQuery (searches name, email, phone)
  const query = (searchQuery || "").toLowerCase().trim();
  const filteredUsers = users.filter((user) => {
    if (!query) return true;
    return (
      (user.name || "").toLowerCase().includes(query) ||
      (user.email || "").toLowerCase().includes(query) ||
      (user.phone || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "User",
              "Contact",
              "Join Date",
              "Properties",
              "Services",
              "Status",
              "Actions",
            ].map((header) => (
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
                {/* User column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>

                {/* Properties */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.propertiesCount}</td>

                {/* Services */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.servicesCount}</td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => viewDetails(user)}
                        >
                          View Details
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => toggleBlockUser(user.id)}
                        >
                          {user.status === "active" ? "Block User" : "Unblock User"}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete User
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                No users found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUsers.length > 0 ? 1 : 0}</span> to{" "}
            <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex-1 flex justify-end">
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
