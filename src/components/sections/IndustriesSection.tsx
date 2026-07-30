import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Car, ShoppingBag, Landmark, Sparkles, Truck, GraduationCap,
  Plane, HeartPulse, Film, Utensils, Scale, ArrowRight, TrendingUp,
  Building, Award
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export interface IndustryItem {
  id: string;
  name: string;
  badge: string;
  stat: string;
  description: string;
  iconType: string;
  color?: string;
  badgeBg?: string;
  visible?: boolean;
}

const iconMap: Record<string, any> = {
  HeartPulse,
  Building,
  GraduationCap,
  Scale,
  Cpu,
  Car,
  ShoppingBag,
  Landmark,
  Sparkles,
  Truck,
  Plane,
  Utensils,
  Film,
};

export const defaultIndustries: IndustryItem[] = [
  { id: 'ind_healthcare', name: 'Healthcare & Wellness', badge: 'PATIENT TRUST', stat: '+320% Leads Generated', description: 'Hospital & clinic GMB rankings, doctor branding, patient appointment funnels.', iconType: 'HeartPulse', color: 'text-rose-600', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'ind_realestate', name: 'Real Estate & PropTech', badge: 'HIGH CLOSING', stat: '₹14.2Cr Revenue Closed', description: 'High-ticket buyer ads, 3D property tour funnels, and lead qualification engines.', iconType: 'Building', color: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'ind_education', name: 'Education & Institutes', badge: 'ADMISSIONS 10X', stat: '180K Organic Traffic', description: 'Student recruitment ads, university landing pages, and skill course lead funnels.', iconType: 'GraduationCap', color: 'text-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'ind_legal', name: 'Legal & Consulting Services', badge: 'HIGH VALUE CASES', stat: '420+ Qualified Leads', description: 'Law firm reputation management, corporate client acquisition, search trust signals.', iconType: 'Scale', color: 'text-slate-700', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'ind_saas', name: 'IT & SaaS Companies', badge: 'HIGH ROAS', stat: '+340% MRR Growth', description: 'B2B lead generation, product-led SEO, and CAC optimization for cloud platforms.', iconType: 'Cpu', color: 'text-blue-600', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'ind_automobile', name: 'Automobile Industry', badge: 'LOCAL DOMINANCE', stat: '10× Dealership Leads', description: 'Hyper-targeted Google Ads, local SEO, and showroom test-drive booking funnels.', iconType: 'Car', color: 'text-red-600', badgeBg: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'ind_ecommerce', name: 'E-commerce & Online Retail', badge: 'MAX CONVERSIONS', stat: '8.4× Average ROAS', description: 'Shopify & WooCommerce scale-up, Shopping Ads, and revenue conversion optimization.', iconType: 'ShoppingBag', color: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'ind_fintech', name: 'Finance & Fintech', badge: 'TRUST BUILDER', stat: '50k+ Qualified Leads', description: 'Compliant digital marketing, loan/investment lead generation, and search authority.', iconType: 'Landmark', color: 'text-purple-600', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'ind_beauty', name: 'Beauty & Personal Care', badge: 'VIRAL BRANDING', stat: '4.2M Social Reach', description: 'D2C brand storytelling, Instagram/Meta Reels ads, and influencer product sales.', iconType: 'Sparkles', color: 'text-pink-600', badgeBg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'ind_logistics', name: 'Logistics & Transport', badge: 'B2B CONTRACTS', stat: '150+ Fleet Enquiries', description: 'Fleet booking SEO, supply chain B2B marketing, and freight customer acquisition.', iconType: 'Truck', color: 'text-amber-600', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'ind_travel', name: 'Travel & Tourism', badge: 'BOOKINGS BOOM', stat: '₹2.5Cr Package Sales', description: 'International tour package marketing, luxury resort booking ads, and travel SEO.', iconType: 'Plane', color: 'text-cyan-600', badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'ind_food', name: 'Food & Beverage', badge: 'DINE & ORDER', stat: '45k Monthly Footfall', description: 'Restaurant chain branding, Zomato/Swiggy ad optimization, and food brand growth.', iconType: 'Utensils', color: 'text-orange-600', badgeBg: 'bg-orange-50 text-orange-700 border-orange-200' }
];

interface IndustriesSectionProps {
  onSelectIndustry?: (industryName: string) => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onSelectIndustry }) => {
  const [items, setItems] = useState<IndustryItem[]>(defaultIndustries);

  const fetchIndustriesData = async () => {
    try {
      const res = await adminService.getIndustries();
      if (res && res.success && Array.isArray(res.industries) && res.industries.length > 0) {
        setItems(res.industries.filter((it: any) => it.visible !== false));
      } else {
        const saved = localStorage.getItem('sumit_industries_cms');
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
    fetchIndustriesData();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'industries' || type === 'all') {
        fetchIndustriesData();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1352D0] text-xs font-black uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Verified Industry Results</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Proven Growth Results Across 12+ Key Sectors
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
            Every domain gets a tailored digital growth strategy engineered for maximum ROAS, qualified leads, and brand authority.
          </p>
        </div>

        {/* 12-CARD UNIFIED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((ind, idx) => {
            const Icon = iconMap[ind.iconType] || TrendingUp;
            return (
              <motion.div
                key={ind.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="group relative rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#1352D0]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                      <Icon className={`w-6 h-6 ${ind.color || 'text-[#1352D0]'}`} />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border ${ind.badgeBg || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {ind.badge}
                    </span>
                  </div>

                  {/* Title & Stat Badge */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#1352D0] transition-colors">
                      {ind.name}
                    </h3>
                    <div className="text-sm font-black text-emerald-600 mt-1 flex items-center space-x-1.5 bg-emerald-50/90 px-2.5 py-1 rounded-xl border border-emerald-200/80 w-fit">
                      <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{ind.stat}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {ind.description}
                  </p>
                </div>

                {/* CTA Action Button */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectIndustry && onSelectIndustry(ind.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#1352D0] text-slate-700 hover:text-white border border-slate-200 hover:border-[#1352D0] text-xs font-black transition-all flex items-center justify-center space-x-2 group/btn cursor-pointer"
                  >
                    <span>Get Industry Audit</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
