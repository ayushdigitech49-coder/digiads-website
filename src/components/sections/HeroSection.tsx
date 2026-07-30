import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Star, ShieldCheck, CheckCircle2, Award, TrendingUp, BarChart3 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { defaultHeroConfig, type HeroConfig } from '../../pages/admin/AdminHeroPage';
import { adminService } from '../../services/admin.service';

export const HeroSection: React.FC = () => {
  const { openAuditModal, openConsultationModal } = useModal();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const sanitizeHeroConfig = (cfg: HeroConfig): HeroConfig => {
    const clean = { ...cfg };
    clean.badgeText = '';
    const h1 = (clean.headlineHighlightLine1 || '').trim();
    const h2 = (clean.headlineHighlightLine2 || '').trim();
    if (h1 && clean.headlineLine1) {
      clean.headlineLine1 = clean.headlineLine1.replace(new RegExp(h1, 'gi'), '').trim();
    }
    if (h2 && clean.headlineLine2) {
      clean.headlineLine2 = clean.headlineLine2.replace(new RegExp(h2, 'gi'), '').trim();
    }
    return clean;
  };

  const [config, setConfig] = useState<HeroConfig>(() => {
    const saved = localStorage.getItem('sumit_hero_config');
    if (saved) { try { return sanitizeHeroConfig(JSON.parse(saved)); } catch {} }
    return defaultHeroConfig;
  });

  useEffect(() => {
    const syncConfig = async () => {
      try {
        const res = await adminService.getHeroConfig();
        if (res && res.success && res.heroConfig && Object.keys(res.heroConfig).length > 0) {
          const cleanCfg = sanitizeHeroConfig(res.heroConfig);
          setConfig(cleanCfg);
          localStorage.setItem('sumit_hero_config', JSON.stringify(cleanCfg));
          return;
        }
      } catch {}

      const saved = localStorage.getItem('sumit_hero_config');
      if (saved) {
        try {
          const parsed = sanitizeHeroConfig(JSON.parse(saved));
          setConfig(parsed);
          localStorage.setItem('sumit_hero_config', JSON.stringify(parsed));
          return;
        } catch {}
      }
      setConfig(defaultHeroConfig);
    };

    syncConfig();
    window.addEventListener('storage', syncConfig);
    window.addEventListener('hero_updated', syncConfig);
    return () => {
      window.removeEventListener('storage', syncConfig);
      window.removeEventListener('hero_updated', syncConfig);
    };
  }, []);

  const getCleanLine = (text: string, highlight: string) => {
    if (!text) return '';
    if (!highlight) return text.trim();
    const regex = new RegExp(highlight.trim(), 'gi');
    return text.replace(regex, '').trim();
  };

  const line1Text = getCleanLine(config.headlineLine1 || 'Scale Revenue with', config.headlineHighlightLine1 || 'AI Search');
  const line2Text = getCleanLine(config.headlineLine2 || '& Performance Ads That', config.headlineHighlightLine2 || 'Convert');

  return (
    <section className="relative min-h-[92vh] bg-[#010819] text-white overflow-hidden flex items-center justify-center pt-36 sm:pt-44 pb-20 font-sans">
      
      {/* 1. SUBTLE HIGH-TECH AMBIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Video Mode */}
        {config.bgMode === 'video' && config.videoStoryUrl && (
          <video
            src={config.videoStoryUrl}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08] filter blur-[1px] scale-105 pointer-events-none"
          />
        )}

        {/* Static Image Mode */}
        {config.bgMode === 'image' && config.bgImageUrl && (
          <img
            src={config.bgImageUrl}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.12] scale-105 pointer-events-none"
          />
        )}

        {/* Dark Vignette & Color Overlay */}
        <div className="absolute inset-0 bg-[rgba(1,8,25,0.82)] pointer-events-none" />

        {/* Floating High-Tech Analytics Stat Badges */}
        {(config.showFloatingCards ?? true) && config.floatingProofCards && config.floatingProofCards.length > 0 ? (
          <>
            {config.floatingProofCards[0] && (
              <div className="absolute top-36 left-[6%] hidden xl:block opacity-75 backdrop-blur-md bg-slate-900/80 p-3 rounded-2xl border border-blue-500/30 text-left space-y-1 shadow-2xl">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{config.floatingProofCards[0].title}</span>
                </div>
                <span className="text-lg font-black text-emerald-400 block">{config.floatingProofCards[0].value}</span>
              </div>
            )}
            {config.floatingProofCards[1] && (
              <div className="absolute top-36 right-[6%] hidden xl:block opacity-75 backdrop-blur-md bg-slate-900/80 p-3 rounded-2xl border border-red-500/30 text-left space-y-1 shadow-2xl">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                  <BarChart3 className="w-3.5 h-3.5 text-[#D91212]" />
                  <span>{config.floatingProofCards[1].title}</span>
                </div>
                <span className="text-lg font-black text-white block">{config.floatingProofCards[1].value}</span>
              </div>
            )}
          </>
        ) : (config.showFloatingCards ?? true) && (
          <>
            <div className="absolute top-36 left-[6%] hidden xl:block opacity-45 backdrop-blur-md bg-slate-900/80 p-3 rounded-2xl border border-blue-500/30 text-left space-y-1 shadow-2xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Organic Traffic Surge</span>
              </div>
              <span className="text-lg font-black text-emerald-400 block">+340% ROAS</span>
            </div>

            <div className="absolute top-36 right-[6%] hidden xl:block opacity-45 backdrop-blur-md bg-slate-900/80 p-3 rounded-2xl border border-red-500/30 text-left space-y-1 shadow-2xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <BarChart3 className="w-3.5 h-3.5 text-[#D91212]" />
                <span>Page #1 Rankings</span>
              </div>
              <span className="text-lg font-black text-white block">12,450+ Keywords</span>
            </div>
          </>
        )}

        {/* Radiant Color Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.28),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(217,18,18,0.2),transparent_70%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
        
        {/* Dynamic Headlines */}
        <div className="max-w-6xl mx-auto overflow-hidden px-1">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`${config.titleFontSize || 'text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl'} font-black tracking-tight leading-snug sm:leading-tight text-white font-sans space-y-1 sm:space-y-2 max-w-full`}
          >
            <div className="block whitespace-normal break-words">
              {line1Text}{' '}
              <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)] inline-block">
                {config.headlineHighlightLine1 || 'AI Search'}
              </span>
            </div>
            <div className="block whitespace-normal break-words">
              {line2Text}{' '}
              <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)] inline-block">
                {config.headlineHighlightLine2 || 'Convert'}
              </span>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-slate-200 ${config.subtitleFontSize || 'text-xs sm:text-lg lg:text-xl'} font-normal max-w-3xl mx-auto leading-relaxed pt-3 sm:pt-5 font-sans px-2`}
          >
            {config.subtitle}
          </motion.p>
        </div>

        {/* Dynamic CTAs Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-lg mx-auto sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-2"
        >
          {/* MOBILE ROW 1: 2 BUTTONS SIDE BY SIDE */}
          <div className="grid grid-cols-2 gap-2.5 w-full sm:flex sm:w-auto sm:items-center sm:gap-5">
            <button
              onClick={() => {
                if (config.primaryCtaUrl) window.location.href = config.primaryCtaUrl;
                else openAuditModal();
              }}
              className={`w-full sm:w-auto px-3 sm:px-8 py-3.5 sm:py-4 bg-[#1352D0] hover:bg-blue-600 active:bg-blue-700 text-white font-extrabold ${config.ctaFontSize || 'text-xs sm:text-base'} rounded-full border border-[#1352D0] shadow-xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5 sm:space-x-2.5 font-sans group cursor-pointer`}
            >
              <span className="truncate">{config.primaryCta}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={() => {
                if (config.secondaryCtaUrl) window.location.href = config.secondaryCtaUrl;
                else openConsultationModal('Hero Growth Consultation');
              }}
              className={`w-full sm:w-auto px-3 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-[#1352D0] active:bg-blue-700 text-white font-extrabold ${config.ctaFontSize || 'text-xs sm:text-base'} rounded-full border border-white/20 hover:border-[#1352D0] backdrop-blur-md shadow-xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5 sm:space-x-2.5 font-sans group cursor-pointer`}
            >
              <span className="truncate">{config.secondaryCta}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>

          {/* MOBILE ROW 2: 1 CENTERED BUTTON BELOW */}
          {(config.showVideoButton ?? true) && (
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-[#1352D0] active:bg-blue-700 text-white font-extrabold text-xs sm:text-base rounded-full border border-white/20 hover:border-[#1352D0] backdrop-blur-md shadow-xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 font-sans group cursor-pointer"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 group-hover:bg-white text-[#1352D0] flex items-center justify-center transition-colors shrink-0">
                <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ml-0.5 text-white group-hover:text-[#1352D0]" />
              </div>
              <span>Watch Agency Story</span>
            </button>
          )}
        </motion.div>

        {/* Dynamic Bottom Trust Metrics Strip */}
        {(config.showRatingSection ?? true) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 border-t border-slate-800/80 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-slate-300 font-sans"
          >
            <div className="flex items-center space-x-2">
              <div className="flex text-[#F4B400]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4B400]" />
                ))}
              </div>
              <span className="text-white font-black">{config.ratingScore}</span>
            </div>

            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#1352D0]" />
              <span>{config.activeBrands}</span>
            </div>

            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{config.activeSellers}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#D91212]" />
              <span>{config.uptimeSla}</span>
            </div>
          </motion.div>
        )}

      </div>

      {/* VIDEO PLAYER MODAL POPUP */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-black text-white uppercase tracking-wider">SUMIT DIGITECH AGENCY STORY</span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-3 py-1 bg-[#D91212] text-white text-xs font-black rounded-full cursor-pointer"
              >
                Close X
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <video
                src={config.videoStoryUrl}
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
