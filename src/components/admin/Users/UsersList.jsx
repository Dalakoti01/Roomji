"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontalIcon, UserIcon } from "lucide-react";
import useGetAllUsers from "@/hooks/admin/useGetAllUsers";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

export default function UsersList({ searchQuery = "" }) {
  // ensure global fetch/hook runs
  useGetAllUsers();

  // grab users from redux
  const { allUsers = [] } = useSelector((store) => store.auth || {});

  // local UI state
  const [users, setUsers] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // map redux users to UI shape
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
        propertiesCount:
          typeof u.totalProperties === "number" ? u.totalProperties : 0,
        servicesCount:
          typeof u.totalService === "number" ? u.totalService : 0,
        raw: u,
      };
    });

    setUsers(mapped);
  }, [allUsers]);

  // 🔒 Block / Unblock user
  const toggleBlockUser = async (userId) => {
    const prevUsers = users;

    // optimistic update
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "blocked" : "active",
            }
          : user
      )
    );
    setActionMenuOpen(null);

    try {
      const res = await axios.post("/api/admin/blockUser", { id: userId });

      if (res.data?.success) {
        toast.success(res.data.message || "User status updated");
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      setUsers(prevUsers);
      toast.error(
        error?.response?.data?.message || "Failed to update user status"
      );
    }
  };

  // 🗑️ Delete user
  const deleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user?\nAll their properties, services and shops will also be deleted."
      )
    )
      return;

    const prevUsers = users;

    // optimistic remove
    setUsers((u) => u.filter((x) => x.id !== userId));
    setActionMenuOpen(null);

    try {
      const res = await axios.post("/api/admin/deleteUser", { id: userId });

      if (res.data?.success) {
        toast.success("User deleted successfully");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      setUsers(prevUsers);
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  };

  // filter users by search query
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
                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joinDate}
                </td>

                {/* Properties */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.propertiesCount}
                </td>

                {/* Services */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.servicesCount}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() +
                      user.status.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <button
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() =>
                      setActionMenuOpen(
                        actionMenuOpen === user.id ? null : user.id
                      )
                    }
                  >
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>

                  {actionMenuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => toggleBlockUser(user.id)}
                        >
                          {user.status === "active"
                            ? "Block User"
                            : "Unblock User"}
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
              <td
                colSpan={7}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No users found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
