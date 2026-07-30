import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  Check,
  Award,
  Globe,
  Smartphone,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Mail,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Search
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { pricingPlans } from '../../data/pricingData';
import type { PricingPlan } from '../../types';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate, notifyCmsUpdate } from '../../utils/broadcastSync';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+974', flag: '🇶🇦', country: 'Qatar' },
];

export const GrowthCalculatorSection: React.FC = () => {
  const { openConsultationModal } = useModal();

  // Dynamic Pricing Plans from CMS
  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('sumit_pricing_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return pricingPlans;
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await adminService.getPricingPlans();
        if (res && res.success && Array.isArray(res.pricingPlans) && res.pricingPlans.length > 0) {
          setPlans(res.pricingPlans);
          localStorage.setItem('sumit_pricing_plans', JSON.stringify(res.pricingPlans));
        }
      } catch {}
    };

    fetchPlans();
    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'pricing' || type === 'all') {
        fetchPlans();
      }
    });

    return () => unsubscribe();
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [websiteType, setWebsiteType] = useState<string>('Business / Service Website');
  const [targetLocation, setTargetLocation] = useState<string>('National, Country');
  const [keywordTier, setKeywordTier] = useState<string>('10 to 15');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('auto');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic Tech Stack Detector
  const detectedTech = useMemo(() => {
    if (!websiteUrl || websiteUrl.trim().length < 4) return null;
    const url = websiteUrl.toLowerCase();
    if (url.includes('wp') || url.includes('wordpress') || url.includes('elementor')) {
      return { name: 'WordPress & Elementor CMS', icon: '⚡', category: 'CMS', seoScore: '94/100' };
    }
    if (url.includes('shopify') || url.includes('store') || url.includes('buy') || url.includes('cart')) {
      return { name: 'Shopify E-Commerce Platform', icon: '🛍️', category: 'E-Commerce', seoScore: '92/100' };
    }
    if (url.includes('next') || url.includes('react') || url.includes('vercel') || url.includes('app') || url.includes('io')) {
      return { name: 'React / Next.js Headless Web Stack', icon: '🚀', category: 'Headless Framework', seoScore: '98/100' };
    }
    if (url.includes('wix') || url.includes('squarespace')) {
      return { name: 'Site Builder (Wix / Squarespace)', icon: '🌐', category: 'Website Builder', seoScore: '85/100' };
    }
    return { name: 'Custom HTML5 & PHP Infrastructure', icon: '💻', category: 'Custom Web App', seoScore: '90/100' };
  }, [websiteUrl]);

  // Dynamic Estimated Cost & Recommended Package Calculation
  const calculation = useMemo(() => {
    let basePrice = 5000;
    let recPlanId = 'starter-seo';

    // Location Multiplier
    if (targetLocation.includes('National')) {
      basePrice = 8000;
      recPlanId = 'growth-seo';
    } else if (targetLocation.includes('International')) {
      basePrice = 15000;
      recPlanId = 'advanced-seo';
    }

    // Keyword Tier Adjustments
    if (keywordTier.includes('5 to 10')) {
      if (basePrice < 5000) basePrice = 5000;
    } else if (keywordTier.includes('10 to 15')) {
      if (basePrice < 8000) basePrice = 8000;
      recPlanId = recPlanId === 'starter-seo' ? 'growth-seo' : recPlanId;
    } else if (keywordTier.includes('15 to 30')) {
      basePrice = Math.max(basePrice, 10000);
      recPlanId = 'advanced-seo';
    } else if (keywordTier.includes('30 to 50')) {
      basePrice = Math.max(basePrice, 18000);
      recPlanId = 'advanced-seo';
    }

    // Website Type Multipliers
    if (websiteType.includes('Ecommerce')) {
      basePrice = Math.round(basePrice * 1.25);
    } else if (websiteType.includes('Custom')) {
      basePrice = Math.round(basePrice * 1.35);
    }

    // Override if user selected specific package from Dropdown
    if (selectedPackageId !== 'auto') {
      recPlanId = selectedPackageId;
      const customSelected = plans.find(p => p.id === selectedPackageId);
      if (customSelected && customSelected.priceMonthly) {
        basePrice = customSelected.priceMonthly;
      }
    }

    const matchedPlan = plans.find(p => p.id === recPlanId) || plans[1] || plans[0];

    return {
      monthlyEstimate: basePrice.toLocaleString('en-IN'),
      plan: matchedPlan,
      keywordCount: keywordTier,
    };
  }, [websiteType, targetLocation, keywordTier, selectedPackageId, plans]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !websiteUrl) {
      alert('Please fill in all required fields (Name, Email, Phone Number, and Website URL).');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      alert('Please enter a valid phone number (between 7 and 15 digits).');
      return;
    }

    setIsSubmitting(true);

    const leadData = {
      id: 'lead-' + Date.now(),
      name,
      email,
      phone: `${countryCode} ${phone}`,
      city: city || 'Not specified',
      websiteType,
      targetLocation,
      keywordTier,
      websiteUrl,
      message,
      techStack: detectedTech ? detectedTech.name : 'Unknown',
      estimatedBudget: `₹${calculation.monthlyEstimate}/month`,
      recommendedPackage: calculation.plan.name,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    // Save to local storage for instant dashboard updates
    try {
      const existing = JSON.parse(localStorage.getItem('sumit_leads') || '[]');
      localStorage.setItem('sumit_leads', JSON.stringify([leadData, ...existing]));
      notifyCmsUpdate('leads');

      // Also dispatch to backend API if available
      await adminService.createLead({
        name,
        email,
        phone: `${countryCode} ${phone}`,
        company: websiteUrl,
        service: `SEO Cost Calculator (${websiteType})`,
        budget: `₹${calculation.monthlyEstimate}/mo`,
        message: `City: ${city} | Target: ${targetLocation} | Keywords: ${keywordTier} | Tech: ${detectedTech?.name || 'N/A'} | Note: ${message}`
      });
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="seo-calculator" className="py-16 sm:py-24 bg-gradient-to-b from-[#0F172A] via-[#1D2B53] to-[#0F172A] text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#1352D0]/30 to-purple-600/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
    

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            Get your Affordable approx. <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">SEO Cost Quickly</span> within 1 Min in your Email
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-medium">
            Fill in your website details below to receive a personalized SEO budget breakdown, target keyword recommendations, and technology analysis.
          </p>
        </div>

        {/* MAIN CALCULATOR CONTAINER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT FORM PANEL (7 COLS) */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 relative">
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">SEO Cost Breakdown Prepared!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900">{name}</strong>! Your estimated SEO investment breakdown has been generated and sent to <span className="text-[#1352D0] font-extrabold">{email}</span>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Estimated Investment:</span>
                    <span className="text-emerald-600 font-extrabold text-sm">₹{calculation.monthlyEstimate} / month</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Recommended Package:</span>
                    <span className="text-[#1352D0] font-extrabold">{calculation.plan.name}</span>
                  </div>
                  {detectedTech && (
                    <div className="flex justify-between font-bold text-slate-700 pt-1 border-t border-slate-200">
                      <span>Detected Technology:</span>
                      <span className="text-purple-700 font-extrabold">{detectedTech.name}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-slate-900 text-white font-extrabold text-xs inline-flex items-center space-x-2 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
                >
                  <span>← Calculate for Another Website</span>
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* NAME & EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* PHONE WITH COUNTRY CODE & CITY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="w-24 sm:w-28 px-2.5 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-800 focus:bg-white focus:border-[#1352D0] focus:outline-none cursor-pointer shrink-0 appearance-none"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code + c.country} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Your Phone"
                        className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Your City"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* WEBSITE TYPE */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                    What is the type of your website? <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'Personal Website',
                      'Business / Service Website',
                      'Ecommerce Website',
                      'Custom Website'
                    ].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          websiteType === type
                            ? 'bg-blue-50/90 border-[#1352D0] text-[#1352D0] font-black shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                        }`}
                      >
                        <input
                          type="radio"
                          name="websiteType"
                          checked={websiteType === type}
                          onChange={() => setWebsiteType(type)}
                          className="w-4 h-4 text-[#1352D0] focus:ring-[#1352D0]"
                        />
                        <span className="text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* LOCATION & KEYWORDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* TARGET AUDIENCE LOCATION */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                      Target audience Location <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        'Local, city',
                        'National, Country',
                        'International, More then One Country'
                      ].map((loc) => (
                        <label
                          key={loc}
                          className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            targetLocation === loc
                              ? 'bg-blue-50/90 border-[#1352D0] text-[#1352D0] font-black shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetLocation"
                            checked={targetLocation === loc}
                            onChange={() => setTargetLocation(loc)}
                            className="w-4 h-4 text-[#1352D0] focus:ring-[#1352D0]"
                          />
                          <span className="text-xs">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* KEYWORDS TO TARGET */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                      Keywords to Target <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        '5 to 10 Keywords',
                        '10 to 15 Keywords',
                        '15 to 30 Keywords',
                        '30 to 50 Keywords'
                      ].map((kw) => (
                        <label
                          key={kw}
                          className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            keywordTier === kw
                              ? 'bg-blue-50/90 border-[#1352D0] text-[#1352D0] font-black shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                          }`}
                        >
                          <input
                            type="radio"
                            name="keywordTier"
                            checked={keywordTier === kw}
                            onChange={() => setKeywordTier(kw)}
                            className="w-4 h-4 text-[#1352D0] focus:ring-[#1352D0]"
                          />
                          <span className="text-xs">{kw}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* PREFERRED SEO PACKAGE DROPDOWN */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Select Preferred SEO Package</span>
                
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedPackageId}
                      onChange={e => setSelectedPackageId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="auto">✨ Auto-Recommend Best Package Based on Requirements</option>
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>
                          🔹 {p.name} — ₹{p.priceMonthly ? p.priceMonthly.toLocaleString('en-IN') : 'Custom'}/month ({p.description || p.highlight || 'Guaranteed Indexing & Ranking'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WEBSITE URL WITH REAL-TIME TECH DETECTOR */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Website URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="e.g. https://yourcompany.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                    />
                  </div>

                  {/* REAL-TIME DYNAMIC TECH STACK BADGE */}
                  {detectedTech && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{detectedTech.icon}</span>
                        <div className="text-xs font-black text-purple-950 flex items-center space-x-1.5">
                          <span>Detected Tech: {detectedTech.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-purple-200 text-purple-800 text-[10px] font-extrabold">
                            {detectedTech.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Write your Message
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write Your Message here..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00C853] hover:bg-[#00E676] active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-green-500/25 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Calculating SEO Cost...</span>
                  ) : (
                    <>
                      <span>Get SEO Cost</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* RIGHT SIDE: LIVE ESTIMATE & RECOMMENDED CMS PACKAGE (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* LIVE PRICE BREAKDOWN CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    SEO Investment Estimate
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  Instant Quote
                </span>
              </div>

              {/* MONTHLY ESTIMATE DISPLAY */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Monthly Investment:
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline space-x-2">
                  <span className="text-emerald-400">₹{calculation.monthlyEstimate}</span>
                  <span className="text-sm font-bold text-slate-400">/ month</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 pt-1">
                  Targeting <strong>{keywordTier}</strong> in <strong>{targetLocation}</strong>
                </div>
              </div>

              {/* RECOMMENDED PACKAGE CARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-indigo-950/60 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase text-blue-400 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Recommended CMS Package:</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase">
                    Best Match
                  </span>
                </div>

                <div className="text-xl font-black text-white">
                  {calculation.plan.name}
                </div>

                <ul className="space-y-2 pt-1 text-xs text-slate-300 font-medium">
                  {calculation.plan.features.slice(0, 5).map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WHY CHOOSE SUMIT DIGITECH GUARANTEES */}
              <div className="space-y-3 pt-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center space-x-2.5 text-slate-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>30-40% Indexing & Keyword Ranking Guarantee</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-200 font-bold">
                  <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>AI Search & Google AI Overviews Optimization</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Account Manager & Bi-weekly Audit Reports</span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() => openConsultationModal()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1352D0] to-blue-600 hover:from-blue-600 hover:to-[#1352D0] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Book Free 1-on-1 SEO Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Also export as SeoCalculatorSection alias for maximum compatibility
export const SeoCalculatorSection = GrowthCalculatorSection;
