import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Globe, User, Mail, Phone, ArrowRight, CheckCircle2,
  TrendingUp, ShieldCheck, Search, Loader2, Award
} from 'lucide-react';
import { Swal } from '../../utils/swal.tsx';
import { adminService } from '../../services/admin.service';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

interface SeoAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIndustry?: string;
}

export const SeoAuditModal: React.FC<SeoAuditModalProps> = ({ isOpen, onClose, defaultIndustry = '' }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState(defaultIndustry || 'Digital Marketing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactMethod, setContactMethod] = useState<'WhatsApp' | 'Phone Call'>('WhatsApp');
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStatus, setScanStatus] = useState('Initializing AI Audit...');

  useEffect(() => {
    if (defaultIndustry) setIndustry(defaultIndustry);
  }, [defaultIndustry]);

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) {
      Swal.toast('Please enter your Website URL', 'warning');
      return;
    }
    setStep(2);
  };

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      Swal.toast('Please fill in all contact fields', 'warning');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      Swal.fire({
        title: 'Invalid Mobile Number',
        text: 'Please enter a valid 10-digit mobile number (e.g. 9829012345).',
        icon: 'warning',
        confirmButtonColor: 'bg-[#1352D0]'
      });
      return;
    }

    setAnalyzing(true);
    setScanStatus('Scanning Meta Tags & H1 Headings...');
    
    setTimeout(() => {
      setScanStatus('Analyzing Keyword Velocity & Backlink Gaps...');
    }, 600);

    setTimeout(() => {
      setScanStatus('Checking Mobile Page Speed & Technical SLA...');
    }, 1200);

    setTimeout(async () => {
      try {
        await adminService.createLead({
          fullName: name,
          name,
          email,
          phone: cleanPhone,
          contactMethod,
          websiteUrl,
          serviceRequired: 'Free Instant SEO Audit',
          service: 'Free Instant SEO Audit',
          message: `Website URL: ${websiteUrl} | Target Industry: ${industry} | Preferred Contact: ${contactMethod}`,
          source: 'Free SEO Audit Modal'
        });
        notifyCmsUpdate('leads');
      } catch (err) {
        console.warn('[SeoAuditModal] Lead submission fallback:', err);
      }

      setAnalyzing(false);
      setStep(3);
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setWebsiteUrl('');
    setName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#061329] via-[#0D3BA1] to-[#1352D0] p-6 sm:p-8 text-white relative">
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
              <Sparkles className="w-3 h-3 text-[#F4B400]" />
              <span>Instant AI SEO Audit</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Get Your Free Instant Website Growth Report
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
              Uncover technical gaps, keyword velocity, and 10× revenue growth opportunities.
            </p>

            {/* Step Progress Bar */}
            <div className="flex items-center space-x-2 mt-4">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#F4B400]' : 'bg-white/20'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#F4B400]' : 'bg-white/20'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-400' : 'bg-white/20'}`} />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 bg-white">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                <div>
                  <label htmlFor="seo-audit-url" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Website URL *
                  </label>
                  <div className="relative">
                    <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      id="seo-audit-url"
                      required
                      type="text"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="e.g. www.yourbrand.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="seo-audit-industry" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Industry Sector
                  </label>
                  <select
                    id="seo-audit-industry"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="IT & SaaS">IT & SaaS Companies</option>
                    <option value="Automobile">Automobile Industry</option>
                    <option value="E-commerce">E-commerce & Online Retail</option>
                    <option value="Finance & Fintech">Finance & Fintech</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Logistics & Transport">Logistics & Transport</option>
                    <option value="Education & Institutes">Education & Institutes</option>
                    <option value="Travel & Tourism">Travel & Tourism</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Events & Entertainment">Events & Entertainment</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Legal & Consulting">Legal & Consulting Services</option>
                    <option value="Other">Other Domain</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all"
                  >
                    <span>Next: Get Growth Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitAudit} className="space-y-4">
                {analyzing ? (
                  <div className="py-8 text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-[#1352D0] animate-spin mx-auto" />
                    <div>
                      <div className="text-base font-black text-slate-900">{scanStatus}</div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Generating customized 10× revenue growth roadmap for {websiteUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs font-bold text-blue-900 mb-2">
                      <span className="truncate">Auditing: {websiteUrl}</span>
                      <button type="button" onClick={() => setStep(1)} className="text-[#1352D0] font-black underline shrink-0">Edit</button>
                    </div>

                    <div>
                      <label htmlFor="seo-audit-name" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                        <input id="seo-audit-name" required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sumit Sharma" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="seo-audit-email" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Business Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                        <input id="seo-audit-email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sumit@brand.com" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="seo-audit-phone" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Mobile Number (10 Digits Only) *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                        <input
                          id="seo-audit-phone"
                          required
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                          placeholder="e.g. 9829012345 (10 digits)"
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-[#1352D0]"
                        />
                      </div>
                      {phone && phone.length !== 10 && (
                        <p className="text-[11px] font-bold text-amber-600 mt-1 flex items-center space-x-1">
                          <span>⚠️ Enter exactly 10 digits ({phone.length}/10)</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Preferred Contact Channel *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setContactMethod('WhatsApp')}
                          className={`py-3 px-4 rounded-2xl border text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                            contactMethod === 'WhatsApp'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-base">💬</span>
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactMethod('Phone Call')}
                          className={`py-3 px-4 rounded-2xl border text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                            contactMethod === 'Phone Call'
                              ? 'bg-blue-50 text-[#1352D0] border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-base">📞</span>
                          <span>Phone Call</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all"
                      >
                        <Search className="w-4 h-4" />
                        <span>Run Free Instant SEO Audit</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {step === 3 && (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Audit Request Received!</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-sm mx-auto">
                    Our Senior SEO Strategist is analyzing <strong>{websiteUrl}</strong>. Your detailed report will be sent to <strong>{email}</strong> within 15 minutes!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
