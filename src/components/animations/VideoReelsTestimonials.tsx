import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { defaultReelsItems, type ReelConfigItem } from '../../pages/admin/AdminHeroPage';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';
import { adminService } from '../../services/admin.service';

export const VideoReelsTestimonials: React.FC = () => {
  const [activeReel, setActiveReel] = useState<ReelConfigItem | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [reelsData, setReelsData] = useState<ReelConfigItem[]>(() => {
    const saved = localStorage.getItem('sumit_reels_config');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return defaultReelsItems;
  });

  useEffect(() => {
    const syncReels = async () => {
      try {
        const res = await adminService.getReels();
        if (res && res.success && Array.isArray(res.reelsItems)) {
          setReelsData(res.reelsItems);
          localStorage.setItem('sumit_reels_config', JSON.stringify(res.reelsItems));
          return;
        }
      } catch (e) {
        console.warn('[VideoReelsTestimonials] Backend fetch failed:', e);
      }

      const saved = localStorage.getItem('sumit_reels_config');
      if (saved) {
        try { setReelsData(JSON.parse(saved)); return; } catch {}
      }
      setReelsData(defaultReelsItems);
    };

    syncReels();
    const unsubscribe = subscribeCmsUpdate(syncReels);
    return () => unsubscribe();
  }, []);

  // AUTO-SCROLL TIMER LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [reelsData]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] text-slate-900 relative overflow-hidden font-sans">
      
      {/* Soft Blue Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#1E5BC6]/05 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#1E5BC6] bg-white px-4 py-1.5 rounded-full border border-blue-200 inline-flex items-center space-x-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Strategy Reels & Growth Proof</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Watch Our Strategy & Growth Reels
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            Behind the scenes strategy snippets, client case study breakdowns, and high-impact reel proof.
          </p>
        </div>

        {/* CAROUSEL WRAPPER WITH MIDDLE FLOATING LEFT & RIGHT ARROWS */}
        <div className="relative group/carousel">
          
          {/* FLOATING LEFT ARROW */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#1352D0] text-slate-800 hover:text-white border border-slate-200 shadow-xl backdrop-blur-md transition-all flex items-center justify-center cursor-pointer group/btn active:scale-90"
            aria-label="Previous Reel"
          >
            <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
          </button>

          {/* FLOATING RIGHT ARROW */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#1352D0] text-slate-800 hover:text-white border border-slate-200 shadow-xl backdrop-blur-md transition-all flex items-center justify-center cursor-pointer group/btn active:scale-90"
            aria-label="Next Reel"
          >
            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          {/* AUTO-SCROLL TOUCH SLIDER */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 py-2 px-1 no-scrollbar scroll-smooth items-stretch"
          >
            {reelsData.map((reel) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, translateY: -6 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 w-[82vw] sm:w-[310px] snap-center aspect-[9/16] rounded-3xl bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.18)] border-2 border-slate-900 overflow-hidden relative group cursor-pointer flex flex-col justify-between"
                onClick={() => setActiveReel(reel)}
              >
                {/* HTML5 AutoPlay Looping Video Background */}
                <video
                  src={reel.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />

                {/* Top Bar: Brand Logo & Badge */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-slate-700">
                    {reel.badge}
                  </span>
                  
                  {/* Brand Watermark */}
                  <div className="flex items-center space-x-1 font-black text-xs tracking-tighter text-white bg-red-600/90 px-2.5 py-1 rounded-md shadow-md">
                    <span>{reel.logoBrand}</span>
                  </div>
                </div>

                {/* Center Play Button Overlay */}
                <div className="relative z-10 flex-1 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#E53935] text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 border border-white/40">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>

                {/* Bottom Overlay: Caption & Speaker */}
                <div className="relative z-10 p-5 space-y-2">
                  
                  {/* Animated Caption Bubble */}
                  <div className="bg-slate-900/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-lg text-center">
                    <span className="text-sm font-black text-white block tracking-tight">
                      {reel.caption}
                    </span>
                  </div>

                  {/* Speaker Info & Progress Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-white">{reel.speaker}</h4>
                      <span className="text-[10px] text-slate-300 font-semibold">{reel.role}</span>
                    </div>
                  </div>

                  {/* Reel Timeline Progress Bar */}
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E53935] h-full w-2/3 rounded-full animate-pulse" />
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* REEL FULLSCREEN POPUP MODAL */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 flex flex-col justify-between">
            
            {/* Modal Video with Audio */}
            <video
              src={activeReel.videoUrl}
              autoPlay
              controls
              loop
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top Modal Controls */}
            <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <span className="text-xs font-black text-white uppercase tracking-wider">{activeReel.logoBrand}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-black/60 rounded-full text-white cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveReel(null)}
                  className="px-3 py-1 bg-red-600 text-white text-xs font-black rounded-full cursor-pointer"
                >
                  Close X
                </button>
              </div>
            </div>

            {/* Bottom Modal Caption */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 to-transparent space-y-2">
              <h3 className="text-base font-black text-white">{activeReel.caption}</h3>
              <p className="text-xs text-slate-300">{activeReel.speaker} • {activeReel.company}</p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
