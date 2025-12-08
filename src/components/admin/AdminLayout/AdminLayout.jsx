"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  BuildingIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  MailIcon,
  DollarSignIcon,
  MenuIcon,
  XIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  CrownIcon,
  KeyIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname() || "/";
  const dispatch = useDispatch();
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "All Users", href: "/admin/users", icon: UsersIcon },
    {
      name: "Subscribed Users",
      href: "/admin/subscribed-users",
      icon: CrownIcon,
    },
    { name: "Properties", href: "/admin/properties", icon: BuildingIcon },
    {
      name: "Reported Properties",
      href: "/admin/reported-properties",
      icon: AlertTriangleIcon,
    },
    { name: "Feedback", href: "/admin/feedback", icon: MessageSquareIcon },
    { name: "Contact Queries", href: "/admin/contact-queries", icon: MailIcon },
    { name: "Revenue", href: "/admin/revenue", icon: DollarSignIcon },
    { name: "Change Password", href: "/admin/change-password", icon: KeyIcon },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        setShowLogoutDialog(false);
        router.push("/");
      }
    } catch (error) {
      toast.error(error.response?.data.message)
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-[#eb4c60] rounded-md hover:bg-[#d43b4f]"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 z-40 md:hidden`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white">
          <div className="flex items-center justify-between h-16 px-6 bg-[#eb4c60]">
            <span className="text-xl font-bold text-white">roomji admin</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-[#eb4c60] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mr-3 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setShowLogoutDialog(true);
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                <LogOutIcon className="w-5 h-5 mr-3 text-gray-500" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 px-6 bg-[#eb4c60]">
              <span className="text-xl font-bold text-white">roomji admin</span>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-[#eb4c60] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mr-3 ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}

                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <LogOutIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 focus:outline-none"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <BellIcon className="w-6 h-6" />
            </button>

            <div className="relative">
              <button className="flex items-center space-x-2 text-sm text-gray-700 focus:outline-none">
                <div className="w-8 h-8 bg-[#eb4c60] rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:inline-block">Admin User</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
