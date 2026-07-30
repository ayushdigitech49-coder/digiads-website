import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Code2,
  PhoneCall,
  Sparkles,
  Star,
  Globe,
  Smartphone,
  Palette,
  ArrowRight,
  ShoppingBag,
  Store,
  Wrench,
  Monitor,
  Package
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { adminService } from '../../services/admin.service';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

const defaultMegaMenuColumns = [
  {
    id: 'col_digital_marketing',
    title: 'DIGITAL MARKETING',
    color: '#D91212',
    items: [
      { id: 'm1_1', title: 'Search Engine Optimization', path: '/services/seo-services', iconType: 'Search', iconBg: 'bg-blue-500/10 text-[#1352D0]' },
      { id: 'm1_2', title: 'Meta Ads Management', path: '/services/performance-marketing', iconType: 'text', textBadge: '∞', iconBg: 'bg-blue-500/10 text-blue-600' },
      { id: 'm1_3', title: 'Google Ads Management', path: '/services/performance-marketing', iconType: 'Globe', iconBg: 'bg-blue-500/10 text-blue-600' },
      { id: 'm1_4', title: 'Performance Marketing', path: '/services/performance-marketing', iconType: 'TrendingUp', iconBg: 'bg-red-500/10 text-[#D91212]' },
      { id: 'm1_5', title: 'Social Media Optimization', path: '/services/social-media-marketing', iconType: 'Smartphone', iconBg: 'bg-purple-500/10 text-purple-600' },
      { id: 'm1_6', title: 'Graphic Design', path: '/services/branding-and-design', iconType: 'Palette', iconBg: 'bg-pink-500/10 text-pink-600' },
    ]
  },
  {
    id: 'col_web_development',
    title: 'WEB DEVELOPMENT',
    color: '#D91212',
    items: [
      { id: 'm2_1', title: 'WordPress Development', path: '/services/web-development', iconType: 'badge', textBadge: 'W', iconBg: 'bg-blue-600 text-white' },
      { id: 'm2_2', title: 'Shopify Development', path: '/services/web-development', iconType: 'badge', textBadge: 'S', iconBg: 'bg-emerald-600 text-white' },
      { id: 'm2_3', title: 'WooCommerce Development', path: '/services/web-development', iconType: 'badge', textBadge: 'woo', iconBg: 'bg-purple-600 text-white' },
      { id: 'm2_4', title: 'Custom Web Development', path: '/services/web-development', iconType: 'Code2', iconBg: 'bg-blue-500/10 text-[#1352D0]' },
      { id: 'm2_5', title: 'Website Maintenance', path: '/services/web-development', iconType: 'Wrench', iconBg: 'bg-slate-100 text-slate-700' },
      { id: 'm2_6', title: 'Web Design', path: '/services/branding-and-design', iconType: 'Monitor', iconBg: 'bg-blue-500/10 text-[#1352D0]' },
    ]
  },
  {
    id: 'col_marketplace_management',
    title: 'MARKETPLACE MANAGEMENT',
    color: '#D91212',
    items: [
      { id: 'm3_1', title: 'Amazon Account Management', path: '/services/seo-services', iconType: 'badge', textBadge: 'a', iconBg: 'bg-amber-500/10 text-amber-600' },
      { id: 'm3_2', title: 'Flipkart Account Management', path: '/services/seo-services', iconType: 'badge', textBadge: 'fk', iconBg: 'bg-blue-500/10 text-blue-600' },
      { id: 'm3_3', title: 'Meesho Account Management', path: '/services/seo-services', iconType: 'badge', textBadge: 'm', iconBg: 'bg-pink-500/10 text-pink-600' },
      { id: 'm3_4', title: 'Shopify Account Management', path: '/services/web-development', iconType: 'badge', textBadge: 's', iconBg: 'bg-emerald-500/10 text-emerald-600' },
      { id: 'm3_5', title: 'Myntra Account Management', path: '/services/seo-services', iconType: 'badge', textBadge: 'M', iconBg: 'bg-purple-500/10 text-purple-600' },
      { id: 'm3_6', title: 'Amazon Product Listing', path: '/services/seo-services', iconType: 'Package', iconBg: 'bg-amber-500/10 text-amber-600' },
      { id: 'm3_7', title: 'Ecommerce Product Upload Listing', path: '/services/seo-services', iconType: 'ShoppingBag', iconBg: 'bg-slate-100 text-slate-700' },
    ]
  },
  {
    id: 'col_marketplace_onboarding',
    title: 'MARKETPLACE ONBOARDING SERVICES',
    color: '#D91212',
    items: [
      { id: 'm4_1', title: 'Blinkit Account Management & Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'b', iconBg: 'bg-yellow-400 text-slate-950' },
      { id: 'm4_2', title: 'Swiggy Instamart Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'si', iconBg: 'bg-orange-500 text-white' },
      { id: 'm4_3', title: 'Zepto Seller Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'Z', iconBg: 'bg-purple-600 text-white' },
      { id: 'm4_4', title: 'Ajio Seller Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'A', iconBg: 'bg-slate-900 text-white' },
      { id: 'm4_5', title: 'Tata Cliq Seller Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'tc', iconBg: 'bg-red-600 text-white' },
      { id: 'm4_6', title: 'Nykaa Seller Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'N', iconBg: 'bg-pink-500 text-white' },
      { id: 'm4_7', title: 'Myntra Seller Onboarding', path: '/services/seo-services', iconType: 'badge', textBadge: 'M', iconBg: 'bg-purple-500/10 text-purple-600' },
    ]
  }
];

interface MegaDropdownProps {
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaDropdown: React.FC<MegaDropdownProps> = ({ onClose, onMouseEnter, onMouseLeave }) => {
  const { openConsultationModal, openAuditModal } = useModal();
  const [columns, setColumns] = useState<any[]>(defaultMegaMenuColumns);

  useEffect(() => {
    const fetchMegaMenu = async () => {
      try {
        const res = await adminService.getMegaMenuConfig();
        if (res && res.success && Array.isArray(res.megaMenuConfig) && res.megaMenuConfig.length > 0) {
          setColumns(res.megaMenuConfig);
          localStorage.setItem('sumit_mega_menu_config', JSON.stringify(res.megaMenuConfig));
          return;
        }
      } catch (err) {
        console.warn('[MegaDropdown] Failed to fetch mega menu config:', err);
      }

      const saved = localStorage.getItem('sumit_mega_menu_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setColumns(parsed);
            return;
          }
        } catch {}
      }
      setColumns(defaultMegaMenuColumns);
    };

    fetchMegaMenu();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'mega_menu' || type === 'all') {
        fetchMegaMenu();
      }
    });
    return () => unsubscribe();
  }, []);

  const displayColumns = columns.length > 0 ? columns : defaultMegaMenuColumns;

  const renderIcon = (item: any) => {
    if (item.customIconUrl) {
      return (
        <img
          src={item.customIconUrl}
          alt=""
          className="w-7 h-7 rounded-lg object-contain shrink-0 group-hover:scale-110 transition-transform shadow-xs"
        />
      );
    }

    if (item.iconType === 'badge' || item.textBadge) {
      return (
        <div className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs ${item.iconBg || 'bg-blue-600 text-white'}`}>
          {item.textBadge || item.title.charAt(0)}
        </div>
      );
    }

    switch (item.iconType) {
      case 'Search':
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1352D0] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Search className="w-4 h-4 text-[#1352D0]" />
          </div>
        );
      case 'Globe':
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
        );
      case 'TrendingUp':
        return (
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-[#D91212] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4 text-[#D91212]" />
          </div>
        );
      case 'Smartphone':
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Smartphone className="w-4 h-4 text-purple-600" />
          </div>
        );
      case 'Palette':
        return (
          <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Palette className="w-4 h-4 text-pink-600" />
          </div>
        );
      case 'Code2':
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1352D0] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Code2 className="w-4 h-4 text-[#1352D0]" />
          </div>
        );
      case 'Wrench':
        return (
          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Wrench className="w-4 h-4 text-slate-700" />
          </div>
        );
      case 'Monitor':
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#1352D0] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Monitor className="w-4 h-4 text-[#1352D0]" />
          </div>
        );
      case 'Package':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case 'Store':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Store className="w-4 h-4 text-amber-600" />
          </div>
        );
      case 'ShoppingBag':
        return (
          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4 text-slate-700" />
          </div>
        );
      default:
        return (
          <div className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs ${item.iconBg || 'bg-blue-500/10 text-[#1352D0]'}`}>
            {item.title.charAt(0)}
          </div>
        );
    }
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 pt-4 w-[94vw] max-w-6xl z-50 pointer-events-auto"
    >
      <div className="w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-7 sm:p-8 animate-in fade-in slide-in-from-top-3 duration-200 text-slate-900 overflow-hidden font-sans relative">
      
      {/* Background Accent Soft Overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-100/50 via-blue-50/20 to-transparent rounded-bl-full pointer-events-none" />

      {/* 4-COLUMN DYNAMIC GRID MATCHING EXACT DASHBOARD CMS DATA & PRESERVING FULL BEAUTIFUL UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-slate-100 relative z-10">
        {displayColumns.map((col) => (
          <div key={col.id} className="space-y-3">
            <div className="pb-2 border-b border-slate-100">
              <h4 style={{ color: col.color || '#D91212' }} className="text-xs sm:text-sm font-black uppercase tracking-wider">
                {col.title}
              </h4>
            </div>

            <div className="space-y-1">
              {(col.items || []).map((item: any) => (
                <Link
                  key={item.id}
                  to={item.path || '/services'}
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center space-x-3 transition-colors group"
                >
                  {renderIcon(item)}
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-[#1352D0] transition-colors leading-tight">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Rating Badge */}
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <div className="text-xs font-semibold text-slate-700">
            <span className="font-extrabold text-slate-900">4.9 / 5.0</span>
            <span className="text-slate-500 ml-1">Trusted by 1000+ sellers across India</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              onClose();
              openAuditModal();
            }}
            className="px-5 py-2.5 bg-[#D91212] hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-lg shadow-red-600/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#F4B400]" />
            <span>Book Free Audit</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => {
              onClose();
              openConsultationModal();
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#1352D0]" />
            <span>Talk to an Expert</span>
          </button>
        </div>

      </div>

    </div>
  </div>
);
};
