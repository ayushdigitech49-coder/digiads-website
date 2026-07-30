import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService, type AnnouncementBarData } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';
import { X } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const AnnouncementBar: React.FC = () => {
  const { openAuditModal } = useModal();
  const [config, setConfig] = useState<AnnouncementBarData>({
    id: 'announcement_01',
    bannerText: 'Free Audit for August',
    highlightText: 'Only 20 Slots Available',
    icon: '🔥',
    backgroundColor: '#1352D0',
    textColor: '#FFFFFF',
    isActive: true,
    priorityOrder: 1,
  });

  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('sumit_announcement_dismissed') === 'true';
  });

  useEffect(() => {
    const fetchAnnouncementBar = async () => {
      try {
        const res = await adminService.getAnnouncementBar();
        if (res && res.success && res.announcementBar) {
          setConfig(res.announcementBar);
          localStorage.setItem('sumit_announcement_bar', JSON.stringify(res.announcementBar));
          return;
        }
      } catch (err) {
        console.warn('[AnnouncementBar] Failed to fetch from backend:', err);
      }

      const saved = localStorage.getItem('sumit_announcement_bar');
      if (saved) {
        try { setConfig(JSON.parse(saved)); } catch {}
      }
    };

    fetchAnnouncementBar();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'announcement_bar' || type === 'all') {
        fetchAnnouncementBar();
      }
    });

    return () => unsubscribe();
  }, []);

  if (!config.isActive || dismissed) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem('sumit_announcement_dismissed', 'true');
    window.dispatchEvent(new CustomEvent('sumit_announcement_dismissed_event'));
  };

  // Repeat items for seamless continuous ticker line
  const tickerItems = [1, 2, 3, 4, 5, 6];

  return (
    <div
      style={{
        backgroundColor: config.backgroundColor || '#1352D0',
        color: config.textColor || '#FFFFFF',
      }}
      className="fixed top-0 left-0 right-0 z-50 h-8 sm:h-9 overflow-hidden flex items-center shadow-md font-sans text-xs sm:text-sm font-extrabold border-b border-black/10 select-none"
    >
      {/* CONTINUOUS MOVING TICKER LINE ("CHLTI HUI LINE") */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full cursor-pointer" onClick={openAuditModal}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            duration: 22,
          }}
          className="flex items-center space-x-8 sm:space-x-12 whitespace-nowrap shrink-0 pr-8"
        >
          {tickerItems.map((_, i) => (
            <div key={i} className="inline-flex items-center space-x-2 shrink-0">
              {config.icon && <span className="text-sm sm:text-base leading-none">{config.icon}</span>}
              <span className="tracking-tight">{config.bannerText}</span>
              {config.highlightText && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-current text-[10px] sm:text-xs font-black uppercase tracking-wider border border-white/30 backdrop-blur-xs">
                  {config.highlightText}
                </span>
              )}
              <span className="text-current/40 px-2">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* DISMISS BUTTON RIGHT SIDE */}
      <button
        onClick={handleDismiss}
        className="px-2 sm:px-3 h-full bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer text-current shrink-0 border-l border-white/20"
        title="Dismiss Announcement Ticker"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};
