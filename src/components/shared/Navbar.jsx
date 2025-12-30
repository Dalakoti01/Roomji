"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";
import PostDialog from "./PostDialog";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await axios.get("/api/auth/logout", { withCredentials: true });
    if (res.data.success) {
      dispatch(setUser(null));
      toast.success(res.data.message);
      router.push("/auth");
    }
    // Close all menus when logout happens
    setPopoverOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Room Rent", href: "/rent" },
    { name: "Shops Rent", href: "/shops" },
    { name: "Services", href: "/services" },
    { name: "Buy Property", href: "/buy" },
  ];

  return (
    <>
      <nav className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left Section */}
          <div className="flex gap-2 items-center">
            <h1 className="text-[#eb4c60] text-lg font-semibold">LOGO</h1>
            <p className="text-[#eb4c60] text-lg font-semibold">Roomji</p>
          </div>

          {/* Desktop NavLinks */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-700 hover:text-[#eb4c60] font-medium transition"
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#eb4c60] transition-all duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Button
                  onClick={() => router.push("/auth")}
                  variant="outline"
                  className="hidden bg-[#eb4c60] text-white cursor-pointer md:block"
                >
                  Join Now
                </Button>
                {/* Mobile Menu Icon */}
                <Menu
                  className="md:hidden cursor-pointer text-gray-700"
                  onClick={() => setMenuOpen((prev) => !prev)}
                />
              </>
            ) : (
              <>
                {/* Avatar */}
                <Avatar
                  onClick={() => router.push("/user/profile")}
                  className="cursor-pointer"
                >
                  <AvatarImage
                    src={user?.profilePhoto || "/default-avatar.png"}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>
                    {user?.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Desktop Popover */}
                <div className="hidden md:block">
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Menu className="cursor-pointer text-gray-700" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-44 mt-2 bg-white shadow-md border rounded-md p-3 flex flex-col gap-2"
                    >
                      {/* POST DIALOG */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOpenPostDialog(true);
                          setPopoverOpen(false); // ✅ close popover when dialog opens
                        }}
                        className="w-full cursor-pointer border-[#eb4c60] text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Post
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/user/message");
                          setPopoverOpen(false); // ✅ close popover when dialog opens
                        }}
                        className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Messages
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/user/pricing");
                          setPopoverOpen(false); // ✅ close after click
                        }}
                        className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Pricing
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/user/contact-admin");
                          setPopoverOpen(false); // ✅ close after click
                        }}
                        className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Contact Admin
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/user/change-password");
                          setPopoverOpen(false); // ✅ close after click
                        }}
                        className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/user/feedback");
                          setPopoverOpen(false); // ✅ close after click
                        }}
                        className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Feedback
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/user/deleteAccount");
                          setPopoverOpen(false); // ✅ close after click
                        }}
                        className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                      >
                        Delete Account
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full bg-[#eb4c60] cursor-pointer hover:bg-[#d43c50] text-white"
                      >
                        Logout
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Mobile Menu Icon */}
                <Menu
                  className="md:hidden cursor-pointer text-gray-700"
                  onClick={() => setMenuOpen((prev) => !prev)}
                />
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 flex flex-col items-start px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`w-full text-gray-700 font-medium ${
                  pathname === link.href
                    ? "text-[#eb4c60] border-b-2 border-[#eb4c60]"
                    : "hover:text-[#eb4c60]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* New mobile-only buttons */}
            {user && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenPostDialog(true);
                    setMenuOpen(false); // ✅ close menu when post dialog opens
                  }}
                  className="w-full border-[#eb4c60] text-[#eb4c60] cursor-pointer hover:bg-[#eb4c60] hover:text-white"
                >
                  Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/contact-admin");
                    setMenuOpen(false);
                  }}
                  className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                >
                  Contact Admin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/feedback");
                    setMenuOpen(false);
                  }}
                  className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                >
                  Feedback
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/user/message");
                    setPopoverOpen(false); // ✅ close popover when dialog opens
                  }}
                  className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                >
                  Messages
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/user/pricing");
                    setPopoverOpen(false); // ✅ close after click
                  }}
                  className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                >
                  Pricing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/user/change-password");
                    setPopoverOpen(false); // ✅ close after click
                  }}
                  className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                >
                  Change Password
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/user/deleteAccount");
                    setPopoverOpen(false); // ✅ close after click
                  }}
                  className="w-full border-[#eb4c60] cursor-pointer text-[#eb4c60] hover:bg-[#eb4c60] hover:text-white"
                >
                  Delete Account
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full bg-[#eb4c60] cursor-pointer hover:bg-[#d43c50] text-white"
                >
                  Logout
                </Button>
              </>
            )}

            {!user && (
              <Button
                variant="outline"
                className="mt-2 bg-[#eb4c60] cursor-pointer text-white w-full"
                onClick={() => {
                  router.push("/auth");
                  setMenuOpen(false);
                }}
              >
                Join Now
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* POST DIALOG COMPONENT */}
      <PostDialog open={openPostDialog} setOpen={setOpenPostDialog} />
    </>
  );
};

export default Navbar;
