import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Search, TrendingUp, Code2, Palette, Cpu, Award, BarChart3, Star, CheckCircle2, ShieldCheck, Target, Rocket, Compass, Layers, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { portfolioData, defaultPortfolioStats, defaultPortfolioClients, type PortfolioStatItem, type PortfolioClientItem } from '../data/portfolioData';
import { useModal } from '../context/ModalContext';
import { BackgroundBeams } from '../components/ui/background-beams';
import { adminService } from '../services/admin.service';
import type { PortfolioItem } from '../types';

const getBadgeStyle = (label: string) => {
  if (label.includes('Revenue') || label.includes('Cr') || label.includes('ROAS')) {
    return 'bg-[#1352D0] text-white border border-blue-400/30';
  }
  if (label.includes('Traffic') || label.includes('SEO') || label.includes('Reach') || label.includes('Rank')) {
    return 'bg-[#D91212] text-white border border-red-400/30';
  }
  return 'bg-[#F4B400] text-slate-950 border border-amber-300/40 font-black';
};

const getStatBadgeStyle = (label: string) => {
  if (label.includes('Revenue') || label.includes('Cr') || label.includes('ROAS')) {
    return 'bg-blue-50 text-[#1352D0] border-blue-200';
  }
  if (label.includes('Traffic') || label.includes('SEO') || label.includes('Reach') || label.includes('Rank')) {
    return 'bg-red-50 text-[#D91212] border-red-200';
  }
  return 'bg-amber-50 text-amber-800 border-amber-200';
};

const LOCAL_KEY = 'sumit_portfolio_data';
const LOCAL_STATS_KEY = 'sumit_portfolio_stats';
const LOCAL_CLIENTS_KEY = 'sumit_portfolio_clients';

export const PortfolioPage: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [selectedTag, setSelectedTag] = useState('All');
  const [items, setItems] = useState<PortfolioItem[]>(portfolioData);
  const [statsList, setStatsList] = useState<PortfolioStatItem[]>(defaultPortfolioStats);
  const [clientsList, setClientsList] = useState<PortfolioClientItem[]>(defaultPortfolioClients);
  const filterScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollFilter = (direction: 'left' | 'right') => {
    if (filterScrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      filterScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // -------- Load from localStorage + backend API + live sync on CMS updates --------
  useEffect(() => {
    let cancelled = false;

    const loadLocalOrBackend = async () => {
      // 1. Projects
      try {
        const storedProjects = localStorage.getItem(LOCAL_KEY);
        if (storedProjects) {
          const parsed = JSON.parse(storedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) setItems(parsed);
        }
      } catch (err) {
        console.warn('Failed reading portfolio projects from localStorage', err);
      }

      // 2. Extra (Stats & Clients)
      try {
        const storedStats = localStorage.getItem(LOCAL_STATS_KEY);
        if (storedStats) {
          const parsedStats = JSON.parse(storedStats);
          if (Array.isArray(parsedStats) && parsedStats.length > 0) setStatsList(parsedStats);
        }
        const storedClients = localStorage.getItem(LOCAL_CLIENTS_KEY);
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          if (Array.isArray(parsedClients) && parsedClients.length > 0) setClientsList(parsedClients);
        }

        const remoteExtra = await adminService.getPortfolioExtraConfig();
        if (!cancelled && remoteExtra) {
          if (remoteExtra.stats && Array.isArray(remoteExtra.stats)) setStatsList(remoteExtra.stats);
          if (remoteExtra.clients && Array.isArray(remoteExtra.clients)) setClientsList(remoteExtra.clients);
        }
      } catch {}
    };

    loadLocalOrBackend();

    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_KEY && e.newValue) {
        try { setItems(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LOCAL_STATS_KEY && e.newValue) {
        try { setStatsList(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LOCAL_CLIENTS_KEY && e.newValue) {
        try { setClientsList(JSON.parse(e.newValue)); } catch {}
      }
    };

    const onPortfolioUpdated = () => {
      loadLocalOrBackend();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('portfolio_updated', onPortfolioUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('portfolio_updated', onPortfolioUpdated);
    };
  }, []);

  const tags = ['All', 'SEO', 'Performance Marketing', 'Web Development', 'Social Media', 'Branding', 'AI Marketing', 'Local SEO'];

  const filteredItems = selectedTag === 'All'
    ? items
    : items.filter((item) => {
        if (selectedTag === 'SEO') return item.tags.some(t => t.toLowerCase().includes('seo'));
        if (selectedTag === 'Performance Marketing') return item.tags.some(t => t.includes('Ads') || t.includes('Lead Gen') || t.includes('ROAS') || t.includes('Pipeline'));
        if (selectedTag === 'Web Development') return item.tags.some(t => t.includes('Next.js') || t.includes('Shopify') || t.includes('React') || t.includes('Tailwind') || t.includes('Stripe') || t.includes('Headless'));
        if (selectedTag === 'Social Media') return item.tags.some(t => t.includes('Reels') || t.includes('Influencer') || t.includes('UGC') || t.includes('Instagram'));
        if (selectedTag === 'Branding') return item.tags.some(t => t.includes('Logo') || t.includes('Brand'));
        if (selectedTag === 'AI Marketing') return item.tags.some(t => t.includes('AI') || t.includes('GPT') || t.includes('Agent') || t.includes('Zapier') || t.includes('CRM') || t.includes('Automation'));
        if (selectedTag === 'Local SEO') return item.tags.some(t => t.includes('Local') || t.includes('GMB') || t.includes('Maps'));
        return true;
      });

  return (
    <div className="relative font-sans overflow-hidden">

      {/* SECTION 1: HERO — DARK TECH BACKGROUND */}
      <section className="relative min-h-[90vh] bg-[#061329] text-white overflow-hidden flex items-center pt-38 pb-20">
        
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(217,18,18,0.18),transparent_70%)] pointer-events-none" />

        {/* Floating Stats Badges */}
        <div className="absolute top-36 left-[6%] hidden xl:block opacity-60 backdrop-blur-md bg-slate-900/80 p-3.5 rounded-2xl border border-blue-500/30 text-left space-y-1 shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-[#1352D0]" />
            <span>Revenue Generated</span>
          </div>
          <span className="text-xl font-black text-[#1352D0] block">₹450+ Cr</span>
        </div>
        <div className="absolute top-36 right-[6%] hidden xl:block opacity-60 backdrop-blur-md bg-slate-900/80 p-3.5 rounded-2xl border border-[#D91212]/30 text-left space-y-1 shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <BarChart3 className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Projects Delivered</span>
          </div>
          <span className="text-xl font-black text-white block">450+ Case Studies</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
          
      

          <div className="max-w-5xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white space-y-2"
            >
              <div>Client Projects That</div>
              <div>
                <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Scaled Revenue</span>
                <span className="text-white"> 10× </span>
                <span className="text-[#EF4444] drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]">And Beyond</span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed pt-6"
            >
              A curated showcase of live Next.js portals, enterprise SEO campaigns, Meta/Google ad engines, and AI automation systems delivered across industries by the unified Sumit DigiTech squad.
            </motion.p>
          </div>

          {/* Trust Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="pt-8 border-t border-slate-800/80 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left"
          >
            {[
              { icon: <Award className="w-4 h-4 text-[#F4B400]" />, value: '450+', label: 'Case Studies Delivered' },
              { icon: <TrendingUp className="w-4 h-4 text-[#1352D0]" />, value: '+340%', label: 'Avg Organic Surge' },
              { icon: <Star className="w-4 h-4 fill-[#F4B400] text-[#F4B400]" />, value: '4.9/5', label: 'Client Satisfaction' },
              { icon: <ShieldCheck className="w-4 h-4 text-[#1352D0]" />, value: '99.8%', label: 'SLA Delivery Rate' },
            ].map((stat, i) => (
              <div key={i} className="px-4 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center space-x-2 mb-1.5">
                  {stat.icon}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">{stat.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => openConsultationModal('Portfolio Growth Consultation')}
              className="w-full sm:w-auto px-8 py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm sm:text-base rounded-full border border-[#1352D0] shadow-xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 group cursor-pointer"
            >
              <span>Build Your Growth Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm sm:text-base rounded-full border border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <span>Browse 450+ Projects</span>
              <Layers className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: CATEGORY FILTERS + PORTFOLIO GRID */}
      <section id="portfolio-grid" className="relative py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)]">
        <BackgroundBeams className="opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-[#1352D0] text-xs font-black shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span className="uppercase tracking-widest">Portfolio Gallery</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight"
            >
              Live Projects Across Growth Divisions
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl mx-auto"
            >
              Filter across SEO, performance ads, Next.js portals, branding, social media, and AI automation case studies.
            </motion.p>
          </div>

          {/* Filter Pills — Clean Pill Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black rounded-full transition-all duration-300 border cursor-pointer ${
                  selectedTag === t
                    ? 'bg-[#1352D0] text-white shadow-xl shadow-blue-600/25 border-[#1352D0] scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {t}
              </button>
            ))}
          </motion.div>

          {/* Portfolio Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#1352D0]" />
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                Showing <span className="text-[#1352D0] font-black">{filteredItems.length}</span> verified projects
              </span>
            </div>
            <span className="hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              {selectedTag !== 'All' ? selectedTag + ' DIVISION' : 'ALL DIVISIONS'}
            </span>
          </div>

          {/* INFINITE CONTINUOUS LEFT-TO-RIGHT MARQUEE SLIDER FOR PROJECT CARDS */}
          <div className="relative overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8">
            <motion.div
              className="flex space-x-6 sm:space-x-8 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 70,
                  ease: 'linear',
                },
              }}
            >
              {/* Duplicate array for seamless infinite looping */}
              {[...filteredItems, ...filteredItems, ...filteredItems].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="w-[320px] sm:w-[380px] shrink-0 group rounded-3xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(30,91,198,0.05)] hover:shadow-2xl hover:shadow-blue-900/10 hover:border-[#1352D0]/40 transition-all duration-400 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Image + Overlay */}
                  <div className="relative h-56 sm:h-60 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Dark Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    
                    {/* Floating Stats Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black shadow-xl tracking-wide inline-flex items-center space-x-1.5 ${getBadgeStyle(item.stats.label)}`}>
                        <Zap className="w-3 h-3 fill-current" />
                        <span>{item.stats.value}</span>
                        <span className="opacity-80 font-bold ml-0.5 hidden sm:inline">{item.stats.label}</span>
                      </span>
                    </div>

                    {/* Client Chip */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black bg-white/95 backdrop-blur-md text-slate-900 border border-white/50 shadow-lg">
                        {item.client}
                      </span>
                    </div>

                    {/* Hover Reveal — View Project Link */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                            {item.stats.label}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-white">{item.stats.value}</span>
                        </div>
                        {item.link && (
                          <a
                            href={item.link}
                            className="p-2.5 bg-white rounded-xl text-slate-900 shadow-xl hover:scale-110 transition-transform"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#1352D0] flex items-center space-x-1.5">
                        <Target className="w-3 h-3" />
                        <span>{item.category}</span>
                      </span>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#1352D0] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tg, i) => (
                          <span
                            key={i}
                            className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#1352D0] border border-blue-100 group-hover:bg-[#1352D0] group-hover:text-white group-hover:border-[#1352D0] transition-colors duration-300"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stat Mini Card */}
                    <div className={`mt-auto p-3.5 rounded-2xl border ${getStatBadgeStyle(item.stats.label)} flex items-center justify-between`}>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-70 block">{item.stats.label}</span>
                        <span className="text-lg font-black">{item.stats.value}</span>
                      </div>
                      <TrendingUp className="w-6 h-6 opacity-80 text-[#1352D0]" />
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => openConsultationModal(item.title + ' — Similar Project')}
                    className="w-full py-3.5 bg-slate-900 hover:bg-[#1352D0] text-white rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center space-x-2 group/btn shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <span>Build Similar Growth Engine</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 2.5: STAT COUNTERS BANNER (25+ Countries...)  */}
      {/* ===================================================== */}
      <section className="relative py-16 sm:py-20 bg-[linear-gradient(135deg,#0A3185_0%,#1352D0_50%,#092668_100%)] text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {statsList.map((st, idx) => (
              <motion.div
                key={st.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-xl">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">{st.value}</span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-wider">{st.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 2.6: OUR HAPPY CUSTOMERS LOGOS               */}
      {/* ===================================================== */}
      <section className="relative py-20 bg-white border-b border-slate-200 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
              OUR HAPPY CUSTOMERS
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Some of our Clients
            </p>
          </div>

          {/* Client Logos Infinite Continuous Moving Marquee */}
          <div className="relative overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8">
            <motion.div
              className="flex space-x-4 sm:space-x-6 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 30,
                  ease: 'linear',
                },
              }}
            >
              {[...clientsList, ...clientsList, ...clientsList, ...clientsList].map((client, idx) => (
                <div
                  key={`${client.id || idx}-${idx}`}
                  className={`w-44 sm:w-52 h-24 sm:h-28 rounded-2xl border ${client.style || 'bg-white text-slate-900 border-slate-200'} flex items-center justify-center p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer select-none text-center shrink-0`}
                >
                  <span className={client.font || 'tracking-wider font-black text-xs'}>{client.name}</span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 3: FINAL CTA — DARK THEME */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[#F4B400] text-xs font-black shadow-md backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#D91212] animate-ping" />
            <span className="uppercase tracking-widest">Limited Q3 Growth Slots Remaining</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
          >
            Ready to See Your Brand <br className="hidden sm:block" />
            in <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Our Next Case Study?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Book a 30-minute growth audit. We'll map your revenue bottleneck, show 3 competitor wins, and present a 90-day blueprint — no obligation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => openConsultationModal('Portfolio Final CTA — 30-min Growth Audit')}
              className="w-full sm:w-auto px-10 py-5 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#1352D0] shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <span>Book My Free Growth Audit</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </section>

    </div>
  );
};
