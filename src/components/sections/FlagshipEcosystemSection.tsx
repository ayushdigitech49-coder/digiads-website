import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Code2,
  Share2,
  ShoppingBag,
  Store,
  Palette,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { Link } from 'react-router-dom';

export interface DivisionItem {
  id: string;
  title: string;
  poweredBy?: string;
  badge: string;
  badgeBg: string;
  metricValue: string;
  metricLabel: string;
  valueProp: string;
  capabilities: string[];
  icon: React.ReactNode;
  isFlagship?: boolean;
  gridSpan: string;
}

const divisions: DivisionItem[] = [
  {
    id: 'div-web',
    title: 'Full-Stack Web Software Engineering',
    poweredBy: 'Powered by Arvian',
    badge: '⭐ FLAGSHIP DIVISION',
    badgeBg: 'bg-blue-50 text-[#1E5BC6] border border-blue-200',
    metricValue: '500+ Delivered',
    metricLabel: 'Websites & Web Apps',
    valueProp: 'Sub-second loading custom React, Next.js, and headless e-commerce web applications built for maximum conversion rate optimization.',
    capabilities: [
      'Custom React & Next.js Headless Web Apps',
      'Shopify Liquid & Custom App Integrations',
      'Core Web Vitals Sub-Second Speed (98+ Score)',
    ],
    icon: <Code2 className="w-6 h-6 text-[#1E5BC6]" />,
    isFlagship: true,
    gridSpan: 'lg:col-span-2 md:col-span-2',
  },
  {
    id: 'div-seo',
    title: 'SEO & AI Search Dominance',
    poweredBy: 'Powered by SEO Company Jaipur',
    badge: 'SEO Division',
    badgeBg: 'bg-blue-50 text-[#1E5BC6] border border-blue-200',
    metricValue: '12K+ Ranked',
    metricLabel: 'Keywords Page #1',
    valueProp: 'Jaipur’s legacy #1 organic search squad. Command top search engine results and AI Overview search snippets.',
    capabilities: [
      'Technical & Programmatic SEO Audits',
      'High-DA Authority Backlink Acquisition',
      'AI Overview & Voice Search Optimization',
    ],
    icon: <Search className="w-6 h-6 text-[#1E5BC6]" />,
    isFlagship: false,
    gridSpan: 'lg:col-span-1 md:col-span-1',
  },
  {
    id: 'div-ads',
    title: 'Performance Marketing & ROAS Engine',
    poweredBy: 'Powered by PerformanceMarketing4U',
    badge: 'Ads Division',
    badgeBg: 'bg-red-50 text-[#E53935] border border-red-200',
    metricValue: '4.8x Avg ROAS',
    metricLabel: 'Tracked Ad Revenue',
    valueProp: 'High-converting Meta (FB/IG) and Google Ads campaigns driven by server-side CAPI tracking and automated ROAS bidding.',
    capabilities: [
      'Meta CAPI & Server-Side Pixel Tracking',
      'Google Performance Max Campaign Scaling',
      'High-Intent Retargeting & Funnel Setup',
    ],
    icon: <TrendingUp className="w-6 h-6 text-[#E53935]" />,
    isFlagship: false,
    gridSpan: 'lg:col-span-1 md:col-span-1',
  },
  {
    id: 'div-social',
    title: 'Social Reels & Brand Creative Studio',
    poweredBy: 'Powered by Digimagnate',
    badge: 'Social Division',
    badgeBg: 'bg-amber-50 text-amber-800 border border-amber-200',
    metricValue: '5M+ Monthly',
    metricLabel: 'Organic Reel Views',
    valueProp: 'Viral Instagram Reels, TikTok-style short videos, and high-impact social media management that builds loyal customer followings.',
    capabilities: [
      '9:16 Vertical Video Reels Production',
      'Community & Social Media Optimization',
      'Influencer Marketing & Content Strategy',
    ],
    icon: <Share2 className="w-6 h-6 text-[#F4B400]" />,
    isFlagship: false,
    gridSpan: 'lg:col-span-1 md:col-span-1',
  },
  {
    id: 'div-marketplace',
    title: 'Marketplace Onboarding & Management',
    poweredBy: 'Direct Partner Network',
    badge: 'Marketplace Growth',
    badgeBg: 'bg-purple-50 text-purple-700 border border-purple-200',
    metricValue: '1000+ Active',
    metricLabel: 'Sellers Managed',
    valueProp: 'Complete seller account management for Amazon, Flipkart, Meesho, Myntra, Blinkit, Swiggy Instamart & Zepto.',
    capabilities: [
      'Blinkit & Zepto 10-Min Quick-Commerce Setup',
      'Amazon A+ Content & Listing Optimization',
      'Flipkart PLA & Assured Badge Verification',
    ],
    icon: <ShoppingBag className="w-6 h-6 text-purple-600" />,
    isFlagship: false,
    gridSpan: 'lg:col-span-1 md:col-span-1',
  },
  {
    id: 'div-catalog',
    title: 'E-Commerce Catalog & Product Operations',
    poweredBy: 'Automated Multi-Channel Sync',
    badge: 'Catalog Operations',
    badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    metricValue: '50,000+ SKUs',
    metricLabel: 'Managed & Synced',
    valueProp: 'Automated bulk product uploading, SKU inventory synchronization, and multi-channel marketplace listing management.',
    capabilities: [
      'Bulk CSV & API Catalog Automation',
      'Product SEO Copywriting & Image Retouching',
      'Real-Time Multi-Channel Stock Guard',
    ],
    icon: <Store className="w-6 h-6 text-emerald-600" />,
    isFlagship: false,
    gridSpan: 'lg:col-span-1 md:col-span-1',
  },
  {
    id: 'div-design',
    title: 'Graphic Design & Brand Identity Systems',
    poweredBy: 'Visual Excellence Studio',
    badge: 'Design Division',
    badgeBg: 'bg-pink-50 text-pink-700 border border-pink-200',
    metricValue: '100% Custom',
    metricLabel: 'Creative Assets',
    valueProp: 'Logo design, brand guidelines, product packaging, and ad creatives designed to command attention and inspire customer trust.',
    capabilities: [
      'Brand Identity Guidelines & Logo Design',
      'Product Packaging & E-Commerce Banners',
      'High-Converting Social Ad Creatives',
    ],
    icon: <Palette className="w-6 h-6 text-pink-600" />,
    isFlagship: false,
    gridSpan: 'lg:col-span-1 md:col-span-1',
  },
];

export const FlagshipEcosystemSection: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] relative overflow-hidden font-sans">
      
      {/* Subtle Light Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#1E5BC6]/05 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-[#1E5BC6] text-[11px] font-extrabold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span className="uppercase tracking-wider">INTEGRATED GROWTH NETWORK</span>
          </motion.div> */}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]"
          >
            One Platform.<br />
            <span className="text-[#1E5BC6]">Seven Growth</span> Engines.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
          >
            A consolidated ecosystem combining SEO, Ads, Web Development, Creative Media and Marketplace Operations under one roof.
          </motion.p>
        </div>

        {/* DIVISION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {divisions.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                onClick={() => openConsultationModal(item.title)}
                className={`p-8 sm:p-9 rounded-3xl transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                  item.isFlagship
                    ? 'bg-white border-2 border-[#1E5BC6] shadow-[0_8px_30px_rgba(30,91,198,0.12)]'
                    : 'bg-white border border-blue-100/90 shadow-[0_4px_20px_rgba(30,91,198,0.06)] hover:shadow-[0_12px_35px_rgba(30,91,198,0.12)] hover:border-[#1E5BC6]'
                } ${item.gridSpan}`}
              >
                {/* Subtle Hover Soft Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E5BC6]/04 via-[#E53935]/04 to-[#F4B400]/04 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Top Row: Icon + Badge + Metric */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${
                      item.isFlagship ? 'bg-blue-50 border-blue-200' : 'bg-blue-50/60 border-blue-100'
                    }`}>
                      {item.icon}
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider block mb-1 ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                      <span className="text-sm font-black text-[#1E5BC6] block leading-tight">{item.metricValue}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.metricLabel}</span>
                    </div>
                  </div>

                  {item.poweredBy && (
                    <span className="text-xs font-extrabold text-[#E53935] uppercase tracking-wider block mb-1.5">
                      {item.poweredBy}
                    </span>
                  )}

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#1E5BC6] transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.valueProp}
                  </p>

                  {/* Bullet Capabilities */}
                  <div className="space-y-2.5 mb-8">
                    {item.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center space-x-2.5 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#1E5BC6] shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Arrow Bar */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#1E5BC6] group-hover:text-[#E53935] transition-colors">
                  <span className="group-hover:translate-x-0.5 transition-transform">Explore Division Engine</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-[#1E5BC6] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* MINIMAL PREMIUM CTA AREA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-6 text-center"
        >
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-slate-950 hover:bg-[#1E5BC6] text-white font-extrabold text-sm rounded-full shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
