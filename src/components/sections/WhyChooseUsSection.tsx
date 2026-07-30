import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Layers, Award, Zap, ArrowRight, Star, Globe, TrendingUp,
  Code2, ShoppingBag
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export interface WhyChooseUsData {
  headline: string;
  description: string;
  ratingText: string;
  ratingSubtext: string;
  statCards: {
    id: string;
    value: string;
    title: string;
    subtitle: string;
    color?: string;
    fullWidth?: boolean;
  }[];
  features: {
    id: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
  }[];
}

export const defaultWhyChooseUsData: WhyChooseUsData = {
  headline: "Why 500+ Brands Choose One Unified Growth Partner",
  description: "Managing separate agencies for SEO, Google Ads, website dev, and social media creates broken communications and wasted budgets. We solved this by merging Jaipur's finest specialized agencies into one cohesive engine.",
  ratingText: "4.9/5 Client Satisfaction",
  ratingSubtext: "Trusted by D2C Brands, Local Businesses, Startups & Enterprises across India.",
  statCards: [
    { id: "stat_1", value: "500+", title: "Brands Served", subtitle: "Trusted Across D2C, Retail & Local Businesses in India", color: "#1E5BC6", fullWidth: true },
    { id: "stat_2", value: "4.8x", title: "Average ROAS", subtitle: "Meta & Google Ads", color: "#E53935", fullWidth: false },
    { id: "stat_3", value: "12K+", title: "Keywords Ranked", subtitle: "SEO Division", color: "#D97706", fullWidth: false }
  ],
  features: [
    { id: "feat_1", title: "Unified Account Dashboard", description: "Single real-time portal for SEO rankings, ad ROAS, and web conversions.", icon: "Layers", color: "blue" },
    { id: "feat_2", title: "Battle-Tested Agency Merger", description: "Combines legacy expertise of SEO Company Jaipur, PerformanceMarketing4U, Arvian & Digimagnate.", icon: "Award", color: "red" },
    { id: "feat_3", title: "AI-First Marketing Stack", description: "AI search optimization, server-side tracking, and automated WhatsApp nurturing bots.", icon: "Zap", color: "amber" }
  ]
};

export const WhyChooseUsSection: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [data, setData] = useState<WhyChooseUsData>(defaultWhyChooseUsData);

  const fetchWhyChooseUsData = async () => {
    try {
      const res = await adminService.getWhyChooseUs();
      if (res && res.success && res.whyChooseUs) {
        setData(res.whyChooseUs);
      } else {
        const saved = localStorage.getItem('sumit_why_choose_us_cms');
        if (saved) {
          try { setData(JSON.parse(saved)); } catch {}
        }
      }
    } catch {
      // Fallback to default state
    }
  };

  useEffect(() => {
    fetchWhyChooseUsData();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'why_choose_us' || type === 'all') {
        fetchWhyChooseUsData();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-28 sm:py-32 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] text-slate-900 relative overflow-hidden font-sans">
      
      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-05 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[#1E5BC6]/06 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 55/45 SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: CONTENT (7 COLUMNS) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="max-w-[700px]"
            >
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.14] text-slate-900">
                {data.headline || "Why 500+ Brands Choose One Unified Growth Partner"}
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-[660px] font-normal"
            >
              {data.description || "Managing separate agencies for SEO, Google Ads, website dev, and social media creates broken communications and wasted budgets."}
            </motion.p>

            {/* Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm max-w-[660px] space-y-1"
            >
              <div className="flex items-center space-x-2 text-[#F4B400]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F4B400]" />
                  ))}
                </div>
                <span className="text-sm font-black text-slate-900">{data.ratingText || "4.9/5 Client Satisfaction"}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                {data.ratingSubtext || "Trusted by D2C Brands, Local Businesses, Startups & Enterprises across India."}
              </p>
            </motion.div>

            {/* 3 Key Advantages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="space-y-5 max-w-[660px] pt-1"
            >
              {(data.features || defaultWhyChooseUsData.features).map((feat, fi) => {
                const IconComponent = fi === 0 ? Layers : fi === 1 ? Award : Zap;
                const iconColorClass = fi === 0 ? 'bg-blue-50 text-[#1E5BC6] border-blue-200' : fi === 1 ? 'bg-red-50 text-[#E53935] border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200';
                return (
                  <div key={feat.id || fi} className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl border mt-1 shadow-sm shrink-0 ${iconColorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{feat.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center space-y-3.5 sm:space-y-0 sm:space-x-4 pt-4"
            >
              <button
                onClick={() => openConsultationModal('Growth Advantage Call')}
                className="w-full sm:w-auto px-8 py-4 bg-[#E53935] hover:bg-red-700 text-white font-extrabold text-sm rounded-full shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Book Free Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/case-studies"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm rounded-full border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>See Client Success Stories</span>
                <ArrowRight className="w-4 h-4 text-[#1E5BC6]" />
              </Link>
            </motion.div>

          </div>

          {/* RIGHT SIDE: METRICS (5 COLUMNS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(data.statCards || defaultWhyChooseUsData.statCards).map((card, ci) => (
                <motion.div
                  key={card.id || ci}
                  whileHover={{ translateY: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className={`${card.fullWidth || ci === 0 ? 'sm:col-span-2 p-7' : 'sm:col-span-1 p-6'} bg-white rounded-3xl border border-blue-100/90 shadow-[0_6px_25px_rgba(30,91,198,0.08)] hover:shadow-[0_12px_35px_rgba(30,91,198,0.15)] relative overflow-hidden group cursor-default`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E5BC6] via-[#E53935] to-[#F4B400] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className={`${ci === 0 ? 'text-4xl text-[#1E5BC6]' : ci === 1 ? 'text-3xl text-[#E53935]' : 'text-3xl text-amber-600'} font-black block tracking-tight`}>
                    {card.value}
                  </span>
                  <h4 className={`${ci === 0 ? 'text-base' : 'text-sm'} font-extrabold text-slate-900 mt-1`}>
                    {card.title}
                  </h4>
                  <span className="text-xs text-slate-500 font-semibold block mt-1">
                    {card.subtitle}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Timeline Connector Bar */}
            <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm text-center">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-[11px] font-black uppercase tracking-wider text-slate-700 flex-wrap">
                <span className="text-[#1E5BC6]">SEO</span>
                <span className="text-slate-400">→</span>
                <span className="text-[#E53935]">Ads</span>
                <span className="text-slate-400">→</span>
                <span className="text-amber-600">Website</span>
                <span className="text-slate-400">→</span>
                <span className="text-purple-600">Marketplace</span>
                <span className="text-slate-400">→</span>
                <span className="text-emerald-600">Scale</span>
              </div>
            </div>

            {/* Partner Badges */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                OFFICIAL PARTNER CERTIFICATIONS
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-800 grayscale hover:grayscale-0 transition-all cursor-default group shadow-sm">
                  <Globe className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>Google</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-800 grayscale hover:grayscale-0 transition-all cursor-default group shadow-sm">
                  <TrendingUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Meta</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-800 grayscale hover:grayscale-0 transition-all cursor-default group shadow-sm">
                  <Code2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Shopify</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-800 grayscale hover:grayscale-0 transition-all cursor-default group shadow-sm">
                  <ShoppingBag className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Amazon</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
