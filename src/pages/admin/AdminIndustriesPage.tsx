import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Plus, Edit2, Trash2, Check, X, Eye, EyeOff, Sparkles,
  ChevronUp, ChevronDown, Layers, HeartPulse, Building, GraduationCap, Scale,
  Cpu, Car, ShoppingBag, Landmark, Truck, Plane, Film, Utensils, Award
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export interface IndustryItemCMS {
  id: string;
  name: string;
  badge: string;
  stat: string;
  description: string;
  iconType: string;
  color?: string;
  badgeBg?: string;
  visible: boolean;
  order: number;
}

export const defaultIndustriesList: IndustryItemCMS[] = [
  { id: 'ind_healthcare', name: 'Healthcare & Wellness', badge: 'PATIENT TRUST', stat: '+320% Leads Generated', description: 'Hospital & clinic GMB rankings, doctor branding, patient appointment funnels.', iconType: 'HeartPulse', color: 'text-rose-600', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200', visible: true, order: 1 },
  { id: 'ind_realestate', name: 'Real Estate & PropTech', badge: 'HIGH CLOSING', stat: '₹14.2Cr Revenue Closed', description: 'High-ticket buyer ads, 3D property tour funnels, and lead qualification engines.', iconType: 'Building', color: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', visible: true, order: 2 },
  { id: 'ind_education', name: 'Education & Institutes', badge: 'ADMISSIONS 10X', stat: '180K Organic Traffic', description: 'Student recruitment ads, university landing pages, and skill course lead funnels.', iconType: 'GraduationCap', color: 'text-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200', visible: true, order: 3 },
  { id: 'ind_legal', name: 'Legal & Consulting Services', badge: 'HIGH VALUE CASES', stat: '420+ Qualified Leads', description: 'Law firm reputation management, corporate client acquisition, search trust signals.', iconType: 'Scale', color: 'text-slate-700', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300', visible: true, order: 4 },
  { id: 'ind_saas', name: 'IT & SaaS Companies', badge: 'HIGH ROAS', stat: '+340% MRR Growth', description: 'B2B lead generation, product-led SEO, and CAC optimization for cloud platforms.', iconType: 'Cpu', color: 'text-blue-600', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200', visible: true, order: 5 },
  { id: 'ind_automobile', name: 'Automobile Industry', badge: 'LOCAL DOMINANCE', stat: '10× Dealership Leads', description: 'Hyper-targeted Google Ads, local SEO, and showroom test-drive booking funnels.', iconType: 'Car', color: 'text-red-600', badgeBg: 'bg-red-50 text-red-700 border-red-200', visible: true, order: 6 },
  { id: 'ind_ecommerce', name: 'E-commerce & Online Retail', badge: 'MAX CONVERSIONS', stat: '8.4× Average ROAS', description: 'Shopify & WooCommerce scale-up, Shopping Ads, and revenue conversion optimization.', iconType: 'ShoppingBag', color: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', visible: true, order: 7 },
  { id: 'ind_fintech', name: 'Finance & Fintech', badge: 'TRUST BUILDER', stat: '50k+ Qualified Leads', description: 'Compliant digital marketing, loan/investment lead generation, and search authority.', iconType: 'Landmark', color: 'text-purple-600', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200', visible: true, order: 8 },
  { id: 'ind_beauty', name: 'Beauty & Personal Care', badge: 'VIRAL BRANDING', stat: '4.2M Social Reach', description: 'D2C brand storytelling, Instagram/Meta Reels ads, and influencer product sales.', iconType: 'Sparkles', color: 'text-pink-600', badgeBg: 'bg-pink-50 text-pink-700 border-pink-200', visible: true, order: 9 },
  { id: 'ind_logistics', name: 'Logistics & Transport', badge: 'B2B CONTRACTS', stat: '150+ Fleet Enquiries', description: 'Fleet booking SEO, supply chain B2B marketing, and freight customer acquisition.', iconType: 'Truck', color: 'text-amber-600', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200', visible: true, order: 10 },
  { id: 'ind_travel', name: 'Travel & Tourism', badge: 'BOOKINGS BOOM', stat: '₹2.5Cr Package Sales', description: 'International tour package marketing, luxury resort booking ads, and travel SEO.', iconType: 'Plane', color: 'text-cyan-600', badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200', visible: true, order: 11 },
  { id: 'ind_food', name: 'Food & Beverage', badge: 'DINE & ORDER', stat: '45k Monthly Footfall', description: 'Restaurant chain branding, Zomato/Swiggy ad optimization, and food brand growth.', iconType: 'Utensils', color: 'text-orange-600', badgeBg: 'bg-orange-50 text-orange-700 border-orange-200', visible: true, order: 12 }
];

export const AdminIndustriesPage: React.FC = () => {
  const [industries, setIndustries] = useState<IndustryItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IndustryItemCMS | null>(null);

  const [form, setForm] = useState<{
    name: string;
    badge: string;
    stat: string;
    description: string;
    iconType: string;
    color: string;
    badgeBg: string;
  }>({
    name: '',
    badge: 'HIGH GROW',
    stat: '+250% Growth',
    description: '',
    iconType: 'TrendingUp',
    color: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  });

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getIndustries();
      if (res && res.success && Array.isArray(res.industries) && res.industries.length > 0) {
        setIndustries(res.industries);
        localStorage.setItem('sumit_industries_cms', JSON.stringify(res.industries));
      } else {
        const saved = localStorage.getItem('sumit_industries_cms');
        if (saved) {
          try { setIndustries(JSON.parse(saved)); } catch { setIndustries(defaultIndustriesList); }
        } else {
          setIndustries(defaultIndustriesList);
        }
      }
    } catch {
      setIndustries(defaultIndustriesList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const saveIndustriesToBackend = async (newList: IndustryItemCMS[]) => {
    setIndustries(newList);
    localStorage.setItem('sumit_industries_cms', JSON.stringify(newList));
    setIsSaving(true);
    try {
      await adminService.updateIndustries(newList);
    } catch (err) {
      console.warn('[AdminIndustriesPage] Backend update fallback:', err);
    }
    notifyCmsUpdate('industries');
    setIsSaving(false);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      badge: 'HIGH ROAS',
      stat: '+300% Growth',
      description: '',
      iconType: 'TrendingUp',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: IndustryItemCMS) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      badge: item.badge,
      stat: item.stat,
      description: item.description,
      iconType: item.iconType || 'TrendingUp',
      color: item.color || 'text-blue-600',
      badgeBg: item.badgeBg || 'bg-blue-50 text-blue-700 border-blue-200',
    });
    setDrawerOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.stat) {
      Swal.toast('Please fill in industry name and stat', 'warning');
      return;
    }

    let newList = [...industries];
    if (editingItem) {
      newList = newList.map(it => it.id === editingItem.id ? { ...it, ...form } : it);
    } else {
      const newId = `ind_${Date.now()}`;
      newList.push({
        id: newId,
        ...form,
        visible: true,
        order: newList.length + 1,
      });
    }

    await saveIndustriesToBackend(newList);
    setDrawerOpen(false);
    Swal.toast(editingItem ? 'Industry card updated!' : 'New industry added!', 'success');
  };

  const handleToggleVisible = async (id: string) => {
    const newList = industries.map(it => it.id === id ? { ...it, visible: !it.visible } : it);
    await saveIndustriesToBackend(newList);
    Swal.toast('Visibility toggled', 'info');
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Industry Card?',
      text: 'Are you sure you want to remove this industry from the Homepage grid?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: 'bg-red-600',
    });

    if (confirm.isConfirmed) {
      const newList = industries.filter(it => it.id !== id);
      await saveIndustriesToBackend(newList);
      Swal.toast('Industry card deleted', 'success');
    }
  };

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= industries.length) return;
    const newList = [...industries];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    newList.forEach((item, idx) => { item.order = idx + 1; });
    await saveIndustriesToBackend(newList);
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans text-slate-900 pb-16">
      
      {/* PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061329] via-[#0D3BA1] to-[#1352D0] text-white p-6 sm:p-9 shadow-2xl border border-blue-500/20">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <TrendingUp className="w-8 h-8 text-[#F4B400]" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-[#F4B400]" />
                <span>Dynamic Homepage CMS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Industry Results Grid Builder</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1.5 max-w-2xl leading-relaxed">
                Manage industry verticals, custom ROI metrics (e.g. <i>+320% Leads</i>, <i>₹14.2Cr Revenue</i>), badges, and descriptions. All changes reflect live instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add New Industry</span>
            </button>
          </div>
        </div>
      </div>

      {/* CARDS GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((item, index) => (
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
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.badgeBg || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {item.badge}
                </span>
                
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === industries.length - 1}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                <div className="text-sm font-black text-emerald-600 mt-0.5 flex items-center space-x-1">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>{item.stat}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleVisible(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 border cursor-pointer ${
                  item.visible
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{item.visible ? 'Visible' : 'Hidden'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-blue-50 text-[#1352D0] hover:bg-[#1352D0] hover:text-white transition-all cursor-pointer"
                  title="Edit Industry"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-red-50 text-[#D91212] hover:bg-[#D91212] hover:text-white transition-all cursor-pointer"
                  title="Delete Industry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">Industry CMS</div>
                  <h3 className="text-lg font-black text-slate-900">{editingItem ? 'Edit Industry Card' : 'Add New Industry'}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Industry Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Healthcare & Wellness" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-700 mb-1.5">ROI Result Stat * (e.g. +320% Leads Generated)</label>
                  <input required value={form.stat} onChange={e => setForm({ ...form, stat: e.target.value })} placeholder="e.g. +320% Leads Generated or ₹14.2Cr Revenue" className="w-full px-4 py-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-sm font-bold text-emerald-800 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Category Badge Text</label>
                  <input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. PATIENT TRUST or HIGH CLOSING" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Icon Preset</label>
                  <select value={form.iconType} onChange={e => setForm({ ...form, iconType: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none">
                    <option value="HeartPulse">HeartPulse (Healthcare)</option>
                    <option value="Building">Building (Real Estate)</option>
                    <option value="GraduationCap">GraduationCap (Education)</option>
                    <option value="Scale">Scale (Legal & Consulting)</option>
                    <option value="Cpu">Cpu (SaaS & IT)</option>
                    <option value="Car">Car (Automobile)</option>
                    <option value="ShoppingBag">ShoppingBag (E-Commerce)</option>
                    <option value="Landmark">Landmark (Finance & Fintech)</option>
                    <option value="Sparkles">Sparkles (Beauty & Lifestyle)</option>
                    <option value="Truck">Truck (Logistics)</option>
                    <option value="Plane">Plane (Travel & Tourism)</option>
                    <option value="Utensils">Utensils (Food & Beverage)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Description Summary</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter 1-2 lines value proposition..." className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer">
                    <Check className="w-4 h-4" /><span>{editingItem ? 'Update Industry' : 'Save Industry'}</span>
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
