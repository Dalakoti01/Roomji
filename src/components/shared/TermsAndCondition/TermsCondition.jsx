"use client";

import React from "react";

export default function TermsAndConditions() {
  const sections = [
    {
      id: "overview",
      title: "1. Overview",
      body: `Roomji is an intermediary platform that connects individuals or businesses who wish to list or sell property or services with individuals who wish to find, rent, or buy such properties or services. Roomji does not own, rent, or sell any property or service listed on the website. All deals and payments between users happen independently and offline.`,
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      body: `By accessing or using Roomji, you confirm that you are at least 18 years old, legally capable of entering into binding agreements, and using the website in compliance with applicable laws in India.`,
    },
    {
      id: "account",
      title: "3. Account Registration",
      body: `To post listings or connect with other users, you may need to create an account. You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your login credentials. Roomji is not responsible for unauthorized access to your account resulting from your actions or negligence.`,
    },
    {
      id: "listings",
      title: "4. Listings and Subscriptions",
      body: `First post is free. From the second listing onward, users must purchase a paid subscription to continue posting properties or services. Subscription fees are non-refundable, as all payments are processed offline. Roomji reserves the right to change pricing or introduce new subscription plans at any time, with prior notice. Users agree that all listing content — including text, images, or videos — must be accurate and lawful.`,
    },
    {
      id: "responsibilities",
      title: "5. User Responsibilities",
      body: `You are solely responsible for verifying any property, service, or person before making a deal. All communication and transactions occur directly between users, outside Roomji. You will not misuse the platform for false, misleading, or illegal purposes. You will not post content that is obscene, defamatory, abusive, or infringes on any third-party rights.`,
    },
    {
      id: "disclaimer",
      title: "6. Roomji’s Role and Disclaimer",
      body: `Roomji is only a connecting platform. It does not guarantee, endorse, or verify any listing, property, or user. Roomji will not be liable for fraud, misrepresentation, or disputes between users, any loss, damage, or injury caused through listings or user interactions, or delays, inaccuracies, or interruptions in the website’s availability.`,
    },
    {
      id: "moderation",
      title: "7. Moderation and Content Control",
      body: `Roomji allows users to upload photos, videos, and descriptions. While Roomji does not actively moderate all content, it may remove or hide listings that are found to be false, misleading, or inappropriate. Roomji may also, at its discretion, restrict, suspend, or terminate user access in the future if misconduct or abuse is detected.`,
    },
    {
      id: "reviews",
      title: "8. Reviews and Ratings",
      body: `Users may post reviews or ratings based on their experiences. All reviews must be honest, respectful, and factual. Roomji may remove reviews that are abusive, fake, or violate others’ rights.`,
    },
    {
      id: "payments",
      title: "9. Payments and Refunds",
      body: `Subscription payments are handled offline, and once paid, are non-refundable. Roomji does not process or hold any rent, deposit, or service transaction between users. Users must handle refunds or cancellations directly with each other for any deal made outside Roomji.`,
    },
    {
      id: "support",
      title: "10. Support and Complaints",
      body: `Users can reach Roomji for feedback or issues via email: nikunjjaiswal9294@gmail.com or through the Feedback Form available on the website. Roomji will respond to user concerns on a best-effort basis, but it does not guarantee dispute resolution between users.`,
    },
    {
      id: "ip",
      title: "11. Intellectual Property",
      body: `All website content, including logos, text, images, and code, is the intellectual property of Roomji. Users may not copy, distribute, or modify Roomji’s content without written consent.`,
    },
    {
      id: "liability",
      title: "12. Limitation of Liability",
      body: `To the fullest extent permitted by law, Roomji and its team will not be responsible for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform, user-submitted content, miscommunication or fraud between users, or any loss of data, profit, or goodwill.`,
    },
    {
      id: "termination",
      title: "13. Termination of Use",
      body: `Roomji reserves the right, in the future, to suspend or terminate accounts found violating its terms, posting false information, or misusing the platform.`,
    },
    {
      id: "law",
      title: "14. Governing Law",
      body: `These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in India.`,
    },
    {
      id: "updates",
      title: "15. Updates to Terms",
      body: `Roomji may update these Terms periodically. Continued use of the platform after changes means you accept the revised Terms.`,
    },
    {
      id: "contact",
      title: "16. Contact",
      body: `For any queries or feedback, please reach out at: nikunjjaiswal9294@gmail.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b sticky top-15 z-30">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#eb4c60]">⚖ Roomji Terms and Conditions</h1>
            <p className="text-sm text-gray-500">Effective Date: November 10, 2025 • Last Updated: November 10, 2025</p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-[#eb4c60] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition"
          >
            Back to Top
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-48 self-start">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-sm mb-3">Quick Navigation</h2>
            <nav className="space-y-2 text-sm">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-gray-600 hover:text-[#eb4c60] transition"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <section className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#eb4c60] mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="text-center py-6 border-t mt-10 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Roomji. All Rights Reserved.</p>
        <p>
          Contact us at <a href="mailto:nikunjjaiswal9294@gmail.com" className="text-[#eb4c60]">nikunjjaiswal9294@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}
