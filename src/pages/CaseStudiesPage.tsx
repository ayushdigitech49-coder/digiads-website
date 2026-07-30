import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sparkles, Search, TrendingUp, Code2, Award, Star, CheckCircle2, ShieldCheck, Target, Rocket, Compass, Layers, ExternalLink, BookOpen, Quote, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { caseStudiesData } from '../data/caseStudiesData';
import { useModal } from '../context/ModalContext';

const getBadgeStyle = (badge: string) => {
  if (badge.includes('Performance') || badge.includes('Meta') || badge.includes('Ads')) {
    return 'bg-[#D91212] text-white border border-red-400/30';
  }
  if (badge.includes('SEO') || badge.includes('E-Commerce') || badge.includes('Search')) {
    return 'bg-[#1352D0] text-white border border-blue-400/30';
  }
  return 'bg-[#F4B400] text-slate-950 border border-amber-300/40 font-black';
};

export const CaseStudiesPage: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const featuredCase = caseStudiesData[0];

  return (
    <div className="relative font-sans overflow-hidden">

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[88vh] bg-[#061329] text-white overflow-hidden flex items-center pt-38 pb-20">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(217,18,18,0.18),transparent_70%)] pointer-events-none" />

        <div className="absolute top-36 left-[6%] hidden xl:block opacity-55 backdrop-blur-md bg-slate-900/80 p-3.5 rounded-2xl border border-blue-500/30 text-left space-y-1 shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-[#1352D0]" />
            <span>Combined Revenue</span>
          </div>
          <span className="text-xl font-black text-[#1352D0] block">₹450+ Cr</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
         

          <div className="max-w-5xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white space-y-2"
            >
              <div>Data-Driven Growth Stories</div>
              <div>
                <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">With Verifiable</span>
                <span className="text-white"> Revenue </span>
                <span className="text-[#EF4444] drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]">Numbers</span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed pt-6"
            >
              Battle-tested SEO, Meta Ads, and web engineering playbooks. Every case study breaks down challenge, strategy stack, and exact revenue ROI from our unified squad.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="pt-8 border-t border-slate-800/80 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left"
          >
            {[
              { icon: <Award className="w-4 h-4 text-[#F4B400]" />, value: caseStudiesData.length + '+', label: 'Live Case Studies' },
              { icon: <TrendingUp className="w-4 h-4 text-[#1352D0]" />, value: '₹450+ Cr', label: 'Revenue Generated' },
              { icon: <Star className="w-4 h-4 fill-[#F4B400] text-[#F4B400]" />, value: '4.9/5', label: 'Client NPS Score' },
              { icon: <ShieldCheck className="w-4 h-4 text-[#1352D0]" />, value: '100%', label: 'Results Verified' },
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => openConsultationModal('Case Study — Replicate These Results')}
              className="w-full sm:w-auto px-8 py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm sm:text-base rounded-full border border-[#1352D0] shadow-xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 group cursor-pointer"
            >
              <span>Replicate These Results For Us</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('case-studies-list')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm sm:text-base rounded-full border border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <span>Explore Case Studies</span>
              <Layers className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: FEATURED FLAGSHIP CASE STUDY */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-[#1352D0] text-xs font-black shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-[#F4B400]" />
              <span className="uppercase tracking-widest">Flagship Case Study • Most Revenue Generated</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight"
            >
              ₹14.2 Cr Closed with a <span className="text-[#1352D0]">WhatsApp Meta Funnel</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl mx-auto"
            >
              Our flagship growth story — converting luxury villa cold traffic into qualified HNI buyers ready to transact.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/5 overflow-hidden group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[580px]">
                <img
                  src={featuredCase.image}
                  alt={featuredCase.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#020617]/30 to-white" />
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-4 py-2 rounded-full text-xs font-black bg-white/95 text-slate-900 border border-slate-200 shadow-xl backdrop-blur-md">
                    {featuredCase.client}
                  </span>
                </div>
                <div className="absolute top-6 right-6 z-10">
                  <span className={`px-4 py-2 rounded-full text-xs font-black shadow-xl tracking-wide inline-flex items-center space-x-1.5 ${getBadgeStyle(featuredCase.badge)}`}>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{featuredCase.badge}</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 space-y-6 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/30">
                
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  {featuredCase.industry} • Previously under {featuredCase.mergedFrom}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {featuredCase.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {featuredCase.summary}
                </p>

                {/* Challenge + Solution */}
                <div className="space-y-3">
                  <div className="p-4 bg-red-50/70 rounded-2xl border border-red-100">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Target className="w-4 h-4 text-[#D91212]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#D91212]">The Challenge</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{featuredCase.challenge}</p>
                  </div>
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Compass className="w-4 h-4 text-[#1352D0]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#1352D0]">Our Solution</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{featuredCase.solution}</p>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center space-x-2">
                    <BarChart3 className="w-3.5 h-3.5 text-[#1352D0]" />
                    <span>Verified Growth Metrics</span>
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {featuredCase.results.map((res, i) => (
                      <div key={i} className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-white text-center shadow-lg">
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{res.label}</span>
                        <span className="text-base sm:text-lg font-black text-white block mb-1">{res.value}</span>
                        <span className="text-[10px] sm:text-[11px] font-black text-[#1352D0] bg-blue-500/20 px-2 py-0.5 rounded-full inline-block">{res.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => openConsultationModal(featuredCase.title + ' — Same Engine')}
                    className="flex-1 py-3.5 bg-[#1352D0] hover:bg-blue-600 text-white rounded-xl text-sm font-black transition-colors flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/30 cursor-pointer"
                  >
                    <span>Get This Exact Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => document.getElementById('case-studies-list')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-sm font-black transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>See More Case Studies</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: FULL CASE STUDIES LIST */}
      <section id="case-studies-list" className="relative py-24 sm:py-28 bg-[#061329] text-white overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-[#F4B400] text-xs font-black shadow-md backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">Full Growth Case Study Library</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
            >
              Explore Every <span className="text-[#1352D0]">Revenue Win</span>
            </motion.h2>
          </div>

          <div className="space-y-7 sm:space-y-8">
            {caseStudiesData.map((cs, index) => {
              const isExpanded = expandedId === cs.id;
              return (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-3xl border border-white/10 bg-[#091736]/95 shadow-2xl relative overflow-hidden group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[360px]">
                      <img src={cs.image} alt={cs.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#091736]" />
                    </div>

                    <div className="lg:col-span-7 p-7 sm:p-8 space-y-5 flex flex-col justify-center">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug group-hover:text-blue-400 transition-colors">
                        {cs.title}
                      </h3>

                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {cs.summary}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                          onClick={() => openConsultationModal(cs.title + ' — Replicate Results')}
                          className="flex-1 py-3 bg-[#1352D0] hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                        >
                          <span>Get This Growth Engine</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Your Brand Could Be Our <br className="hidden sm:block" />
            <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Next ₹14.2 Cr Win</span>
          </motion.h2>

          <button
            onClick={() => openConsultationModal('Case Studies CTA — 30-min Strategy Audit')}
            className="px-10 py-5 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#1352D0] shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Book My Free Strategy Audit
          </button>
        </div>
      </section>

    </div>
  );
};
