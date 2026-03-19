import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

// Replace with your WhatsApp number (country code + number, no + or spaces)
// e.g. 919876543210 for India
const WHATSAPP_NUMBER = '919039299946';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const FixedActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col gap-2 sm:gap-3"
      aria-label="Quick actions"
    >
      {/* WhatsApp - Chat / Open app */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 hover:bg-[#20BD5A] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} strokeWidth={2} />
      </a>

      {/* Scroll to top - visible after scroll */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#985991] text-white shadow-lg shadow-[#985991]/40 hover:bg-[#7A4774] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#985991] focus:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default FixedActions;
