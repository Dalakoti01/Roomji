"use client";

import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdminLayout from "../admin/AdminLayout/AdminLayout";

const FinalLayout = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  // If user is admin → render AdminLayout instead
  if (user?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Default layout for normal users
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default FinalLayout;
