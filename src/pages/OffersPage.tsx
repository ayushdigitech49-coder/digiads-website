import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { OffersSection } from '../components/sections/OffersSection';
import { SeoAuditModal } from '../components/common/SeoAuditModal';
import { Sparkles, Gift, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { Swal } from '../utils/swal.tsx';

export const OffersPage: React.FC = () => {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const handleClaimOffer = (code: string) => {
    Swal.fire({
      title: `Claim Offer Code: ${code}`,
      text: `Your promotional discount code ${code} is ready! Would you like to launch a free instant audit or connect with an account manager?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Run Free SEO Audit Now',
      cancelButtonText: 'Close',
      confirmButtonColor: 'bg-[#1352D0]',
    }).then(res => {
      if (res.isConfirmed) {
        setAuditModalOpen(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* HERO BANNER */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#061329] via-[#0D3BA1] to-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Gift className="w-4 h-4 text-[#F4B400]" />
            <span>Sumit DigiTech Growth Packages</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Special Agency Deals & Promotional Growth Bundles
          </h1>

          <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Save up to 40% on Enterprise SEO, Google Ads PPC setup, and Custom E-commerce Development with full ROAS SLAs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-bold text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Rank SLA</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#F4B400]" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Free Technical Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS SECTION COMPONENT */}
      <OffersSection onClaimOffer={handleClaimOffer} />

      {/* FAQ / REASSURANCE */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-black uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Offer Terms & Redemption</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How do I redeem my discount coupon code?', a: 'Simply copy the promo code (e.g. GROWTH40) and enter it during your free audit consultation call or online checkout.' },
              { q: 'Are these offers applicable for new clients?', a: 'Yes! All packages are designed specifically for new brands looking to scale lead generation and organic rankings.' },
              { q: 'Can I combine multiple offer codes?', a: 'Offers are valid for 1 package per business domain to ensure maximum dedicated account manager resources.' },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <h3 className="text-sm font-black text-white">{faq.q}</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL SEO AUDIT MODAL */}
      <SeoAuditModal isOpen={auditModalOpen} onClose={() => setAuditModalOpen(false)} />
    </div>
  );
};
