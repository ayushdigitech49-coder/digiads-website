import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { adminService } from '../../services/admin.service';
import { defaultFaqData, type FaqConfigData, type FaqItem } from '../../data/faqData';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { openConsultationModal } = useModal();

  const [config, setConfig] = useState<FaqConfigData>(() => {
    const saved = localStorage.getItem('sumit_faq_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultFaqData;
  });

  const loadFaqConfig = async () => {
    try {
      const res = await adminService.getFaqConfig();
      if (res && res.success && res.faqConfig) {
        setConfig(res.faqConfig);
        localStorage.setItem('sumit_faq_config', JSON.stringify(res.faqConfig));
        return;
      }
    } catch {}

    const saved = localStorage.getItem('sumit_faq_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch {}
    }
  };

  useEffect(() => {
    loadFaqConfig();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'faq' || type === 'all') {
        loadFaqConfig();
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = config.items || defaultFaqData.items;

  return (
    <section className="py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] relative overflow-hidden font-sans">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#1E5BC6]/05 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#1E5BC6] bg-white px-4 py-1.5 rounded-full border border-blue-200 inline-flex items-center space-x-1.5 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-[#1E5BC6]" />
            <span>{config.sectionTag || defaultFaqData.sectionTag}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {config.sectionTitle || defaultFaqData.sectionTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            {config.sectionSubtitle || defaultFaqData.sectionSubtitle}
          </p>
        </div>

        {/* Interactive Accordion FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#1E5BC6] shadow-lg'
                    : 'bg-white/90 hover:bg-white border-blue-100/90 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block ${
                      isOpen ? 'bg-blue-50 text-[#1E5BC6]' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`p-2 rounded-full transition-transform duration-300 shrink-0 ${
                    isOpen ? 'bg-[#1E5BC6] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2 font-normal"
                    >
                      <p className="pt-3">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Support Footer Callout */}
        <div className="p-6 rounded-3xl bg-white border border-blue-200/90 shadow-sm text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-0.5">
            <h4 className="text-sm font-extrabold text-slate-900">Still have questions?</h4>
            <p className="text-xs text-slate-600">Our growth strategists are available for a 1-on-1 consultation.</p>
          </div>
          <button
            onClick={() => openConsultationModal('FAQ Strategy Call')}
            className="px-6 py-3 bg-[#1E5BC6] hover:bg-blue-700 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center space-x-2 shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Talk to an Expert</span>
          </button>
        </div>

      </div>
    </section>
  );
};
