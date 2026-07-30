import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Save, Layers, Zap, Star, Globe, TrendingUp, Code2,
  ShoppingBag, Check, RefreshCw, Sparkles, ShieldCheck
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export interface WhyChooseUsCMSData {
  headline: string;
  description: string;
  ratingText: string;
  ratingSubtext: string;
  statCards: {
    id: string;
    value: string;
    title: string;
    subtitle: string;
    color: string;
    fullWidth?: boolean;
  }[];
  features: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  }[];
}

export const defaultWhyChooseUsCMS: WhyChooseUsCMSData = {
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

export const AdminWhyChooseUsPage: React.FC = () => {
  const [data, setData] = useState<WhyChooseUsCMSData>(defaultWhyChooseUsCMS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getWhyChooseUs();
      if (res && res.success && res.whyChooseUs) {
        setData(res.whyChooseUs);
        localStorage.setItem('sumit_why_choose_us_cms', JSON.stringify(res.whyChooseUs));
      } else {
        const saved = localStorage.getItem('sumit_why_choose_us_cms');
        if (saved) {
          try { setData(JSON.parse(saved)); } catch { setData(defaultWhyChooseUsCMS); }
        }
      }
    } catch {
      setData(defaultWhyChooseUsCMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem('sumit_why_choose_us_cms', JSON.stringify(data));
    try {
      await adminService.updateWhyChooseUs(data);
    } catch (err) {
      console.warn('[AdminWhyChooseUsPage] Backend save fallback:', err);
    }
    notifyCmsUpdate('why_choose_us');
    setIsSaving(false);
    Swal.toast('Why Choose Us Section Updated Live!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans text-slate-900 pb-16">
      
      {/* PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061329] via-[#0D3BA1] to-[#1352D0] text-white p-6 sm:p-9 shadow-2xl border border-blue-500/20">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-8 h-8 text-[#F4B400]" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-[#F4B400]" />
                <span>Value Proposition CMS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Unified Growth Partner Section CMS</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1.5 max-w-2xl leading-relaxed">
                Manage headlines, 500+ stats cards, 4.8x ROAS counters, and advantage features. All changes update live on Homepage instantly!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3.5 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: HEADLINE & PARAGRAPH */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <Award className="w-5 h-5 text-[#1352D0]" />
            <h3 className="text-lg font-black text-slate-900">Main Headline & Story Description</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Section Headline *</label>
              <input
                required
                type="text"
                value={data.headline}
                onChange={e => setData({ ...data, headline: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900 focus:outline-none focus:border-[#1352D0]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Story Paragraph Description *</label>
              <textarea
                required
                rows={3}
                value={data.description}
                onChange={e => setData({ ...data, description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1352D0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Rating Badge Title</label>
                <input
                  type="text"
                  value={data.ratingText}
                  onChange={e => setData({ ...data, ratingText: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Rating Subtext</label>
                <input
                  type="text"
                  value={data.ratingSubtext}
                  onChange={e => setData({ ...data, ratingSubtext: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: STAT CARDS EDITOR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black text-slate-900">Right-Side Stat Cards (500+, 4.8x ROAS, 12K+ Keywords)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.statCards.map((sc, idx) => (
              <div key={sc.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stat Card #{idx + 1}</span>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Big Stat Number/Value</label>
                  <input
                    type="text"
                    value={sc.value}
                    onChange={e => {
                      const updated = [...data.statCards];
                      updated[idx].value = e.target.value;
                      setData({ ...data, statCards: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-lg font-black text-[#1352D0]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={sc.title}
                    onChange={e => {
                      const updated = [...data.statCards];
                      updated[idx].title = e.target.value;
                      setData({ ...data, statCards: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={sc.subtitle}
                    onChange={e => {
                      const updated = [...data.statCards];
                      updated[idx].subtitle = e.target.value;
                      setData({ ...data, statCards: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: 3 KEY ADVANTAGE CARDS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black text-slate-900">3 Key Advantage Features</h3>
          </div>

          <div className="space-y-4">
            {data.features.map((feat, idx) => (
              <div key={feat.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Feature #{idx + 1}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Feature Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={e => {
                        const updated = [...data.features];
                        updated[idx].title = e.target.value;
                        setData({ ...data, features: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={feat.description}
                      onChange={e => {
                        const updated = [...data.features];
                        updated[idx].description = e.target.value;
                        setData({ ...data, features: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-4 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white font-black text-sm shadow-xl flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-white" />
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish All Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
