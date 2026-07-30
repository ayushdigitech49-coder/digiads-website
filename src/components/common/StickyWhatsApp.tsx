import React from 'react';
import { theme } from '../../config/theme';

export const StickyWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${theme.branding.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Sumit%20DigiTech,%20I%20would%20like%20to%20discuss%20growing%20my%20business%20digital%20presence.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3.5 sm:bottom-6 right-3.5 sm:right-6 z-40 p-3 sm:p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group border border-emerald-400/40"
      aria-label="Chat on WhatsApp"
    >
      <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-800">
        Chat on WhatsApp
      </span>
      <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
        <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.12.553 4.192 1.603 6.012L.057 24l6.096-1.599A11.966 11.966 0 0012.03 24c6.637 0 12.031-5.394 12.031-12.031C24.061 5.394 18.668 0 12.031 0zm0 22.029c-1.805 0-3.576-.484-5.127-1.4l-.368-.219-3.805.998 1.016-3.71-.24-.381a9.99 9.99 0 01-1.528-5.286c0-5.529 4.5-10.029 10.029-10.029 5.529 0 10.029 4.5 10.029 10.029 0 5.529-4.5 10.029-10.029 10.029zm5.502-7.518c-.302-.151-1.787-.882-2.064-.983-.277-.101-.479-.151-.68.151-.202.302-.781.983-.957 1.185-.176.202-.353.226-.655.075-1.716-.857-2.846-1.533-3.985-3.486-.302-.518.302-.481.862-1.603.076-.151.038-.277-.019-.378-.057-.101-.504-1.21-.69-1.657-.182-.437-.367-.378-.504-.385l-.429-.008c-.151 0-.397.057-.605.277-.208.226-.794.776-.794 1.893 0 1.117.813 2.195.926 2.346.113.151 1.6 2.443 3.877 3.424.542.234.965.373 1.294.477.544.173 1.039.148 1.431.09.437-.065 1.787-.73 2.039-1.434.252-.705.252-1.309.176-1.434-.075-.126-.277-.202-.579-.353z" />
      </svg>
    </a>
  );
};
