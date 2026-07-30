import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { Search, TrendingUp, Code2, Share2, ShoppingBag, Store, Zap, Sparkles } from 'lucide-react';
import { defaultMarqueeItems, type MarqueeItem } from '../../pages/admin/AdminHeroPage';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export const LogoMarquee: React.FC = () => {
  const [brands, setBrands] = useState<MarqueeItem[]>(() => {
    const saved = localStorage.getItem('sumit_marquee_config');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return defaultMarqueeItems;
  });

  useEffect(() => {
    const syncMarquee = async () => {
      try {
        const res = await adminService.getMarqueeItems();
        if (res && res.success && Array.isArray(res.marqueeItems) && res.marqueeItems.length > 0) {
          setBrands(res.marqueeItems);
          localStorage.setItem('sumit_marquee_config', JSON.stringify(res.marqueeItems));
          return;
        }
      } catch {}

      const saved = localStorage.getItem('sumit_marquee_config');
      if (saved) { try { setBrands(JSON.parse(saved)); return; } catch {} }
      setBrands(defaultMarqueeItems);
    };

    syncMarquee();
    const unsubscribe = subscribeCmsUpdate(syncMarquee);
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 sm:py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] text-slate-900 overflow-hidden relative font-sans">
      
      {/* Edge Gradient Fades for Infinite Smooth Scroll */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#F8FBFF] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#F8FBFF] to-transparent z-10 pointer-events-none" />

      {/* Prominent Section Header Hierarchy */}
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center space-y-4 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          One Platform. <span className="text-[#1E5BC6]">Seven Growth</span> Engines.
        </h2>
        <p className="text-sm sm:text-base font-extrabold text-slate-600 max-w-2xl mx-auto">
          5 Merged Divisions <span className="text-[#1E5BC6]">•</span> 10+ Marketplace Integrations <span className="text-[#E53935]">•</span> 500+ Active Brands
        </p>
      </div>

      {/* Track 1: Smooth Continuous Left-to-Right */}
      <div className="flex w-max animate-marquee space-x-6 items-center">
        {[...brands, ...brands, ...brands].map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3.5 px-6 py-3.5 bg-white rounded-2xl border border-blue-100 shadow-[0_4px_20px_rgba(30,91,198,0.06)] hover:shadow-[0_8px_25px_rgba(30,91,198,0.12)] hover:border-[#1E5BC6] transition-all duration-300 group cursor-default shrink-0 hover:scale-105"
          >
            <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-[#1E5BC6]" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-[#1E5BC6] transition-colors">
                {brand.name}
              </span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase mt-0.5 w-max ${brand.badgeBg || 'bg-blue-100 text-[#1E5BC6]'}`}>
                {brand.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Track 2: Reverse Continuous Right-to-Left */}
      <div className="flex w-max animate-marquee-reverse space-x-6 items-center mt-5">
        {[...brands, ...brands, ...brands].reverse().map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3.5 px-6 py-3 bg-white/90 rounded-2xl border border-blue-100/90 shadow-[0_4px_16px_rgba(30,91,198,0.05)] hover:shadow-[0_8px_22px_rgba(229,57,53,0.12)] hover:border-[#E53935] transition-all duration-300 group cursor-default shrink-0 hover:scale-105"
          >
            <div className="p-1.5 bg-blue-50/60 rounded-xl border border-blue-100 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-[#E53935]" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-slate-800 text-xs tracking-tight group-hover:text-[#E53935] transition-colors">
                {brand.name}
              </span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase mt-0.5 w-max ${brand.badgeBg || 'bg-red-100 text-[#E53935]'}`}>
                {brand.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
