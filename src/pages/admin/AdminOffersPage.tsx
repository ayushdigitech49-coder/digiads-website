import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Plus, Edit2, Trash2, Check, X, Eye, EyeOff, Sparkles,
  ChevronUp, ChevronDown, Tag, Clock, Award
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export interface OfferItemCMS {
  id: string;
  title: string;
  category: string;
  discountText: string;
  validityText: string;
  couponCode: string;
  badge: string;
  gradient: string;
  features: string[];
  visible: boolean;
  order: number;
}

export const defaultOffersListCMS: OfferItemCMS[] = [
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
    ],
    visible: true,
    order: 1
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
    ],
    visible: true,
    order: 2
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
    ],
    visible: true,
    order: 3
  }
];

export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<OfferItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfferItemCMS | null>(null);

  const [form, setForm] = useState<{
    title: string;
    category: string;
    discountText: string;
    validityText: string;
    couponCode: string;
    badge: string;
    gradient: string;
    features: string[];
  }>({
    title: '',
    category: 'SPECIAL PROMO',
    discountText: '25% OFF',
    validityText: 'Valid for next 48 hours',
    couponCode: 'PROMO25',
    badge: 'HOT DEAL',
    gradient: 'from-blue-600 via-indigo-600 to-blue-900',
    features: [],
  });

  const [featureInput, setFeatureInput] = useState('');

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOffers();
      if (res && res.success && Array.isArray(res.offers) && res.offers.length > 0) {
        setOffers(res.offers);
        localStorage.setItem('sumit_offers_cms', JSON.stringify(res.offers));
      } else {
        const saved = localStorage.getItem('sumit_offers_cms');
        if (saved) {
          try { setOffers(JSON.parse(saved)); } catch { setOffers(defaultOffersListCMS); }
        } else {
          setOffers(defaultOffersListCMS);
        }
      }
    } catch {
      setOffers(defaultOffersListCMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const saveOffersToBackend = async (newList: OfferItemCMS[]) => {
    setOffers(newList);
    localStorage.setItem('sumit_offers_cms', JSON.stringify(newList));
    setIsSaving(true);
    try {
      await adminService.updateOffers(newList);
    } catch (err) {
      console.warn('[AdminOffersPage] Backend update fallback:', err);
    }
    notifyCmsUpdate('offers');
    setIsSaving(false);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'SPECIAL PROMO',
      discountText: '30% OFF',
      validityText: 'Valid for 48 hours',
      couponCode: 'SAVE30',
      badge: 'SPECIAL DEAL',
      gradient: 'from-blue-600 via-indigo-600 to-blue-900',
      features: ['10x Lead Generation Setup', 'Dedicated Strategy Call'],
    });
    setFeatureInput('');
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: OfferItemCMS) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      discountText: item.discountText || '',
      validityText: item.validityText || '',
      couponCode: item.couponCode || '',
      badge: item.badge || 'HOT DEAL',
      gradient: item.gradient || 'from-blue-600 via-indigo-600 to-blue-900',
      features: item.features || [],
    });
    setFeatureInput('');
    setDrawerOpen(true);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm({ ...form, features: [...form.features, featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.couponCode) {
      Swal.toast('Please fill in Offer Title & Coupon Code', 'warning');
      return;
    }

    let newList = [...offers];
    if (editingItem) {
      newList = newList.map(it => it.id === editingItem.id ? { ...it, ...form } : it);
    } else {
      const newId = `off_${Date.now()}`;
      newList.push({
        id: newId,
        ...form,
        visible: true,
        order: newList.length + 1,
      });
    }

    await saveOffersToBackend(newList);
    setDrawerOpen(false);
    Swal.toast(editingItem ? 'Special Offer package updated!' : 'New Special Offer added!', 'success');
  };

  const handleToggleVisible = async (id: string) => {
    const newList = offers.map(it => it.id === id ? { ...it, visible: !it.visible } : it);
    await saveOffersToBackend(newList);
    Swal.toast('Visibility toggled', 'info');
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Special Offer?',
      text: 'Are you sure you want to remove this promo offer package?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Offer',
      confirmButtonColor: 'bg-red-600',
    });

    if (confirm.isConfirmed) {
      const newList = offers.filter(it => it.id !== id);
      await saveOffersToBackend(newList);
      Swal.toast('Special Offer deleted', 'success');
    }
  };

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= offers.length) return;
    const newList = [...offers];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    newList.forEach((item, idx) => { item.order = idx + 1; });
    await saveOffersToBackend(newList);
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans text-slate-900 pb-16">
      
      {/* PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061329] via-[#0D3BA1] to-[#1352D0] text-white p-6 sm:p-9 shadow-2xl border border-blue-500/20">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Gift className="w-8 h-8 text-[#F4B400]" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-[#F4B400]" />
                <span>Promotional Agency Deals</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Special Offers & Deals CMS</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1.5 max-w-2xl leading-relaxed">
                Add, edit, show/hide, and re-order promo discount packages (GROWTH40, ECOMM15K, PPCBOOST). Changes reflect live instantly!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add New Offer Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* OFFERS CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl bg-white border shadow-sm space-y-4 relative flex flex-col justify-between ${
              item.visible ? 'border-slate-200/90' : 'border-slate-300 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  {item.badge}
                </span>

                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer" title="Move Up"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === offers.length - 1} className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer" title="Move Down"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-[#1352D0] tracking-wider block">{item.category}</span>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-700 font-mono">CODE: {item.couponCode}</span>
                </div>
              </div>

              <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                {(item.features || []).map((f, fi) => (
                  <li key={fi} className="text-xs text-slate-600 font-medium flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleVisible(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 border cursor-pointer ${
                  item.visible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{item.visible ? 'Visible' : 'Hidden'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button onClick={() => handleOpenEdit(item)} className="p-2 rounded-xl bg-blue-50 text-[#1352D0] hover:bg-[#1352D0] hover:text-white transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-50 text-[#D91212] hover:bg-[#D91212] hover:text-white transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DRAWER FORM */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
            >
              <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">Offers CMS</div>
                  <h3 className="text-lg font-black text-slate-900">{editingItem ? 'Edit Special Offer' : 'Add Special Offer'}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Offer Title / Discount Headline *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. 40% OFF SEO SETUP or FLAT ₹15,000 OFF" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Category Subhead</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. FULL GROWTH PACKAGE" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Coupon Code *</label>
                  <input required value={form.couponCode} onChange={e => setForm({ ...form, couponCode: e.target.value })} placeholder="e.g. GROWTH40" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-[#1352D0] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Validity Timer / Slot Text</label>
                  <input value={form.validityText} onChange={e => setForm({ ...form, validityText: e.target.value })} placeholder="e.g. Valid for next 48 hours or Only 5 slots left" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Badge Text</label>
                  <input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. HOT DEAL or LIMITED SLOTS" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Deliverables / Feature Bullet Points</label>
                  <div className="flex space-x-2 mb-2">
                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Add feature point..." className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none" />
                    <button type="button" onClick={addFeature} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shrink-0">Add</button>
                  </div>
                  <ul className="space-y-1.5">
                    {form.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium">
                        <span>{feat}</span>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700 p-1"><X className="w-3.5 h-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer">
                    <Check className="w-4 h-4" /><span>{editingItem ? 'Update Offer' : 'Save Offer'}</span>
                  </button>
                </div>
              </form>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
