"use client";

import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header Section */}
      <div className="bg-[#eb4c60] py-12 text-center text-white shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm md:text-base mt-2 opacity-90">
          Last updated: November 2025
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-12 leading-relaxed">
        <p className="text-gray-700 mb-6">
          This Privacy Notice for <span className="font-semibold">Roomji</span>{" "}
          ("we," "us," or "our") describes how and why we might access, collect,
          store, use, and/or share ("process") your personal information when
          you use our services ("Services").
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          1. Introduction
        </h2>
        <p className="mb-6">
          By using our website or mobile application, you agree to this Privacy
          Policy. Roomji provides rental and property-related solutions for
          rooms, PGs, hostels, apartments, shops, and living services such as
          tiffin, Wi-Fi, cleaning, water supply, and more — creating a complete
          living and property ecosystem.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          2. What Information Do We Collect?
        </h2>
        <p className="mb-3 font-medium">Personal Information You Provide:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Names</li>
          <li>Phone numbers</li>
          <li>Email addresses</li>
          <li>Mailing addresses</li>
          <li>Contact preferences</li>
        </ul>

        <p className="mb-6">
          We may also collect payment details if you make purchases through our
          app. All payments are securely handled by third-party providers like
          <strong> Razorpay</strong>.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          3. How Do We Process Your Information?
        </h2>
        <p className="mb-6">
          We process your data to provide and improve our Services, ensure
          security, prevent fraud, communicate with you, and comply with legal
          obligations. We only process personal information when we have a valid
          legal reason to do so.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          4. When and With Whom Do We Share Your Information?
        </h2>
        <p className="mb-3">
          We may share data with trusted third parties in limited cases, such
          as:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            Business transfers like mergers, sales, or acquisitions of company
            assets.
          </li>
          <li>
            Google Maps Platform APIs to improve location accuracy and service
            relevance.
          </li>
          <li>Service providers who help us operate Roomji efficiently.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          5. Third-Party Links and Websites
        </h2>
        <p className="mb-6">
          Roomji may contain links to third-party websites or advertisements not
          controlled by us. We are not responsible for the safety, accuracy, or
          privacy practices of those third parties. Please review their privacy
          policies before sharing any data.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          6. Cookies and Tracking Technologies
        </h2>
        <p className="mb-6">
          We use cookies and similar technologies to enhance your experience,
          remember preferences, and analyze traffic. You can control cookies
          through your browser settings, but disabling them may limit certain
          features of the platform.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          7. How Long Do We Keep Your Data?
        </h2>
        <p className="mb-6">
          We retain personal data only for as long as necessary to provide our
          services, meet legal obligations, or resolve disputes. Once data is no
          longer required, it is securely deleted or anonymized.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          8. How Do We Protect Your Information?
        </h2>
        <p className="mb-6">
          We employ advanced technical and organizational measures to protect
          your data. However, no online system is 100% secure. We encourage you
          to use secure networks and strong passwords to protect your account.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          9. Your Privacy Rights
        </h2>
        <p className="mb-6">
          Depending on your location, you may have the right to access, correct,
          or delete your personal data, and withdraw consent for processing.
          Please contact us at{" "}
          <a
            href="mailto:Nikunjjaiswal9294@gmail.com"
            className="text-[#eb4c60] font-medium"
          >
            Nikunjjaiswal9294@gmail.com
          </a>{" "}
          to exercise your rights.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          10. Do-Not-Track Features
        </h2>
        <p className="mb-6">
          We currently do not respond to browser-based "Do Not Track" signals,
          as no industry standard has been established. If a new standard
          emerges, we will update this policy accordingly.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          11. Policy Updates
        </h2>
        <p className="mb-6">
          We may revise this Privacy Policy from time to time. Updates will be
          posted on this page, and the “Last Updated” date will be modified. We
          encourage you to review this policy regularly.
        </p>

        <h2 className="text-2xl font-semibold text-[#eb4c60] mb-4">
          12. Contact Information
        </h2>
        <p className="mb-2">If you have any questions, please reach out to us:</p>
        <ul className="pl-6 list-disc">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:Nikunjjaiswal9294@gmail.com"
              className="text-[#eb4c60]"
            >
              Nikunjjaiswal9294@gmail.com
            </a>
          </li>
          <li>
            <strong>Address:</strong> Roomji, Chauri Chaura, Mundera Bazar,
            Gorakhpur, Uttar Pradesh 273201, India
          </li>
        </ul>

        <p className="mt-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Roomji. All rights reserved.
        </p>
      </div>
    </div>
  );
}
