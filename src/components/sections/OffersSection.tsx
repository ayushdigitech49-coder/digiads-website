import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, Clock, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export interface OfferItem {
  id: string;
  title: string;
  category: string;
  discountText: string;
  validityText: string;
  couponCode: string;
  badge: string;
  gradient?: string;
  features: string[];
  visible?: boolean;
}

export const defaultOffers: OfferItem[] = [
  {
    id: 'off_seo_40',
    title: '40% OFF SEO SETUP',
    category: 'FULL GROWTH PACKAGE',
    discountText: 'FLAT 40% OFF',
    validityText: 'Valid for next 48 hours',
    couponCode: 'GROWTH40',
    badge: 'HOT DEAL',
    gradient: 'from-blue-600 via-indigo-600 to-blue-900',
    features: [
      'Full technical SEO audit, Google My Business boost, and 30 target keywords',
      'High-authority backlink outreach (DR 60+)',
      'Programmatic Schema Markup',
      'Dedicated Account Manager'
    ]
  },
  {
    id: 'off_ecomm_15k',
    title: 'FLAT ₹15,000 OFF',
    category: 'E-COMMERCE STORE LAUNCH BOOSTER',
    discountText: 'SAVE ₹15,000',
    validityText: 'Only 5 slots left',
    couponCode: 'ECOMM15K',
    badge: 'LIMITED SLOTS',
    gradient: 'from-emerald-600 via-teal-700 to-emerald-950',
    features: [
      'Custom Shopify or WooCommerce development with mobile-first checkout and speed optimization',
      'Custom UI/UX Theme & Payment Gateway Setup',
      'WhatsApp Chat Automation & 1-Yr Hosting'
    ]
  },
  {
    id: 'off_ppc_boost',
    title: 'FREE COMPETITOR BREAKDOWN',
    category: 'GOOGLE ADS & PPC LEAD ACCELERATOR',
    discountText: 'FREE AUDIT',
    validityText: 'Expires end of month',
    couponCode: 'PPCBOOST',
    badge: 'HIGH ROAS',
    gradient: 'from-purple-600 via-indigo-800 to-slate-950',
    features: [
      'Get a full audit of your competitor PPC ads plus ₹5,000 match credits on Google Ads management',
      'Competitor Keyword Spy & High-Converting Landing Page',
      'Negative Keyword Filter & Weekly Lead Reports'
    ]
  }
];

interface OffersSectionProps {
  onClaimOffer?: (coupon: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onClaimOffer }) => {
  const [items, setItems] = useState<OfferItem[]>(defaultOffers);

  const fetchOffersData = async () => {
    try {
      const res = await adminService.getOffers();
      if (res && res.success && Array.isArray(res.offers) && res.offers.length > 0) {
        setItems(res.offers.filter((it: any) => it.visible !== false));
      } else {
        const saved = localStorage.getItem('sumit_offers_cms');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setItems(parsed.filter((it: any) => it.visible !== false));
          } catch {}
        }
      }
    } catch {
      // Fallback local list
    }
  };

  useEffect(() => {
    fetchOffersData();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'offers' || type === 'all') {
        fetchOffersData();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 bg-[linear-gradient(135deg,#061329_0%,#0A1F47_50%,#061329_100%)] text-white relative overflow-hidden border-b border-blue-900/60">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-[#1352D0]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Tag className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Exclusive Agency Packages</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Limited-Time Strategic Growth Offers
          </h2>
          <p className="text-blue-100 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
            Claim verified promo packages engineered to maximize lead velocity and revenue ROI.
          </p>
        </div>

        {/* OFFERS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((offer, idx) => (
            <motion.div
              key={offer.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-3xl bg-gradient-to-br ${
                offer.gradient || 'from-blue-600 via-indigo-600 to-blue-900'
              } p-7 border border-white/20 shadow-2xl flex flex-col justify-between relative group hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="space-y-5">
                {/* Header Tag & Timer */}
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md uppercase tracking-wider text-[10px]">
                    {offer.badge}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[#F4B400]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{offer.validityText}</span>
                  </div>
                </div>

                {/* Offer Title & Discount */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1">
                    {offer.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {offer.title}
                  </h3>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-3 pt-3 border-t border-white/15">
                  {(offer.features || []).map((feat, fidx) => (
                    <li key={fidx} className="flex items-start space-x-2.5 text-xs text-blue-100 font-medium leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coupon Bar & Action Button */}
              <div className="pt-6 mt-6 border-t border-white/15 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Coupon Code</span>
                  <span className="text-sm font-black text-[#F4B400] font-mono tracking-widest">{offer.couponCode}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onClaimOffer && onClaimOffer(offer.couponCode)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer group/btn"
                >
                  <span>Claim Package Now</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
