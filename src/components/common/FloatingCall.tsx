import React from 'react';
import { PhoneCall } from 'lucide-react';
import { theme } from '../../config/theme';

export const FloatingCall: React.FC = () => {
  return (
    <a
      href={`tel:${theme.branding.contact.phone}`}
      className="fixed bottom-20 sm:bottom-24 right-3.5 sm:right-6 z-40 p-3 sm:p-3.5 bg-[#1E5BC6] hover:bg-blue-700 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group border border-blue-400/40"
      aria-label="Call Sumit DigiTech"
    >
      <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-800">
        Call Now: {theme.branding.contact.phone}
      </span>
      <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
    </a>
  );
};
