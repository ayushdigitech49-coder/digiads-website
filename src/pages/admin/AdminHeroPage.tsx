import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Save, Video, Star, Image, Plus, Trash2, CheckCircle2,
  Tv, Play, ShieldCheck, RefreshCw, Layout, Eye, EyeOff, Monitor,
  Smartphone, ExternalLink, ArrowRight, TrendingUp, BarChart3,
  Sliders, Layers, Zap, Palette, HelpCircle, Award, Check
} from 'lucide-react';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';
import { adminService } from '../../services/admin.service';

export interface FloatingProofCard {
  id: string;
  title: string;
  value: string;
  theme: 'emerald' | 'blue' | 'red' | 'amber';
  iconName: string;
}

export interface HeroConfig {
  badgeText: string;
  headlineLine1: string;
  headlineHighlightLine1: string;
  headlineLine2: string;
  headlineHighlightLine2: string;
  subtitle: string;
  primaryCta: string;
  primaryCtaUrl: string;
  primaryCtaNewTab: boolean;
  secondaryCta: string;
  secondaryCtaUrl: string;
  secondaryCtaNewTab: boolean;
  videoStoryUrl: string;
  videoThumbnailUrl: string;
  bgMode: 'grid' | 'gradient' | 'video' | 'image';
  bgImageUrl: string;
  ratingScore: string;
  activeBrands: string;
  activeSellers: string;
  uptimeSla: string;
  showRatingSection: boolean;
  showFloatingCards: boolean;
  showVideoButton: boolean;
  showBgAnimation: boolean;
  floatingProofCards: FloatingProofCard[];
  badgeFontSize?: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  ctaFontSize?: string;
}

export interface MarqueeItem {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
}

export interface ReelConfigItem {
  id: string;
  speaker: string;
  role: string;
  company: string;
  caption: string;
  badge: string;
  videoUrl: string;
  logoBrand: string;
}

export const defaultHeroConfig: HeroConfig = {
  badgeText: "",
  headlineLine1: "Scale Revenue with",
  headlineHighlightLine1: "AI Search",
  headlineLine2: "& Performance Ads That",
  headlineHighlightLine2: "Convert",
  subtitle: "Sumit DigiTech consolidates Jaipur's premier digital marketing & engineering squads into one high-converting revenue engine. We drive 10× organic sessions & predictable sales.",
  primaryCta: "Get Free Instant Audit",
  primaryCtaUrl: "/free-audit",
  primaryCtaNewTab: false,
  secondaryCta: "Book A Call",
  secondaryCtaUrl: "/contact",
  secondaryCtaNewTab: false,
  videoStoryUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-31748-large.mp4",
  videoThumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
  bgMode: "video",
  bgImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
  ratingScore: "4.9/5 Rating",
  activeBrands: "500+ Active Brands",
  activeSellers: "1000+ Active Sellers",
  uptimeSla: "99.8% Uptime SLA",
  showRatingSection: true,
  showFloatingCards: true,
  showVideoButton: true,
  showBgAnimation: true,
  badgeFontSize: "text-[10px] sm:text-xs",
  titleFontSize: "text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  subtitleFontSize: "text-xs sm:text-lg lg:text-xl",
  ctaFontSize: "text-xs sm:text-base",
  floatingProofCards: [
    { id: 'f1', title: 'Organic Traffic Surge', value: '+340% ROAS', theme: 'emerald', iconName: 'TrendingUp' },
    { id: 'f2', title: 'Page #1 Rankings', value: '12,450+ Keywords', theme: 'red', iconName: 'BarChart3' },
  ],
};

export const defaultMarqueeItems: MarqueeItem[] = [
  { id: 'm1', name: 'SEO Company Jaipur', badge: 'SEO DIVISION', badgeBg: 'bg-blue-100 text-[#1E5BC6]' },
  { id: 'm2', name: 'PerformanceMarketing4U', badge: 'ADS DIVISION', badgeBg: 'bg-red-100 text-[#E53935]' },
  { id: 'm3', name: 'Arvian Business Solutions', badge: 'WEB ENGINEERING', badgeBg: 'bg-slate-900 text-white' },
  { id: 'm4', name: 'Digimagnate', badge: 'SOCIAL MEDIA', badgeBg: 'bg-amber-100 text-amber-800' },
  { id: 'm5', name: 'Amazon Marketplace', badge: 'E-COMMERCE', badgeBg: 'bg-amber-100 text-amber-900' },
  { id: 'm6', name: 'Flipkart Assured', badge: 'PREFERRED PARTNER', badgeBg: 'bg-blue-100 text-blue-800' },
];

export const defaultReelsItems: ReelConfigItem[] = [
  { id: 'r1', speaker: 'Sumit Sharma', role: 'Founder & CEO', company: 'Sumit DigiTech', caption: 'Karna Padta Hai 🚀', badge: 'Growth Engine', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4', logoBrand: 'ARVIAN' },
  { id: 'r2', speaker: 'Rohan Mehta', role: 'Marketing Lead', company: 'PerformanceMarketing4U', caption: 'Message Bhej Sakte Hai 💬', badge: 'Meta & Google Ads', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-people-working-together-in-office-5151-large.mp4', logoBrand: 'SUMIT DIGITECH' },
  { id: 'r3', speaker: 'Ananya Verma', role: 'Web Engineer', company: 'Arvian Business Solutions', caption: 'Karna Hai! ✨', badge: 'Web Architecture', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-laptop-in-modern-office-42566-large.mp4', logoBrand: 'SEO COMPANY' },
];

export const AdminHeroPage: React.FC = () => {
  const location = useLocation();
  const [hero, setHero] = useState<HeroConfig>(() => {
    const saved = localStorage.getItem('sumit_hero_config');
    if (saved) { try { return { ...defaultHeroConfig, ...JSON.parse(saved) }; } catch {} }
    return defaultHeroConfig;
  });

  const [marquee, setMarquee] = useState<MarqueeItem[]>(() => {
    const saved = localStorage.getItem('sumit_marquee_config');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return defaultMarqueeItems;
  });

  const [reels, setReels] = useState<ReelConfigItem[]>(() => {
    const saved = localStorage.getItem('sumit_reels_config');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return defaultReelsItems;
  });

  const [activeTab, setActiveTab] = useState<'content' | 'metrics' | 'background' | 'ctas' | 'marquee' | 'reels'>('content');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['content', 'metrics', 'background', 'ctas', 'marquee', 'reels'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  // Form states for adding items
  const [newBrand, setNewBrand] = useState({ name: '', badge: 'GROWTH PARTNER' });
  const [newReel, setNewReel] = useState({ speaker: '', role: '', company: '', caption: '', badge: 'Strategy', videoUrl: '', logoBrand: 'SUMIT DIGI' });
  const [newProofCard, setNewProofCard] = useState<Partial<FloatingProofCard>>({ title: '', value: '', theme: 'emerald', iconName: 'TrendingUp' });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [heroRes, marqueeRes, reelsRes] = await Promise.all([
          adminService.getHeroConfig(),
          adminService.getMarqueeItems(),
          adminService.getReels(),
        ]);
        if (heroRes && heroRes.success && heroRes.heroConfig && Object.keys(heroRes.heroConfig).length > 0) {
          const merged = { ...defaultHeroConfig, ...heroRes.heroConfig };
          setHero(merged);
          localStorage.setItem('sumit_hero_config', JSON.stringify(merged));
        }
        if (marqueeRes && marqueeRes.success && Array.isArray(marqueeRes.marqueeItems) && marqueeRes.marqueeItems.length > 0) {
          setMarquee(marqueeRes.marqueeItems);
          localStorage.setItem('sumit_marquee_config', JSON.stringify(marqueeRes.marqueeItems));
        }
        if (reelsRes && reelsRes.success && Array.isArray(reelsRes.reelsItems)) {
          setReels(reelsRes.reelsItems);
          localStorage.setItem('sumit_reels_config', JSON.stringify(reelsRes.reelsItems));
        }
      } catch (err) {
        console.warn('[AdminHeroPage] Could not fetch data from backend:', err);
      }
    };

    fetchAllData();
  }, []);

  const saveHeroConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    localStorage.setItem('sumit_hero_config', JSON.stringify(hero));
    try { await adminService.updateHeroConfig(hero); } catch (err) {
      console.warn('[AdminHeroPage] Backend update failed:', err);
    }
    notifyCmsUpdate('hero');
    setIsSaving(false);
    Swal.toast('Hero Banner settings updated successfully!', 'success');
  };

  const addMarqueeBrand = async () => {
    if (!newBrand.name) return;
    const updated = [...marquee, { id: `m-${Date.now()}`, name: newBrand.name, badge: newBrand.badge, badgeBg: 'bg-blue-100 text-[#1E5BC6]' }];
    setMarquee(updated);
    localStorage.setItem('sumit_marquee_config', JSON.stringify(updated));
    try { await adminService.updateMarqueeItems(updated); } catch {}
    notifyCmsUpdate('marquee');
    setNewBrand({ name: '', badge: 'GROWTH PARTNER' });
    Swal.toast(`Added ${newBrand.name} to Logo Marquee!`, 'success');
  };

  const removeMarqueeBrand = async (id: string, name: string) => {
    const updated = marquee.filter(m => m.id !== id);
    setMarquee(updated);
    localStorage.setItem('sumit_marquee_config', JSON.stringify(updated));
    try { await adminService.updateMarqueeItems(updated); } catch {}
    notifyCmsUpdate('marquee');
    Swal.toast(`Removed ${name}`, 'warning');
  };

  const addReel = async () => {
    if (!newReel.speaker || !newReel.caption) return;
    const updated = [...reels, {
      id: `r-${Date.now()}`,
      speaker: newReel.speaker,
      role: newReel.role || 'Client Manager',
      company: newReel.company || 'Sumit DigiTech',
      caption: newReel.caption,
      badge: newReel.badge,
      videoUrl: newReel.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
      logoBrand: newReel.logoBrand,
    }];
    setReels(updated);
    localStorage.setItem('sumit_reels_config', JSON.stringify(updated));
    try { await adminService.updateReels(updated); } catch {}
    notifyCmsUpdate('reels');
    setNewReel({ speaker: '', role: '', company: '', caption: '', badge: 'Strategy', videoUrl: '', logoBrand: 'SUMIT DIGI' });
    Swal.toast(`Added Video Reel by ${newReel.speaker}!`, 'success');
  };

  const removeReel = async (id: string, speaker: string) => {
    const confirm = await Swal.fire({
      title: `Delete Reel?`,
      text: `Are you sure you want to delete this video reel by ${speaker}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Reel',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
    });

    if (confirm.isConfirmed) {
      const updated = reels.filter(r => r.id !== id);
      setReels(updated);
      localStorage.setItem('sumit_reels_config', JSON.stringify(updated));
      try { await adminService.deleteReel(id); } catch {}
      notifyCmsUpdate('reels');
      Swal.toast(`Removed Reel by ${speaker}`, 'warning');
    }
  };

  const addProofCard = () => {
    if (!newProofCard.title || !newProofCard.value) return;
    const newCard: FloatingProofCard = {
      id: `f-${Date.now()}`,
      title: newProofCard.title,
      value: newProofCard.value,
      theme: newProofCard.theme || 'emerald',
      iconName: newProofCard.iconName || 'TrendingUp',
    };
    const updatedCards = [...(hero.floatingProofCards || []), newCard];
    const updatedHero = { ...hero, floatingProofCards: updatedCards };
    setHero(updatedHero);
    setNewProofCard({ title: '', value: '', theme: 'emerald', iconName: 'TrendingUp' });
  };

  const removeProofCard = (id: string) => {
    const updatedCards = (hero.floatingProofCards || []).filter(c => c.id !== id);
    setHero({ ...hero, floatingProofCards: updatedCards });
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans text-slate-900 pb-16">
      
      {/* 1. LARGE GRADIENT HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#040C1E] via-[#0D3BA1] to-[#1352D0] text-white p-6 sm:p-9 shadow-2xl border border-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Layout className="w-8 h-8 text-[#F4B400]" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-[#F4B400]" />
                <span>Homepage CMS Studio</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Hero, Logo & Video Settings</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1.5 max-w-2xl leading-relaxed">
                Enterprise-grade dynamic hero engine. Manage headlines, highlights, live previews, video story URLs, floating proof cards, and section visibility controls in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => saveHeroConfig()}
              disabled={isSaving}
              className="px-6 py-3.5 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Publishing...' : 'Publish Changes'}</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* CMS NAVIGATION TABS */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'content', label: 'Hero Content', icon: Layout },
            { id: 'metrics', label: 'Metrics & Proof', icon: BarChart3 },
            { id: 'background', label: 'Background & Layout', icon: Palette },
            { id: 'ctas', label: 'CTAs & Visibility', icon: Sliders },
            { id: 'marquee', label: 'Logo Marquee', icon: Image },
            { id: 'reels', label: 'Video Reels Studio', icon: Video },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#1352D0] shadow-lg scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SINGLE COLUMN FULL WIDTH LAYOUT FOR HERO CONTENT/METRICS/BG/CTAs */}
      {['content', 'metrics', 'background', 'ctas'].includes(activeTab) && (
        <div className="w-full space-y-6">
          
          {/* TAB: HERO CONTENT CONFIGURATION */}
          {activeTab === 'content' && (
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Hero Headlines & Copy</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Customize badge, dual-color headlines, and hero summary</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1352D0] font-black text-[10px] uppercase">Real-Time Sync</span>
              </div>

                <div className="space-y-5">
                  {/* Top Pill Badge Text */}
                  

                  {/* Headline Line 1 & Blue Highlight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Headline Line 1 Text</label>
                      <input
                        value={hero.headlineLine1}
                        onChange={e => setHero({ ...hero, headlineLine1: e.target.value })}
                        placeholder="e.g. Scale Revenue with"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#1352D0] mb-1.5">Highlight Text 1 (Blue Accent)</label>
                      <input
                        value={hero.headlineHighlightLine1}
                        onChange={e => setHero({ ...hero, headlineHighlightLine1: e.target.value })}
                        placeholder="e.g. AI Search"
                        className="w-full px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-[#1352D0] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Headline Line 2 & Red Highlight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Headline Line 2 Text</label>
                      <input
                        value={hero.headlineLine2}
                        onChange={e => setHero({ ...hero, headlineLine2: e.target.value })}
                        placeholder="e.g. & Performance Ads That"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#E53935] mb-1.5">Highlight Text 2 (Red Accent)</label>
                      <input
                        value={hero.headlineHighlightLine2}
                        onChange={e => setHero({ ...hero, headlineHighlightLine2: e.target.value })}
                        placeholder="e.g. Convert"
                        className="w-full px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-[#1352D0] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sub-Header Description */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Hero Sub-Header Description</label>
                    <textarea
                      rows={4}
                      value={hero.subtitle}
                      onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                      placeholder="Enter detailed 2-3 line value proposition..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-xs font-medium text-slate-900 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* FONT SIZE CONTROLS SECTION */}
                  <div className="pt-6 border-t border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-[#1352D0]" />
                        <span>Typography & Font Size Controls</span>
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">Custom Size Tweaks</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Badge Font Size */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Top Pill Badge Font Size</label>
                        <select
                          value={hero.badgeFontSize || 'text-[10px] sm:text-xs'}
                          onChange={e => setHero({ ...hero, badgeFontSize: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#1352D0]"
                        >
                          <option value="text-[10px] sm:text-xs">Compact (Default — 10px / 12px)</option>
                          <option value="text-xs sm:text-sm">Medium (12px / 14px)</option>
                          <option value="text-sm sm:text-base">Large (14px / 16px)</option>
                        </select>
                      </div>

                      {/* Title Font Size */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Main Headline Title Font Size</label>
                        <select
                          value={hero.titleFontSize || 'text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl'}
                          onChange={e => setHero({ ...hero, titleFontSize: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#1352D0]"
                        >
                          <option value="text-xl sm:text-3xl lg:text-4xl">Compact (36px / 48px)</option>
                          <option value="text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Default Balanced (48px / 60px)</option>
                          <option value="text-3xl sm:text-5xl lg:text-7xl">Large Hero (60px / 72px)</option>
                          <option value="text-4xl sm:text-6xl lg:text-8xl">Extra Massive (72px / 96px)</option>
                        </select>
                      </div>

                      {/* Subtitle Font Size */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle Description Font Size</label>
                        <select
                          value={hero.subtitleFontSize || 'text-xs sm:text-lg lg:text-xl'}
                          onChange={e => setHero({ ...hero, subtitleFontSize: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#1352D0]"
                        >
                          <option value="text-xs sm:text-sm lg:text-base">Compact (14px / 16px)</option>
                          <option value="text-xs sm:text-lg lg:text-xl">Default Balanced (18px / 20px)</option>
                          <option value="text-sm sm:text-xl lg:text-2xl">Large Highlight (20px / 24px)</option>
                        </select>
                      </div>

                      {/* CTA Font Size */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">CTA Buttons Font Size</label>
                        <select
                          value={hero.ctaFontSize || 'text-xs sm:text-base'}
                          onChange={e => setHero({ ...hero, ctaFontSize: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#1352D0]"
                        >
                          <option value="text-xs sm:text-sm">Compact (12px / 14px)</option>
                          <option value="text-xs sm:text-base">Default Medium (14px / 16px)</option>
                          <option value="text-sm sm:text-lg">Large Bold (16px / 18px)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: METRICS & FLOATING PROOF CARDS */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                
                {/* 1. HERO METRICS MANAGER */}
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Hero Metrics Manager</h2>
                      <p className="text-xs text-slate-500 font-medium">Editable trust proof badges displayed on the bottom bar</p>
                    </div>
                    <Award className="w-5 h-5 text-[#F4B400]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Rating Metric</label>
                      <input value={hero.ratingScore} onChange={e => setHero({ ...hero, ratingScore: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Active Brands Metric</label>
                      <input value={hero.activeBrands} onChange={e => setHero({ ...hero, activeBrands: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Active Sellers Metric</label>
                      <input value={hero.activeSellers} onChange={e => setHero({ ...hero, activeSellers: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">SLA Uptime Metric</label>
                      <input value={hero.uptimeSla} onChange={e => setHero({ ...hero, uptimeSla: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* 2. FLOATING PROOF CARDS MANAGER */}
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Floating Proof Cards</h2>
                      <p className="text-xs text-slate-500 font-medium">Add floating statistical badges that hover beside the hero headline</p>
                    </div>
                  </div>

                  {/* Add Proof Card Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Add New Floating Card</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={newProofCard.title || ''} onChange={e => setNewProofCard({ ...newProofCard, title: e.target.value })} placeholder="Title (e.g. Organic Traffic)" className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none" />
                      <input value={newProofCard.value || ''} onChange={e => setNewProofCard({ ...newProofCard, value: e.target.value })} placeholder="Value (e.g. +340% ROAS)" className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-600">Theme:</span>
                        {(['emerald', 'blue', 'red', 'amber'] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewProofCard({ ...newProofCard, theme: t })}
                            className={`w-6 h-6 rounded-full border-2 capitalize text-[9px] font-black cursor-pointer ${
                              t === 'emerald' ? 'bg-emerald-500 border-emerald-600' :
                              t === 'blue' ? 'bg-blue-500 border-blue-600' :
                              t === 'red' ? 'bg-red-500 border-red-600' : 'bg-amber-500 border-amber-600'
                            } ${newProofCard.theme === t ? 'scale-125 ring-2 ring-slate-900' : 'opacity-70'}`}
                          />
                        ))}
                      </div>
                      <button type="button" onClick={addProofCard} className="px-4 py-2 bg-[#1352D0] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5">
                        <Plus className="w-3.5 h-3.5" /><span>Add Card</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Floating Proof Cards */}
                  <div className="space-y-3">
                    {(hero.floatingProofCards || []).map(card => (
                      <div key={card.id} className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-xl text-white font-black text-xs ${
                            card.theme === 'emerald' ? 'bg-emerald-600' :
                            card.theme === 'red' ? 'bg-red-600' :
                            card.theme === 'blue' ? 'bg-blue-600' : 'bg-amber-600'
                          }`}>
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-300">{card.title}</div>
                            <div className="text-sm font-black text-white">{card.value}</div>
                          </div>
                        </div>
                        <button onClick={() => removeProofCard(card.id)} className="p-2 text-slate-400 hover:text-red-400 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: HERO BACKGROUND SETTINGS */}
            {activeTab === 'background' && (
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Hero Background Mode</h2>
                    <p className="text-xs text-slate-500 font-medium">Select between Grid Mesh, Dynamic Gradient, MP4 Video, or Custom Image</p>
                  </div>
                  <Palette className="w-5 h-5 text-[#1352D0]" />
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'video', label: 'Video BG', icon: Video },
                    { id: 'grid', label: 'Grid Mesh', icon: Layout },
                    { id: 'gradient', label: 'Gradient', icon: Palette },
                    { id: 'image', label: 'Static Image', icon: Image },
                  ].map(m => {
                    const Icon = m.icon;
                    const selected = hero.bgMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setHero({ ...hero, bgMode: m.id as any })}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                          selected
                            ? 'bg-blue-50 border-[#1352D0] text-[#1352D0] font-black shadow-md scale-105'
                            : 'bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Video Inputs */}
                {hero.bgMode === 'video' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Ambient Video MP4 URL *</label>
                      <input
                        value={hero.videoStoryUrl}
                        onChange={e => setHero({ ...hero, videoStoryUrl: e.target.value })}
                        placeholder="https://assets.mixkit.co/videos/..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Video Poster Thumbnail URL</label>
                      <input
                        value={hero.videoThumbnailUrl || ''}
                        onChange={e => setHero({ ...hero, videoThumbnailUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Static Image Input */}
                {hero.bgMode === 'image' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Background Image URL *</label>
                      <input
                        value={hero.bgImageUrl || ''}
                        onChange={e => setHero({ ...hero, bgImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CTAS & VISIBILITY CONTROLS */}
            {activeTab === 'ctas' && (
              <div className="space-y-6">
                
                {/* 1. CTA CONFIGURATION */}
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">CTA Buttons & Action Links</h2>
                      <p className="text-xs text-slate-500 font-medium">Configure primary and secondary CTA button labels & destination URLs</p>
                    </div>
                    <Sliders className="w-5 h-5 text-[#1352D0]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Primary CTA Label</label>
                      <input value={hero.primaryCta} onChange={e => setHero({ ...hero, primaryCta: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Primary CTA Link URL</label>
                      <input value={hero.primaryCtaUrl || '/free-audit'} onChange={e => setHero({ ...hero, primaryCtaUrl: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Secondary CTA Label</label>
                      <input value={hero.secondaryCta} onChange={e => setHero({ ...hero, secondaryCta: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Secondary CTA Link URL</label>
                      <input value={hero.secondaryCtaUrl || '/contact'} onChange={e => setHero({ ...hero, secondaryCtaUrl: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* 2. HERO VISIBILITY CONTROLS */}
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-900">Hero Section Visibility Controls</h2>
                    <p className="text-xs text-slate-500 font-medium">Toggle individual elements on or off in real-time</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'showRatingSection', label: 'Show Trust Rating Metrics Bar', desc: '4.9/5 Star Rating, Active Brands, Active Sellers' },
                      { key: 'showFloatingCards', label: 'Show Floating Proof Cards', desc: 'Hovering statistical proof badges' },
                      { key: 'showVideoButton', label: 'Show Watch Agency Story Video Button', desc: 'Modal popup video player button' },
                      { key: 'showBgAnimation', label: 'Show Background Mesh & SVG Glow Line', desc: 'Animated background grid lines and curve' },
                    ].map(toggle => (
                      <div key={toggle.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{toggle.label}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{toggle.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHero({ ...hero, [toggle.key]: !hero[toggle.key as keyof HeroConfig] })}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                            hero[toggle.key as keyof HeroConfig] ? 'bg-[#1352D0]' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            hero[toggle.key as keyof HeroConfig] ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
        </div>
      )}

      {/* TAB 5: LOGO MARQUEE */}
      {activeTab === 'marquee' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900">Add Brand / Partner Logo</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input value={newBrand.name} onChange={e => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="Brand / Division Name (e.g. Nykaa Marketplace)" className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
              <input value={newBrand.badge} onChange={e => setNewBrand({ ...newBrand, badge: e.target.value })} placeholder="Badge (e.g. E-COMMERCE)" className="w-full sm:w-64 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
              <button type="button" onClick={addMarqueeBrand} className="px-6 py-3 rounded-2xl bg-[#1352D0] text-white text-xs font-black shadow-md flex items-center justify-center space-x-2 cursor-pointer">
                <Plus className="w-4 h-4" /><span>Add Logo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {marquee.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{m.name}</div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase mt-1 inline-block ${m.badgeBg}`}>{m.badge}</span>
                </div>
                <button onClick={() => removeMarqueeBrand(m.id, m.name)} className="p-2 text-red-500 hover:text-red-700 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: VIDEO REELS STUDIO */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900">Add New Strategy Video Reel</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input value={newReel.speaker} onChange={e => setNewReel({ ...newReel, speaker: e.target.value })} placeholder="Speaker Name (e.g. Sumit Sharma)" className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
              <input value={newReel.role} onChange={e => setNewReel({ ...newReel, role: e.target.value })} placeholder="Role (e.g. CEO & Founder)" className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
              <input value={newReel.caption} onChange={e => setNewReel({ ...newReel, caption: e.target.value })} placeholder="Reel Caption (e.g. Karna Padta Hai 🚀)" className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
              <input value={newReel.videoUrl} onChange={e => setNewReel({ ...newReel, videoUrl: e.target.value })} placeholder="MP4 Video URL..." className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none" />
            </div>
            <button type="button" onClick={addReel} className="px-6 py-3 rounded-2xl bg-[#1352D0] text-white text-xs font-black shadow-md flex items-center space-x-2 cursor-pointer">
              <Plus className="w-4 h-4" /><span>Publish Reel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reels.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="relative aspect-[9/16] rounded-xl bg-slate-900 overflow-hidden">
                  <video src={r.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-black text-white">{r.caption}</span>
                    <span className="text-[10px] text-slate-300 font-bold">{r.speaker} • {r.company}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#1352D0] bg-blue-50 px-2 py-0.5 rounded-full">{r.badge}</span>
                  <button onClick={() => removeReel(r.id, r.speaker)} className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
