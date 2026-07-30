import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const FinalCtaSection: React.FC = () => {
  const { openAuditModal, openConsultationModal } = useModal();

  return (
    <section className="py-28 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] text-slate-900 relative overflow-hidden font-sans">
      
      {/* Soft Blue Radial Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#1E5BC6]/05 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
        
        {/* 1. BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-[#1E5BC6] text-xs font-black shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
          <span className="uppercase tracking-widest">ZERO RISK • 100% FREE ANALYSIS</span>
        </motion.div>

        {/* 2. HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] text-slate-900 max-w-3xl mx-auto"
        >
          Ready To Scale With <br />
          <span className="text-[#1E5BC6]">One Unified Growth Partner?</span>
        </motion.h2>

        {/* 3. DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
        >
          Get your instant AI Website Audit & Competitor Keyword Report sent directly to your inbox, or schedule a 1-on-1 strategy call with our senior growth architects.
        </motion.p>

        {/* 4. RATING & TRUST LINE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 px-6 py-3 rounded-2xl bg-white border border-blue-100 shadow-sm text-xs font-bold text-slate-700"
        >
          <div className="flex items-center space-x-1.5 text-[#F4B400]">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#F4B400]" />
              ))}
            </div>
            <span className="text-slate-900 font-black text-sm">4.9/5 Rating</span>
          </div>

          <span className="hidden sm:inline text-slate-300">•</span>

          <span className="text-slate-600">Trusted by 500+ Businesses Across India</span>
        </motion.div>

        {/* 5. BUTTONS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-2"
        >
          {/* Primary CTA */}
          <button
            onClick={openAuditModal}
            className="w-full sm:w-auto px-9 py-4.5 bg-[#E53935] hover:bg-red-700 text-white font-extrabold text-sm sm:text-base rounded-full shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5"
          >
            <span>Get Free Growth Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => openConsultationModal('Enterprise Growth Call')}
            className="w-full sm:w-auto px-9 py-4.5 bg-slate-950 hover:bg-[#1E5BC6] text-white font-extrabold text-sm sm:text-base rounded-full shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Book Strategy Call</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400]" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
