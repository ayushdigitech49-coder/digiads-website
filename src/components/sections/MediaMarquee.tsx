import React, { useState, useEffect } from 'react';
import { Sparkles, Award } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export interface MediaPartnerItem {
  id: string;
  name: string;
  badge: string;
  badgeBg?: string;
  imageUrl?: string;
  visible?: boolean;
}

const defaultMediaPartnersList: MediaPartnerItem[] = [
  { id: 'med_1', name: 'Google News', badge: 'DIGITAL PRESS', badgeBg: 'bg-blue-100 text-[#1352D0]', imageUrl: 'https://www.sumitdigitech.com/uploads/media/6745f4120848456cd26710f4876fb54b.jpg', visible: true },
  { id: 'med_2', name: 'Dainik Jagran', badge: 'LEADING DAILY', badgeBg: 'bg-amber-100 text-amber-900', imageUrl: 'https://www.sumitdigitech.com/uploads/media/16e60319fa0191ef3f5ff9cd77f24738.jpg', visible: true },
  { id: 'med_3', name: 'Zee News', badge: 'NATIONAL NEWS', badgeBg: 'bg-[#061329] text-[#F4B400]', imageUrl: 'https://www.sumitdigitech.com/uploads/media/e937e78addccae2fce55c8e975ec633f.jpg', visible: true },
  { id: 'med_4', name: 'Dainik Bhaskar', badge: 'PRINT MEDIA', badgeBg: 'bg-[#F4B400]/20 text-slate-900', imageUrl: 'https://www.sumitdigitech.com/uploads/media/ea70f76e124f9af626097daf802ca521.jpg', visible: true },
  { id: 'med_5', name: 'Rajasthan Patrika', badge: 'REGIONAL NEWS', badgeBg: 'bg-blue-100 text-[#1352D0]', imageUrl: 'https://www.sumitdigitech.com/uploads/media/d927c73b6526f9d3b9e7c715d534e7b5.jpg', visible: true },
  { id: 'med_6', name: 'Mid Day', badge: 'BUSINESS PRESS', badgeBg: 'bg-red-100 text-red-700', imageUrl: 'https://www.sumitdigitech.com/uploads/media/0ee3433046b3507844c3548fe4c54f3c.jpg', visible: true },
  { id: 'med_7', name: 'News Nation', badge: 'TV COVERAGE', badgeBg: 'bg-slate-100 text-slate-800', imageUrl: 'https://www.sumitdigitech.com/uploads/media/44ea159d3b7740bef9f297fb9eb252a8.jpg', visible: true },
];

export const MediaMarquee: React.FC = () => {
  const [items, setItems] = useState<MediaPartnerItem[]>(defaultMediaPartnersList);

  const fetchMedia = async () => {
    try {
      const res = await adminService.getMediaPartners();
      if (res && res.success && Array.isArray(res.mediaPartners) && res.mediaPartners.length > 0) {
        setItems(res.mediaPartners.filter((it: any) => it.visible !== false));
      } else {
        const saved = localStorage.getItem('sumit_media_partners_cms');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setItems(parsed.filter((it: any) => it.visible !== false));
          } catch {}
        }
      }
    } catch {
      // Fallback local list
    }
  };

  useEffect(() => {
    fetchMedia();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'media' || type === 'media_partners' || type === 'all') {
        fetchMedia();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-12 sm:py-14 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] text-slate-900 relative overflow-hidden border-b border-blue-200/70 shadow-xs">
      
      {/* Subtle Light Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-36 bg-[#1352D0]/8 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 mb-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-blue-200 text-[#1352D0] text-xs font-black uppercase tracking-widest shadow-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>Press & Recognition</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          As Featured In Leading Media & News Outlets
        </h2>
      </div>

      {/* INFINITE BOLDER PROMINENT MARQUEE SLIDER */}
      <div className="relative w-full overflow-hidden flex select-none">
        
        {/* Left & Right Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#F8FBFF] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#F2F7FF] to-transparent z-10 pointer-events-none" />

        <div className="flex space-x-6 animate-marquee whitespace-nowrap py-3 shrink-0">
          {[...items, ...items, ...items].map((partner, index) => (
            <div
              key={`${partner.id || partner.name}-${index}`}
              className="flex items-center space-x-4 px-6 py-4 rounded-3xl bg-white border-2 border-blue-200/90 shadow-md hover:shadow-xl hover:border-[#1352D0] transition-all hover:scale-105 cursor-pointer backdrop-blur-md group shrink-0"
            >
              {partner.imageUrl ? (
                <img
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="w-12 h-12 rounded-2xl object-contain shrink-0 group-hover:scale-110 transition-transform shadow-xs p-1 bg-slate-50 border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1352D0] font-black text-sm shadow-xs group-hover:scale-110 transition-transform shrink-0">
                  <Award className="w-6 h-6 text-[#1352D0]" />
                </div>
              )}
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-[#1352D0] transition-colors leading-snug">
                  {partner.name}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg inline-block shadow-2xs ${partner.badgeBg || 'bg-blue-50 text-blue-700'}`}>
                  {partner.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
