import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  TrendingUp,
  Search,
  Code2,
  Share2,
  Palette,
  Store,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Star
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export interface BentoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  categoryBg: string;
  statValue: string;
  statLabel: string;
  icon: React.ReactNode;
  spanCols: string;
  features: string[];
}

const bentoItems: BentoItem[] = [
  {
    id: 'div-1',
    title: 'Marketplace Onboarding & Account Management',
    subtitle: 'Quick-Commerce & E-Commerce Express',
    description: 'Complete seller account management for Amazon, Flipkart, Meesho, Myntra, Blinkit, Swiggy Instamart & Zepto.',
    category: 'Marketplace Ecosystem',
    categoryBg: 'bg-[#D91212] text-white',
    statValue: '1000+ Active Sellers',
    statLabel: 'Managed Across India',
    icon: <ShoppingBag className="w-6 h-6 text-[#D91212]" />,
    spanCols: 'lg:col-span-2',
    features: ['Blinkit & Zepto 10-Min Onboarding', 'Amazon A+ Content & Listing Boost', 'Flipkart PLA & Assured Badging'],
  },
  {
    id: 'div-2',
    title: 'Performance Marketing & ROAS Ads Engine',
    subtitle: 'Formally PerformanceMarketing4U',
    description: 'High-conversion Meta (FB/IG) & Google Ads campaigns driven by server-side CAPI tracking and automated ROAS optimization.',
    category: 'High-ROAS Division',
    categoryBg: 'bg-[#1352D0] text-white',
    statValue: '4.8x Avg ROAS',
    statLabel: 'Tracked Ad Revenue',
    icon: <TrendingUp className="w-6 h-6 text-[#1352D0]" />,
    spanCols: 'lg:col-span-1',
    features: ['Meta CAPI & Server-Side Pixel', 'Google Performance Max Ads', 'Retargeting Funnels'],
  },
  {
    id: 'div-3',
    title: 'SEO Rank Mastery & AI Search Dominance',
    subtitle: 'Formally SEO Company Jaipur',
    description: 'Jaipur’s legacy #1 organic search division. Rank #1 on Google for high-intent buyer keywords and AI search engine overviews.',
    category: 'Search Division',
    categoryBg: 'bg-emerald-600 text-white',
    statValue: '+340% Traffic',
    statLabel: 'Avg Organic Surge',
    icon: <Search className="w-6 h-6 text-emerald-600" />,
    spanCols: 'lg:col-span-1',
    features: ['Technical & On-Page Audit', 'High-DA Authority Backlinks', 'AI Overview Optimization'],
  },
  {
    id: 'div-4',
    title: 'Full-Stack Web Software Engineering',
    subtitle: 'Formally Arvian Business Solutions',
    description: 'Sub-second loading custom React, Next.js, Shopify, and WordPress e-commerce websites built for maximum conversion rates.',
    category: 'Web Tech Stack',
    categoryBg: 'bg-slate-900 text-white',
    statValue: '99.8% SLA',
    statLabel: 'Page Speed Index: 98+',
    icon: <Code2 className="w-6 h-6 text-slate-800" />,
    spanCols: 'lg:col-span-2',
    features: ['Custom React / Next.js Web Apps', 'Shopify Liquid & Headless Stack', 'Sub-second Page Loading'],
  },
  {
    id: 'div-5',
    title: 'Social Reels & Brand Creative Studio',
    subtitle: 'Formally Digimagnate',
    description: 'Viral Instagram Reels, TikTok-style short videos, and high-impact social media management that builds passionate brand followers.',
    category: 'Social Division',
    categoryBg: 'bg-[#F4B400] text-slate-900',
    statValue: '5M+ Views',
    statLabel: 'Organic Viral Reach',
    icon: <Share2 className="w-6 h-6 text-amber-600" />,
    spanCols: 'lg:col-span-1',
    features: ['9:16 Vertical Video Reels', 'Community & SMO Management', 'Influencer Collaboration'],
  },
  {
    id: 'div-6',
    title: 'E-Commerce Catalog & Product Upload',
    subtitle: 'Multi-Channel Sync',
    description: 'Automated bulk product uploading, SKU inventory synchronization, and multi-channel marketplace listing management.',
    category: 'Catalog Operations',
    categoryBg: 'bg-purple-600 text-white',
    statValue: '50,000+ SKUs',
    statLabel: 'Listed & Synced',
    icon: <Store className="w-6 h-6 text-purple-600" />,
    spanCols: 'lg:col-span-1',
    features: ['Bulk CSV & API Automation', 'Product Copywriting & Images', 'Inventory Error Guard'],
  },
  {
    id: 'div-7',
    title: 'Graphic Design & Brand Identity Systems',
    subtitle: 'Visual Excellence',
    description: 'Logo design, brand guidelines, product packaging, and ad creatives designed to command attention and inspire customer trust.',
    category: 'Design Division',
    categoryBg: 'bg-pink-600 text-white',
    statValue: '100% Unique',
    statLabel: 'Brand Guidelines',
    icon: <Palette className="w-6 h-6 text-pink-600" />,
    spanCols: 'lg:col-span-1',
    features: ['Logo & Visual Identity', 'Packaging & Banner Design', 'High-Converting Ad Creatives'],
  },
];

export const HoverGlowBento: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-24 bg-[#FBFBFC] relative overflow-hidden font-sans border-y border-slate-200">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#1352D0]/05 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D91212]/05 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1352D0] bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm inline-flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F4B400]" />
            <span>Unified Digital Capability Engine</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            7 Powerhouse Growth Divisions
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Consolidating Jaipur's finest specialized agencies into one cohesive growth stack.
          </p>
        </div>

        {/* Bento Grid Layout with Hover Glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {bentoItems.map((item) => {
            const isHovered = hoveredCard === item.id;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => openConsultationModal(item.title)}
                className={`relative rounded-3xl p-8 bg-white border transition-all duration-300 flex flex-col justify-between cursor-pointer group overflow-hidden ${item.spanCols} ${
                  isHovered
                    ? 'border-[#1352D0] shadow-2xl scale-[1.01]'
                    : 'border-slate-200/90 shadow-md hover:shadow-xl'
                }`}
              >
                {/* DYNAMIC HOVER GLOW BORDER ACCENT */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#1352D0]/10 via-[#D91212]/10 to-[#F4B400]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                
                {/* TOP HEADER ROW: Icon + Category Badge + Integrated Stat */}
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block shadow-sm ${item.categoryBg}`}>
                        {item.category}
                      </span>
                      <div className="text-xs font-black text-[#1352D0] flex items-center justify-end space-x-1">
                        <span>{item.statValue}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-[#D91212] uppercase tracking-wide block mb-1">
                    {item.subtitle}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#1352D0] transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Bullet Feature Pills */}
                  <div className="space-y-2 mb-6">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1352D0] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION BAR WITH HOVER GLOW LINK */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#1352D0] group-hover:text-[#D91212] transition-colors">
                  <span>Explore Division Capabilities</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-[#D91212] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
