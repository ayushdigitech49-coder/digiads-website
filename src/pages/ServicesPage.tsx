import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Code2,
  Share2,
  Palette,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { servicesData } from '../data/servicesData';
import type { ServiceItem } from '../types';
import { useModal } from '../context/ModalContext';
import { serviceService } from '../services/service.service';
import { subscribeCmsUpdate } from '../utils/broadcastSync';

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { openConsultationModal } = useModal();

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('sumit_dynamic_services');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return servicesData;
  });

  const loadServices = async () => {
    try {
      const apiServices = await serviceService.getAllServices();
      if (apiServices && apiServices.length > 0) {
        setServices(apiServices);
        localStorage.setItem('sumit_dynamic_services', JSON.stringify(apiServices));
        return;
      }
    } catch (err) {
      console.warn('[ServicesPage] Failed to load API services:', err);
    }

    const saved = localStorage.getItem('sumit_dynamic_services');
    if (saved) {
      try { setServices(JSON.parse(saved)); } catch {}
    }
  };

  useEffect(() => {
    loadServices();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'service' || type === 'services' || type === 'all') {
        loadServices();
      }
    });

    return () => unsubscribe();
  }, []);

  const categories = ['All', 'SEO', 'Performance Marketing', 'Web Development', 'Social Media', 'Branding', 'AI Marketing'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => (s.category || '').toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch ((category || '').toLowerCase()) {
      case 'seo': return <Search className="w-6 h-6 text-[#1352D0]" />;
      case 'performance marketing': return <TrendingUp className="w-6 h-6 text-[#D91212]" />;
      case 'web development': return <Code2 className="w-6 h-6 text-indigo-600" />;
      case 'social media': return <Share2 className="w-6 h-6 text-pink-600" />;
      case 'branding': return <Palette className="w-6 h-6 text-[#F4B400]" />;
      case 'ai marketing': return <Cpu className="w-6 h-6 text-purple-600" />;
      default: return <Zap className="w-6 h-6 text-[#1352D0]" />;
    }
  };

  return (
    <div className="relative font-sans overflow-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[85vh] bg-[#061329] text-white overflow-hidden flex items-center pt-28 pb-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.25),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[#1352D0] text-xs font-black shadow-md backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span className="uppercase tracking-widest">Specialized Growth Divisions • 1 Platform</span>
          </motion.div>

          <div className="max-w-5xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white space-y-2"
            >
              <div>Growth Divisions & Services.</div>
              <div>
                <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Single Point</span>
                <span className="text-white"> of Revenue </span>
                <span className="text-[#D91212] drop-shadow-[0_0_18px_rgba(217,18,18,0.5)]">Accountability.</span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed pt-6"
            >
              SEO Rank Mastery, Performance Marketing, Headless Engineering, Social Reels Studio, Brand Strategy, Marketplace Onboarding, and AI Agents — operated as one cohesive team.
            </motion.p>
          </div>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-xs sm:text-sm font-black rounded-full transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1352D0] text-white shadow-xl shadow-blue-600/30 border-[#1352D0] scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 border-white/20 backdrop-blur'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: SERVICES LIST */}
      <section className="relative py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Showing <span className="text-[#1352D0] font-black">{filteredServices.length}</span> growth divisions
            </span>
            <span className="text-xs font-black uppercase text-[#1352D0]">
              {selectedCategory !== 'All' ? selectedCategory + ' DIVISION' : 'ALL DIVISIONS'}
            </span>
          </div>

          <div className="space-y-8">
            {filteredServices.map((svc) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-400 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                      {getCategoryIcon(svc.category)}
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#1352D0]">
                        {svc.category} DIVISION
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                        {svc.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                    {svc.fullDesc || svc.shortDesc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(svc.features || []).map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2.5 text-xs sm:text-sm font-extrabold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-6 sm:p-7 space-y-6 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Proven Benchmarks
                    </h4>
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(svc.metrics || [{ label: 'Avg Growth', value: '+240%' }, { label: 'SLA Rating', value: '99.8%' }]).map((m, i) => (
                      <div key={i} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                          {m.label}
                        </span>
                        <span className="text-lg font-black text-[#1352D0] block">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => openConsultationModal(svc.title + ' — Division Consultation')}
                      className="w-full py-3.5 bg-[#1352D0] hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                    >
                      <span>Book Strategy Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/services/${svc.slug}`}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs sm:text-sm font-black transition-colors block text-center border border-slate-800"
                    >
                      View Full Division Page
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: FINAL CTA */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[#F4B400] text-xs font-black shadow-md backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="uppercase tracking-widest">Single Point of Growth Accountability</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
          >
            Stop Managing 4+ Agencies. <br className="hidden sm:block" />
            <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Scale With One SLA Partner.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Book a 30-minute growth audit. We'll audit your stack, show 3 comparable case studies, and present a 90-day blueprint — no commitment required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => openConsultationModal('Services Final CTA — 30-Min Strategy Call')}
              className="w-full sm:w-auto px-10 py-5 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#1352D0] shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <span>Book My 30-Min Strategy Call</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </section>

    </div>
  );
};
