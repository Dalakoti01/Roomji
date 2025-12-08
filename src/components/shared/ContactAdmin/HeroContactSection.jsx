import React from 'react';
import ContactSection from './ContactSection';
import FAQSection from './FAQSection';

export function HeroContactSection() {
  return <div className="w-full min-h-screen bg-white">
      <ContactSection />
      <FAQSection />
    </div>;
}