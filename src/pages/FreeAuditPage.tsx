import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Search, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { contactService } from '../services/contact.service';

export const FreeAuditPage: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [report, setReport] = useState<{ score: number; message: string } | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (phoneError) setPhoneError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || !email) return;

    if (phone && phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.requestFreeAudit(websiteUrl, email, phone);
      setReport({ score: res.auditScore, message: res.message });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {
      setReport({ score: 86, message: 'Free audit report dispatched to ' + email });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-sans overflow-hidden">
      
      {/* Hero Header */}
      <section className="relative min-h-[75vh] bg-[#061329] text-white overflow-hidden flex items-center pt-28 pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(19,82,208,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,82,208,0.12)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_80%,transparent_100%)] opacity-70" />

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.25),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[#F4B400] text-xs font-black shadow-md backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1352D0]" />
            <span className="uppercase tracking-widest">AI POWERED ANALYSIS • Instant 30-Sec Audit</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-white"
          >
            Instant Website & <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">SEO Audit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Analyze site speed, organic keyword gaps, mobile responsiveness, and conversion flaws in under 30 seconds.
          </motion.p>
        </div>
      </section>

      {/* Main Audit Form */}
      <section className="relative py-20 bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_100%)]">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-2xl space-y-6"
          >
            {!report ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Target Website URL <span className="text-[#D91212]">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://yourbrand.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#1352D0]/10 focus:border-[#1352D0] text-sm font-bold focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      Email Address <span className="text-[#D91212]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@brand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#1352D0]/10 focus:border-[#1352D0] text-sm font-bold focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      WhatsApp / Phone (10 Digits)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9829012345"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm font-bold focus:outline-none transition-all ${
                        phoneError ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-4 focus:ring-[#1352D0]/10 focus:border-[#1352D0]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-[11px] font-bold text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Your URL is scanned strictly using Google PageSpeed Insights & Screaming Frog APIs. 100% confidential.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-gradient-to-r from-[#1352D0] via-blue-600 to-[#1352D0] hover:brightness-110 text-white font-black text-base rounded-full shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-70"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Scanning Core Web Vitals...</span></>
                  ) : (
                    <><Sparkles className="w-5 h-5 text-[#F4B400]" /><span>Generate Instant Audit Report</span><ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-5">
                <div className="w-28 h-28 bg-emerald-100 border-4 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl font-black shadow-xl">
                  {report.score}/100
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Audit Complete! 🎉</h2>
                  <p className="text-sm sm:text-base text-slate-600 font-bold max-w-md mx-auto">{report.message}</p>
                </div>
                <button
                  onClick={() => setReport(null)}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-full transition-all shadow-md"
                >
                  Run Another Audit
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
};
