"use client";

import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <footer className="bg-[#eb4c60] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand / About Section */}
        <div>
          <h2 className="text-xl font-bold mb-3">GharSewa</h2>
          <p className="text-sm leading-relaxed">
            GharSewa is your trusted platform for finding rooms, flats, shops,
            and PGs with ease. We connect property owners and seekers through a
            seamless experience, making renting and listing simple, reliable,
            and hassle-free across cities.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Navigation:</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/">Homes</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/shops">Shops</Link>
            </li>
            <li>
              <Link href="/rent">Rents</Link>
            </li>
            <li>
              {user ? (
                <Link href="/user/pricing">Pricing</Link>
              ) : (
                <Link href="/auth">Pricing</Link>
              )}
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links:</h3>
          <ul className="space-y-2 text-sm">
            {/* <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/faqs">FAQs</Link>
            </li> */}
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact:</h3>
          <ul className="space-y-2 text-sm">
            <li>+91 94541 91213</li>
            <li>Delhi, India</li>
            <li>
              <a href="mailto:roomji@example.com">gharsewa@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-white/40"></div>

      {/* Social Icons + Copyright */}
      <div className="flex flex-col items-center justify-between gap-4 max-w-7xl mx-auto px-6">
        {/* Social dots (just as placeholder) */}
        <div className="flex gap-3">
          <span className="w-4 h-4 bg-white rounded-full inline-block"></span>
          <span className="w-4 h-4 bg-white rounded-full inline-block"></span>
          <span className="w-4 h-4 bg-white rounded-full inline-block"></span>
          <span className="w-4 h-4 bg-white rounded-full inline-block"></span>
        </div>

        <p className="text-sm text-center md:text-right">
          Copyright © 2025, GharSewa. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
