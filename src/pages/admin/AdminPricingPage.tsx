import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, Search, Plus, Edit2, Trash2, Eye, X, Check, Sparkles,
  Crown, CheckCircle2, Zap, ShieldCheck, DollarSign, TrendingUp
} from 'lucide-react';
import { pricingPlans } from '../../data/pricingData';
import type { PricingPlan } from '../../types';
import { Swal } from '../../utils/swal.tsx';
import { adminService } from '../../services/admin.service';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export const AdminPricingPage: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('sumit_pricing_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return pricingPlans;
  });

  const fetchBackendPlans = async () => {
    try {
      const res = await adminService.getPricingPlans();
      if (res.success && Array.isArray(res.pricingPlans) && res.pricingPlans.length > 0) {
        setPlans(res.pricingPlans);
        localStorage.setItem('sumit_pricing_plans', JSON.stringify(res.pricingPlans));
      }
    } catch {
      // Fallback to local state
    }
  };

  useEffect(() => {
    fetchBackendPlans();
  }, []);

  const savePlans = async (newPlans: PricingPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('sumit_pricing_plans', JSON.stringify(newPlans));
    notifyCmsUpdate('pricing');

    try {
      await adminService.updatePricingPlans(newPlans);
    } catch {
      // Offline fallback
    }
  };

  const [search, setSearch] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [form, setForm] = useState<Partial<PricingPlan>>({
    name: '', description: '', priceMonthly: 0, priceAnnual: 0, popular: false, ctaText: 'Get Started', highlight: '',
    features: [],
  });

  const filtered = plans.filter(p => !search || `${p.name} ${p.description} ${p.features.join(' ')}`.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => {
    setForm({ name: '', description: '', priceMonthly: 0, priceAnnual: 0, popular: false, ctaText: 'Get Started', highlight: '', features: [] });
    setEditingId(null);
    setFeatureInput('');
  };
  const openAdd = () => { resetForm(); setDrawerOpen(true); };
  const openEdit = (p: PricingPlan) => { setEditingId(p.id); setForm({ ...p }); setDrawerOpen(true); };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm({ ...form, features: [...(form.features || []), featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setForm({ ...form, features: (form.features || []).filter((_, i) => i !== idx) });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editingId) {
      const updated = plans.map(p => p.id === editingId ? ({ ...p, ...form }) as PricingPlan : p);
      await savePlans(updated);
      Swal.toast(`${form.name} updated successfully!`, 'success');
    } else {
      const n: PricingPlan = {
        id: `plan-${Date.now()}`,
        name: form.name!,
        description: form.description || '',
        priceMonthly: Number(form.priceMonthly) || 0,
        priceAnnual: Number(form.priceAnnual) || 0,
        popular: !!form.popular,
        ctaText: form.ctaText || 'Get Started',
        highlight: form.highlight || '',
        features: form.features || ['Enterprise SLA & Priority Support'],
      };
      const updated = [...plans, n];
      await savePlans(updated);
      Swal.toast(`New pricing tier ${form.name} published!`, 'success');
    }
    resetForm();
    setDrawerOpen(false);
  };

  const remove = async (id: string, name: string) => {
    const confirm = await Swal.fire({
      title: `Delete ${name}?`,
      text: `Are you sure you want to delete this pricing package? It will instantly vanish from the live website and homepage.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Tier',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
    });

    if (confirm.isConfirmed) {
      const updated = plans.filter(p => p.id !== id);
      await savePlans(updated);
      Swal.toast(`${name} pricing plan deleted`, 'warning');
    }
  };

  const monthlyMRR = plans.reduce((a, b) => a + b.priceMonthly, 0);
  const annualMRR = plans.reduce((a, b) => a + (b.priceAnnual * 12), 0);
  const totalFeatures = plans.reduce((a, b) => a + b.features.length, 0);

  return (
    <div className="space-y-7 animate-in fade-in font-sans">
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-950 mb-1">Revenue Controls</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Pricing Plans Manager</h1>
              <p className="text-sm text-amber-50 font-medium mt-1 max-w-xl">
                Update pricing tiers, feature sets, discounts, and popular badges. The public website & homepage update instantly.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={openAdd} className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-amber-700 text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-2 cursor-pointer">
              <Plus className="w-4.5 h-4.5 text-amber-700" /><span>New Pricing Tier</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Active Plans', v: plans.length, i: Wallet, c: 'text-amber-600', bg: 'bg-amber-50' },
          { l: 'Combined MRR (₹)', v: `₹${(monthlyMRR / 1000).toFixed(0)}K`, i: DollarSign, c: 'text-emerald-600', bg: 'bg-emerald-50' },
          { l: 'Combined ARR (₹)', v: `₹${(annualMRR / 100000).toFixed(1)}L`, i: TrendingUp, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { l: 'Feature Lines', v: totalFeatures, i: CheckCircle2, c: 'text-[#D91212]', bg: 'bg-red-50' },
        ].map((s, i) => {
          const Icon = s.i;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${s.c}`} /></div>
              <div className="text-2xl font-black text-slate-900 leading-none">{s.v}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.l}</div>
            </motion.div>
          );
        })}
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plan name, description, features…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-black text-amber-700">{filtered.length} Active Plans</span>
        </div>
      </div>

      {/* PRICING CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filtered.map((plan, idx) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`relative rounded-3xl bg-white border shadow-xs overflow-hidden flex flex-col justify-between ${
                  plan.popular ? 'border-[#1352D0] ring-2 ring-[#1352D0]/20' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-[#1352D0] text-white text-[10px] font-black uppercase tracking-widest text-center py-1.5">
                    ★ MOST POPULAR CHOICE
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{plan.description}</p>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-slate-900">₹{(price / 1000).toFixed(0)}K</span>
                    <span className="text-xs text-slate-500 font-bold"> / mo</span>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {(plan.features || []).slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                    <button onClick={() => openEdit(plan)} className="p-2.5 rounded-xl bg-blue-50 hover:bg-[#1352D0] text-[#1352D0] hover:text-white border border-blue-100 transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => remove(plan.id, plan.name)} className="p-2.5 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-100 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
            >
              <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">{editingId ? 'Edit Plan' : 'New Plan'}</div>
                  <h3 className="text-lg font-black text-slate-900">{editingId ? 'Edit Pricing Tier' : 'Create New Pricing Tier'}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Package Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Micro Launch" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Monthly Price (₹) *</label>
                    <input type="number" required value={form.priceMonthly || ''} onChange={e => setForm({ ...form, priceMonthly: Number(e.target.value) })} placeholder="14999" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Annual Price / Mo (₹)</label>
                    <input type="number" value={form.priceAnnual || ''} onChange={e => setForm({ ...form, priceAnnual: Number(e.target.value) })} placeholder="11999" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Package Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Target audience and primary deliverables..." className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-xs font-medium text-slate-900 focus:outline-none" />
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <input type="checkbox" id="popular" checked={!!form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} className="w-4 h-4 rounded text-[#1352D0] cursor-pointer" />
                  <label htmlFor="popular" className="text-xs font-black text-slate-900 cursor-pointer">Mark as Most Popular Choice</label>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">CTA Button Text</label>
                  <input value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} placeholder="Start Growing" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Included Deliverables</label>
                  <div className="flex space-x-2 mb-3">
                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Add deliverable feature..." className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none" />
                    <button type="button" onClick={addFeature} className="px-4 py-2.5 bg-blue-50 text-[#1352D0] font-black text-xs rounded-xl border border-blue-200 hover:bg-[#1352D0] hover:text-white transition-all cursor-pointer">Add</button>
                  </div>
                  <div className="space-y-2">
                    {(form.features || []).map((feat, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{feat}</span>
                        </div>
                        <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
              <div className="border-t border-slate-200 p-5 flex items-center justify-end space-x-3 shrink-0 bg-slate-50">
                <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer">Cancel</button>
                <button onClick={submit} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer">
                  <Sparkles className="w-4 h-4 text-[#F4B400]" /><span>{editingId ? 'Save Changes' : 'Publish Plan'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
