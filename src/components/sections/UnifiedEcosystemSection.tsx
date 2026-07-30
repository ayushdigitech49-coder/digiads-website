import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Code2,
  Share2,
  ShoppingBag,
  Store,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useModal } from '../../context/ModalContext';

export const UnifiedEcosystemSection: React.FC = () => {
  const { openConsultationModal } = useModal();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="py-24 bg-[#FBFBFC] relative overflow-hidden font-sans border-y border-slate-200/80">
      
      {/* Stripe & Linear Inspired Background Gradients & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      
      {/* Ambient Brand Color Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#1E5BC6]/10 via-[#E53935]/08 to-[#F4B400]/08 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E5BC6] text-xs font-extrabold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span className="uppercase tracking-wider">Unified Master Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            One Unified Growth Ecosystem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Built from Specialized Digital Divisions and Marketplace Integrations powering 500+ growing brands.
          </motion.p>
        </div>

        {/* 1. TOP AREA: ANIMATED STATS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg"
        >
          <div className="text-center space-y-1 border-r border-slate-100 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-[#1E5BC6] block tracking-tight">500+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Brands</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-100 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-[#E53935] block tracking-tight">10+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Marketplace Integrations</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-100 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-[#F4B400] block tracking-tight">4</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Specialized Divisions</span>
          </div>

          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 block tracking-tight">₹50M+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Revenue Generated</span>
          </div>
        </motion.div>

        {/* 2. MAIN ECOSYSTEM GRID: 4 PRIMARY DIVISION CARDS + CENTER FEATURED MASTER BRAND CARD */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center"
        >
          
          {/* DIVISION CARD 1: SEO Company Jaipur */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => openConsultationModal('SEO Division')}
            className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl hover:border-[#1E5BC6] transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-blue-50 text-[#1E5BC6] rounded-2xl group-hover:bg-[#1E5BC6] group-hover:text-white transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-50 text-[#1E5BC6] border border-blue-200">
                  SEO Division
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#1E5BC6] transition-colors mb-1">
                  SEO Company Jaipur
                </h3>
                <p className="text-xs text-slate-500 font-semibold">Search Engine & AI Overview Dominance</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Formally Jaipur's premier search marketing agency. Driving organic page #1 Google rankings and AI Overview search visibility.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verified Metric</span>
                <span className="text-base font-black text-[#1E5BC6]">12K+ Keywords Ranked</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#1E5BC6] group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* CENTER FEATURED MASTER BRAND CARD: SUMIT DIGITECH */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03 }}
            className="lg:col-span-1 lg:-translate-y-4 relative z-20 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border-2 border-gradient-to-r from-[#1E5BC6] via-[#E53935] to-[#F4B400] relative overflow-hidden group cursor-pointer"
            onClick={() => openConsultationModal('Master Growth Platform')}
          >
            {/* Glowing Backdrop Orbs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#1E5BC6]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#E53935]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E5BC6] via-[#E53935] to-[#F4B400]" />

            <div className="space-y-6 relative z-10 text-center">
              
              {/* Crown Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1E5BC6] to-[#E53935] text-white text-xs font-black uppercase tracking-wider shadow-lg">
                <Crown className="w-4 h-4 text-[#F4B400]" />
                <span>MASTER GROWTH PLATFORM</span>
              </div>

              {/* Master Brand Logo */}
              <div className="py-2 flex justify-center">
                <Logo size="lg" variant="dark" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight text-white">SUMIT DIGITECH</h3>
                <p className="text-xs text-slate-300 font-semibold">Central Master Brand & Platform Architecture</p>
              </div>

              {/* 5 Integrated Pillars */}
              <div className="space-y-2 text-left pt-2">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E5BC6]" />
                    <span>SEO Mastery</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Integrated</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E53935]" />
                    <span>Performance Marketing</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Integrated</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4B400]" />
                    <span>Web Engineering Stack</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Integrated</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Social Media Studio</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Integrated</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Marketplace Growth</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Integrated</span>
                </div>
              </div>

              <button
                onClick={() => openConsultationModal('Master Platform Strategy')}
                className="w-full py-3.5 bg-gradient-to-r from-[#1E5BC6] via-[#E53935] to-rose-600 hover:opacity-90 text-white font-extrabold text-xs rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Access Master Ecosystem</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </motion.div>

          {/* DIVISION CARD 2: PerformanceMarketing4U */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => openConsultationModal('Ads Division')}
            className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl hover:border-[#E53935] transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-red-50 text-[#E53935] rounded-2xl group-hover:bg-[#E53935] group-hover:text-white transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-red-50 text-[#E53935] border border-red-200">
                  Ads Division
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#E53935] transition-colors mb-1">
                  PerformanceMarketing4U
                </h3>
                <p className="text-xs text-slate-500 font-semibold">High-ROAS Meta & Google Ad Engine</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized paid acquisition engine utilizing server-side CAPI tracking and automated ROAS bidding algorithms.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verified Metric</span>
                <span className="text-base font-black text-[#E53935]">$2M+ Ad Spend Managed</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* DIVISION CARD 3: Arvian Business Solutions */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => openConsultationModal('Web Engineering')}
            className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl hover:border-slate-900 transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-slate-100 text-slate-900 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  Web Engineering
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-slate-900 transition-colors mb-1">
                  Arvian Business Solutions
                </h3>
                <p className="text-xs text-slate-500 font-semibold">Sub-Second Custom React & Next.js Stack</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Full-stack web software squad delivering fast Shopify liquid themes, headless Next.js platforms, and WordPress sites.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verified Metric</span>
                <span className="text-base font-black text-slate-900">500+ Websites Delivered</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* DIVISION CARD 4: Digimagnate */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => openConsultationModal('Social Media')}
            className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl hover:border-[#F4B400] transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-[#F4B400] group-hover:text-slate-900 transition-colors">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Social Media
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#F4B400] transition-colors mb-1">
                  Digimagnate
                </h3>
                <p className="text-xs text-slate-500 font-semibold">Viral Short Video Reels & SMO Studio</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Creative social media studio crafting 9:16 vertical video reels, community engagement, and viral brand campaigns.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verified Metric</span>
                <span className="text-base font-black text-amber-600">1000+ Campaigns Managed</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#F4B400] group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

        </motion.div>

        {/* 3. MARKETPLACE INTEGRATION ROW (SMALLER PARTNER CARDS BELOW) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6 pt-6"
        >
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">
              Native Quick-Commerce & Marketplace Integrations
            </span>
            <h4 className="text-lg font-black text-slate-800">
              Direct API & Seller Partner Networks
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Amazon */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#F4B400] transition-all flex items-center space-x-3 group cursor-default">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-[#F4B400] transition-colors">Amazon</span>
                <span className="text-[10px] text-slate-400 font-medium">Marketplace</span>
              </div>
            </div>

            {/* Flipkart */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1E5BC6] transition-all flex items-center space-x-3 group cursor-default">
              <div className="p-2 bg-blue-50 rounded-xl text-[#1E5BC6] group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-[#1E5BC6] transition-colors">Flipkart Assured</span>
                <span className="text-[10px] text-slate-400 font-medium">PLA Partner</span>
              </div>
            </div>

            {/* Blinkit */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-yellow-500 transition-all flex items-center space-x-3 group cursor-default">
              <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-yellow-600 transition-colors">Blinkit</span>
                <span className="text-[10px] text-slate-400 font-medium">10-Min Express</span>
              </div>
            </div>

            {/* Zepto */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-600 transition-all flex items-center space-x-3 group cursor-default">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-600 transition-colors">Zepto</span>
                <span className="text-[10px] text-slate-400 font-medium">Quick-Commerce</span>
              </div>
            </div>

            {/* Swiggy Instamart */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#E53935] transition-all flex items-center space-x-3 group cursor-default">
              <div className="p-2 bg-red-50 rounded-xl text-[#E53935] group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-[#E53935] transition-colors">Swiggy Instamart</span>
                <span className="text-[10px] text-slate-400 font-medium">Dark Store Network</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
