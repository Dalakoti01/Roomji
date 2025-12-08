"use client";
import React, { useState } from "react";
import {
  HelpCircle,
  LifeBuoy,
  CreditCard,
  ShieldCheck,
  Users,
  Smartphone,
  BookOpen,
  Settings,
} from "lucide-react";

const FAQSection = () => {
 const faqs = [
  {
    question: "Is using The Doctors app free for patients?",
    answer:
      "Yes, booking an appointment on The Doctors app is completely free for patients. You only pay a ₹100 advance, which is adjusted in your final consultation fee.",
    icon: HelpCircle,
  },
  {
    question: "How much commission do doctors pay?",
    answer:
      "Doctors are charged a small 2.5% commission per appointment booked through The Doctors app. This helps us keep the platform running smoothly while offering free access to patients.",
    icon: LifeBuoy,
  },
  {
    question: "How does payment work for consultations?",
    answer:
      "Patients pay ₹100 as an advance at the time of booking. The remaining consultation fee is paid directly after the appointment, either online or offline depending on the doctor’s preference.",
    icon: CreditCard,
  },
  {
    question: "Is my personal data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and follow strict privacy policies to ensure your health records and payment details remain safe.",
    icon: ShieldCheck,
  },
  {
    question: "Can doctors manage their schedules?",
    answer:
      "Yes, doctors can easily set availability, update schedules, and manage appointments directly through The Doctors app dashboard.",
    icon: Users,
  },
 {
  question: "Do you have a mobile app?",
  answer:
    "No. The Doctors app doesn’t have a native iOS or Android app yet, but our mobile-friendly website works smoothly on any smartphone browser. Native apps are planned for the future.",
  icon: Smartphone,
}

,
  {
    question: "How can I get help if I face issues?",
    answer:
      "Our support team is available 24/7 via chat and email to help patients and doctors with bookings, payments, or any technical issues.",
    icon: BookOpen,
  },
  {
    question: "Can doctors customize their profiles?",
    answer:
      "Yes, doctors can update their profiles with qualifications, specialties, consultation fees, and more to attract the right patients.",
    icon: Settings,
  },
];

  const [showAll, setShowAll] = useState(false);

  // Decide which FAQs to display
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 6);

  return (
    <div className="w-full mt-10 flex p-4 pb-7 flex-col bg-white justify-center items-center gap-6 px-4 sm:px-6 lg:px-10">
      {/* Title */}
      <h1 className="p-4 text-2xl font-bold text-center">
        Frequently Asked Questions
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 gap-4 w-full max-w-5xl">
        {displayedFaqs.map((faq, idx) => {
          // Faded only for 5th & 6th when not showing all
          const faded = !showAll && (idx === 4 || idx === 5);
          return (
            <div
              key={idx}
              className={`flex gap-3 p-4 hover:shadow-md transition rounded-lg ${
                faded ? "opacity-50" : "opacity-100"
              }`}
            >
              <faq.icon className="text-blue-500 w-6 h-6 shrink-0 mt-1" />
              <div className="flex flex-col text-left">
                <h2 className="font-semibold">{faq.question}</h2>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-4 cursor-pointer px-6 py-2 bg-white text-black border-[#eb4c60] border-2 rounded-lg hover:bg-[#eb4c60] hover:text-white transition"
      >
        {showAll ? "View Less" : "View More"}
      </button>
    </div>
  );
};

export default FAQSection;
