import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const INDUSTRIES = [
  { id: 'real_estate', label: 'Real Estate', multiplier: 2.5, avgRoas: 4.5 },
  { id: 'ecommerce', label: 'E-commerce', multiplier: 2.8, avgRoas: 5.2 },
  { id: 'healthcare', label: 'Healthcare', multiplier: 2.4, avgRoas: 4.2 },
  { id: 'education', label: 'Education', multiplier: 2.3, avgRoas: 4.0 },
  { id: 'saas', label: 'SaaS & Tech', multiplier: 3.2, avgRoas: 6.0 },
  { id: 'local_business', label: 'Local Business', multiplier: 2.2, avgRoas: 3.8 },
  { id: 'finance', label: 'Finance & Banking', multiplier: 3.0, avgRoas: 5.5 },
  { id: 'other', label: 'Other Industry', multiplier: 2.5, avgRoas: 4.4 },
];

export const GrowthCalculatorSection: React.FC = () => {
  const { openAuditModal } = useModal();

  // Inputs
  const [budget, setBudget] = useState<number>(100000);
  const [currentLeads, setCurrentLeads] = useState<number>(50);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ecommerce');
  const [conversionRate, setConversionRate] = useState<number>(3.0);

  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Growth Calculations
  const calculations = useMemo(() => {
    const indData = INDUSTRIES.find(i => i.id === selectedIndustry) || INDUSTRIES[0];
    
    // Calculated projections
    const multiplier = indData.multiplier;
    const projectedLeads = Math.round(currentLeads > 0 ? currentLeads * multiplier : (budget / 800) * 1.5);
    const growthPercent = Math.round(((projectedLeads - currentLeads) / (currentLeads || 1)) * 100);
    const estimatedRoas = indData.avgRoas.toFixed(1);
    
    // Revenue projection (approx formula based on lead value and conversion)
    const estimatedDealValue = budget > 200000 ? 45000 : 25000;
    const currentRevenue = currentLeads * (conversionRate / 100) * estimatedDealValue;
    const projectedRevenue = projectedLeads * ((conversionRate * 1.35) / 100) * estimatedDealValue;
    const revenueGrowth = Math.max(0, projectedRevenue - currentRevenue);

    return {
      projectedLeads,
      growthPercent: Math.max(20, growthPercent),
      estimatedRoas: `${estimatedRoas}x`,
      revenueGrowth: revenueGrowth > 0 
        ? `+₹${(revenueGrowth / 100000).toFixed(1)} Lakhs` 
        : `+₹${((budget * multiplier) / 100000).toFixed(1)} Lakhs`,
    };
  }, [budget, currentLeads, selectedIndustry, conversionRate]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
    }, 400);
  };

  return (
    <section className="relative py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] text-slate-900 overflow-hidden font-sans border-y border-blue-100/80">
      
      {/* LIGHT BACKGROUND MESH GRID & AMBIENT BLUE GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(19,82,208,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,82,208,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-[#1352D0] text-xs font-black shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5 text-[#1352D0]" />
            <span className="uppercase tracking-widest">Interactive Growth Estimator</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Growth Potential <span className="text-[#1352D0]">Calculator</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal"
          >
            See how strategic SEO, AI Search Optimization, and Performance Marketing can impact your business growth.
          </motion.p>
        </div>

        {/* CALCULATOR MAIN GRID (LEFT: INPUT FORM, RIGHT: RESULTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE: INPUT FORM CARD (LIGHT GLASS CARDS) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-[0_10px_35px_rgba(19,82,208,0.07)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#1352D0]" />
                <h3 className="text-lg font-black text-slate-900">Input Your Metrics</h3>
              </div>
              <span className="text-[10px] font-black text-[#1352D0] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Live Calculator
              </span>
            </div>

            <form onSubmit={handleCalculate} className="space-y-5">
              
              {/* 1. Monthly Marketing Budget */}
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                  <label htmlFor="calc-budget" className="text-slate-700">1. Monthly Marketing Budget (₹)</label>
                  <span className="text-[#1352D0] font-extrabold">₹{budget.toLocaleString('en-IN')}</span>
                </div>
                <input
                  id="calc-budget"
                  type="number"
                  min={10000}
                  step={5000}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  placeholder="Enter monthly marketing budget"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                />
                <input
                  type="range"
                  aria-label="Monthly Marketing Budget Range Slider"
                  min={20000}
                  max={2000000}
                  step={10000}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full mt-2 accent-[#1352D0] cursor-pointer"
                />
              </div>

              {/* 2. Current Monthly Leads */}
              <div>
                <label htmlFor="calc-current-leads" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  2. Current Monthly Leads
                </label>
                <input
                  id="calc-current-leads"
                  type="number"
                  min={1}
                  value={currentLeads}
                  onChange={e => setCurrentLeads(Number(e.target.value))}
                  placeholder="Enter current leads"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                />
              </div>

              {/* 3. Industry Dropdown */}
              <div>
                <label htmlFor="calc-industry" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  3. Industry Sector
                </label>
                <div className="relative">
                  <select
                    id="calc-industry"
                    value={selectedIndustry}
                    onChange={e => setSelectedIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind.id} value={ind.id} className="bg-white text-slate-900">
                        {ind.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 font-bold">
                    ▼
                  </div>
                </div>
              </div>

              {/* 4. Current Conversion Rate (%) */}
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                  <label htmlFor="calc-conversion-rate" className="text-slate-700">4. Current Conversion Rate (%)</label>
                  <span className="text-emerald-600 font-extrabold">{conversionRate}%</span>
                </div>
                <input
                  id="calc-conversion-rate"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  value={conversionRate}
                  onChange={e => setConversionRate(Number(e.target.value))}
                  placeholder="Enter conversion rate percentage"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                />
                <input
                  type="range"
                  aria-label="Current Conversion Rate Percentage Range Slider"
                  min={0.5}
                  max={20}
                  step={0.1}
                  value={conversionRate}
                  onChange={e => setConversionRate(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>{isCalculating ? 'Computing Projections...' : 'Calculate Growth Potential'}</span>
              </button>

            </form>
          </motion.div>

          {/* RIGHT SIDE: RESULTS CARD & VISUAL COMPARISON (HIGH CONTRAST PREMIUM CARD) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-[0_10px_35px_rgba(19,82,208,0.07)] flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Projected Growth Results</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                AI Growth Projection
              </span>
            </div>

            {/* 4 CORE METRICS CARDS */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Card 1: Projected Monthly Leads */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Estimated Monthly Leads
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#1352D0] flex items-baseline space-x-1">
                  <span>{calculations.projectedLeads}</span>
                  <span className="text-xs font-bold text-slate-500">leads/mo</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 block">
                  vs {currentLeads} current leads
                </span>
              </div>

              {/* Card 2: Growth Potential % */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Growth Potential
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  +{calculations.growthPercent}%
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 block">
                  Lead Surge Potential
                </span>
              </div>

              {/* Card 3: Estimated Revenue Growth */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Estimated Revenue Growth
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {calculations.revenueGrowth}
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 block">
                  Projected Annual Lift
                </span>
              </div>

              {/* Card 4: Estimated ROAS */}
              <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Estimated ROAS
                </span>
                <div className="text-2xl sm:text-3xl font-black text-violet-700">
                  {calculations.estimatedRoas}
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 block">
                  Target Ad Return
                </span>
              </div>

            </div>

            {/* VISUAL COMPARISON BARS */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Visual Lead Comparison
              </span>
              
              {/* Current Leads Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Current State</span>
                  <span>{currentLeads} Leads</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (currentLeads / (calculations.projectedLeads || 1)) * 100)}%` }}
                    className="h-full bg-slate-400 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Projected Leads Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#1352D0]">
                  <span>Projected with Sumit DigiTech</span>
                  <span>{calculations.projectedLeads} Leads (+{calculations.growthPercent}%)</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: '100%' }}
                    className="h-full bg-gradient-to-r from-[#1352D0] to-emerald-500 transition-all duration-500 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* CLAIM GROWTH CTA BUTTON */}
            <div className="space-y-3 pt-2">
              <button
                onClick={openAuditModal}
                className="w-full py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Claim This Growth - Get Free Audit</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-500 font-medium text-center leading-normal px-2">
                * Results are estimated projections and may vary based on market conditions, budget allocation, and campaign execution.
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
