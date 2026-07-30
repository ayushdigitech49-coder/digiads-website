import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Search, Code2, Zap, ShieldCheck, DollarSign, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BentoProject {
  id: string;
  badgeText: string;
  badgeType: 'revenue' | 'traffic' | 'seo' | 'roas';
  industry: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
  techStack?: string[];
  image: string;
  ctaText: string;
  gridSpan: string;
}

const bentoProjects: BentoProject[] = [
  // 1. LARGE FEATURED BENTO CARD (SPANS 2 COLS ON LG)
  {
    id: 'featured-flagship-d2c',
    badgeText: '₹14.2 Cr Revenue',
    badgeType: 'revenue',
    industry: 'HEALTH & WELLNESS D2C',
    title: '10x E-Commerce Revenue Scaling & AI Search Supremacy',
    summary: 'Engineered a sub-second Next.js headless store, programmatic SEO cluster, and Meta CAPI server-side ad attribution that scaled monthly revenue by 10x.',
    metrics: [
      { label: 'Revenue Generated', value: '₹14.2 Cr' },
      { label: 'Average ROAS', value: '4.8x' },
      { label: 'Organic Traffic', value: '180K / Mo' }
    ],
    techStack: ['Next.js', 'Shopify Plus', 'Google Ads', 'Programmatic SEO'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    ctaText: 'View Case Study →',
    gridSpan: 'lg:col-span-8 md:col-span-12',
  },

  // 2. VERTICAL BENTO CARD (SPANS 1 COL ON LG)
  {
    id: 'ecommerce-fashion-seo',
    badgeText: '180K Organic Traffic',
    badgeType: 'traffic',
    industry: 'E-COMMERCE & RETAIL',
    title: '10x Organic Traffic Surge & #1 Google Rankings',
    summary: 'Consolidating keyword engine to dominate 450+ transactional terms, taking organic visits to 145,000+ monthly.',
    metrics: [
      { label: 'Organic Visits', value: '145K+ / Mo' },
      { label: 'Page 1 Ranks', value: '482 Terms' }
    ],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    ctaText: 'See Revenue Breakdown →',
    gridSpan: 'lg:col-span-4 md:col-span-6',
  },

  // 3. VERTICAL BENTO CARD
  {
    id: 'real-estate-hni-ads',
    badgeText: '4.8x ROAS',
    badgeType: 'roas',
    industry: 'LUXURY REAL ESTATE',
    title: '450+ High-Ticket Luxury Villa Leads in 90 Days',
    summary: 'Multi-stage Meta video funnel with WhatsApp qualification bot scaling qualified HNI buyers while dropping CPA by 71%.',
    metrics: [
      { label: 'Qualified Leads', value: '458 Leads' },
      { label: 'CPA Reduction', value: '-71% Cost' }
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    ctaText: 'View Case Study →',
    gridSpan: 'lg:col-span-4 md:col-span-6',
  },

  // 4. WIDE BENTO CARD
  {
    id: 'fintech-saas-redesign',
    badgeText: '97% Customer Retention',
    badgeType: 'seo',
    industry: 'SAAS & FINTECH PORTAL',
    title: 'SaaS Platform Redesign Leads to 140% Demo Surge',
    summary: 'Executed modern Stripe/Linear-style UI redesign and Next.js frontend rebuild that doubled demo booking conversion rate in 14 days.',
    metrics: [
      { label: 'Demo Conversions', value: '4.8% (+300%)' },
      { label: 'Page Load Speed', value: '0.4s (99/100)' },
      { label: 'Pipeline Lift', value: '₹4.2 Cr' }
    ],
    techStack: ['React', 'Next.js', 'Framer Motion', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    ctaText: 'See Revenue Breakdown →',
    gridSpan: 'lg:col-span-8 md:col-span-12',
  },
];

export const CaseStudiesSection: React.FC = () => {
  const getBadgeStyle = (type: BentoProject['badgeType']) => {
    switch (type) {
      case 'revenue':
        return 'bg-[#10B981] text-white shadow-emerald-900/40 border border-emerald-400/30';
      case 'traffic':
        return 'bg-[#2563EB] text-white shadow-blue-900/40 border border-blue-400/30';
      case 'seo':
        return 'bg-[#7C3AED] text-white shadow-purple-900/40 border border-purple-400/30';
      case 'roas':
        return 'bg-[#F59E0B] text-slate-950 font-black shadow-amber-900/40 border border-amber-300/40';
      default:
        return 'bg-[#2563EB] text-white';
    }
  };

  return (
    <section className="py-28 sm:py-32 bg-[#061329] text-slate-100 relative overflow-hidden font-sans border-t border-white/10">
      
      {/* Subtle Blue & Purple Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.14),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-[#3B82F6] text-xs font-black shadow-md backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span className="uppercase tracking-widest">WORK SHOWCASE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight"
          >
            Client Success Stories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed font-normal"
          >
            Real growth campaigns, revenue wins and scalable systems delivered across SEO, Performance Marketing and E-Commerce.
          </motion.p>
        </div>

        {/* 2. 2025 BENTO GRID SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {bentoProjects.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ translateY: -8 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl border border-white/10 bg-[#091736]/90 shadow-2xl relative overflow-hidden group cursor-pointer flex flex-col justify-end min-h-[420px] sm:min-h-[460px] ${item.gridSpan}`}
            >
              {/* Full Image Background */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
              />

              {/* Gradient Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]/95" />

              {/* Floating Metric Badge (Top Left Overlay) */}
              <div className="absolute top-6 left-6 z-10">
                <span className={`px-4 py-2 rounded-full text-xs font-black shadow-xl tracking-wide inline-flex items-center space-x-1.5 ${getBadgeStyle(item.badgeType)}`}>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{item.badgeText}</span>
                </span>
              </div>

              {/* Content Overlay at Bottom */}
              <div className="relative z-10 p-7 sm:p-9 space-y-4">
                
                <span className="text-[11px] font-black uppercase tracking-widest text-[#3B82F6] block">
                  {item.industry}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
                  {item.summary}
                </p>

                {/* Key Metrics Grid */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {item.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-xs"
                    >
                      <span className="text-slate-400 font-medium mr-1.5">{m.label}:</span>
                      <span className="text-white font-black">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Badges (if available) */}
                {item.techStack && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-[10px] font-bold text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reveal CTA Button */}
                <div className="pt-3">
                  <Link
                    to="/case-studies"
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm font-extrabold text-white group-hover:text-[#3B82F6] transition-colors"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
