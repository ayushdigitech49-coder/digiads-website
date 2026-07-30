import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { pricingPlans, pricingFaqs } from '../data/pricingData';
import type { PricingPlan } from '../types';
import { useModal } from '../context/ModalContext';
import { adminService } from '../services/admin.service';
import { subscribeCmsUpdate } from '../utils/broadcastSync';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { openConsultationModal } = useModal();

  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('sumit_pricing_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return pricingPlans;
  });

  const syncPlans = async () => {
    try {
      const res = await adminService.getPricingPlans();
      if (res && res.success && Array.isArray(res.pricingPlans) && res.pricingPlans.length > 0) {
        setPlans(res.pricingPlans);
        localStorage.setItem('sumit_pricing_plans', JSON.stringify(res.pricingPlans));
        return;
      }
    } catch (err) {
      console.warn('[PricingPage] Failed to sync plans:', err);
    }

    const saved = localStorage.getItem('sumit_pricing_plans');
    if (saved) {
      try { setPlans(JSON.parse(saved)); } catch {}
    } else {
      setPlans(pricingPlans);
    }
  };

  useEffect(() => {
    syncPlans();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'pricing' || type === 'all') {
        syncPlans();
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="relative font-sans overflow-hidden">
      
      {/* SECTION 1: HERO & TOGGLE */}
      <section className="relative min-h-[75vh] bg-[#061329] text-white overflow-hidden flex items-center pt-38 pb-16">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.25),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          
       

          <div className="max-w-4xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
            >
              Predictable Growth Packages. <br />
              <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Zero Long-Term Lock-Ins.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed pt-5"
            >
              Transparent monthly plans designed to scale with your business stage. Every plan includes dedicated Slack communication, weekly sprints, and verified ROI tracking.
            </motion.p>
          </div>

          {/* Billing Cycle Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-3 pt-4"
          >
            <span className={`text-xs sm:text-sm font-black ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 bg-slate-800 rounded-full p-1 border border-slate-700 transition-colors focus:outline-none cursor-pointer"
            >
              <motion.div
                animate={{ x: billingCycle === 'annual' ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-[#1352D0] shadow-md"
              />
            </button>

            <div className="flex items-center space-x-2">
              <span className={`text-xs sm:text-sm font-black ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Save 20%
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: DYNAMIC PRICING CARDS */}
      <section className="relative py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35 }}
                  className={`rounded-3xl p-8 sm:p-9 transition-all duration-300 relative flex flex-col justify-between ${
                    plan.popular
                      ? 'bg-slate-950 text-white shadow-2xl border-2 border-[#1352D0] ring-4 ring-blue-600/10'
                      : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1352D0] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                      ★ Most Popular Growth Plan
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                    <p className={`text-xs font-normal mb-6 min-h-[36px] ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {plan.description}
                    </p>

                    <div className="mb-8">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-4xl sm:text-5xl font-black">
                          ₹{(displayPrice || 0).toLocaleString()}
                        </span>
                        <span className={`text-xs font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                          /month
                        </span>
                      </div>
                      {billingCycle === 'annual' && (
                        <span className="text-[10px] text-emerald-500 font-extrabold block mt-1">
                          Billed annually (Save 20% total)
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      <span className={`text-[11px] font-black uppercase tracking-wider block ${plan.popular ? 'text-[#F4B400]' : 'text-[#1352D0]'}`}>
                        Key Deliverables Included:
                      </span>
                      <ul className="space-y-3 text-xs sm:text-sm">
                        {(plan.features || []).map((feat, i) => (
                          <li key={i} className="flex items-start space-x-2.5">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#F4B400]' : 'text-emerald-500'}`} />
                            <span className={plan.popular ? 'text-slate-200 font-semibold' : 'text-slate-700 font-semibold'}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => openConsultationModal(`${plan.name} — ${billingCycle} Plan`)}
                    className={`w-full py-4 text-xs sm:text-sm font-black rounded-xl transition-all shadow-md cursor-pointer ${
                      plan.popular
                        ? 'bg-[#1352D0] hover:bg-blue-600 text-white shadow-blue-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.ctaText || 'Get Started Now'}
                  </button>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: FAQ */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#1352D0] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Pricing Questions
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                    {openFaqIndex === index ? '−' : '+'}
                  </span>
                </button>

                {openFaqIndex === index && (
                  <div className="px-6 pb-6 text-slate-600 text-sm font-normal leading-relaxed border-t border-slate-200/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
