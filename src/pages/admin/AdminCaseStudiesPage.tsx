import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Plus, Edit2, Trash2, Eye, Filter, Building2,
  X, Check, Sparkles, TrendingUp, Target, Award, Users
} from 'lucide-react';
import { caseStudiesData } from '../../data/caseStudiesData';
import type { CaseStudy } from '../../types';
import { ImageUploadInput } from '../../components/admin/ImageUploadInput';

const industryColors: Record<string, string> = {
  'Real Estate': 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
  'E-commerce': 'bg-sky-50 text-sky-700 border-sky-200 border',
  'SaaS': 'bg-purple-50 text-purple-700 border-purple-200 border',
  'Restaurant': 'bg-orange-50 text-orange-700 border-orange-200 border',
  'Education': 'bg-blue-50 text-blue-700 border-blue-200 border',
  'Healthcare': 'bg-pink-50 text-pink-700 border-pink-200 border',
  'Automotive': 'bg-red-50 text-red-700 border-red-200 border',
};

export const AdminCaseStudiesPage: React.FC = () => {
  const [items, setItems] = useState<CaseStudy[]>(caseStudiesData);
  const [search, setSearch] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CaseStudy>>({
    title: '', client: '', industry: 'Real Estate', summary: '', challenge: '', solution: '',
    image: '', badge: 'Flagship',
  });
  const [resultRows, setResultRows] = useState<{ label: string; value: string; growth: string }[]>([
    { label: 'Traffic Lift', value: '0', growth: '+0%' },
  ]);
  const [message, setMessage] = useState('');

  const industries = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.industry)))], [items]);

  const filtered = useMemo(() => items.filter(i => {
    const s = !search || `${i.title} ${i.client} ${i.industry} ${i.summary}`.toLowerCase().includes(search.toLowerCase());
    const ind = activeIndustry === 'All' || i.industry === activeIndustry;
    return s && ind;
  }), [items, search, activeIndustry]);

  const resetForm = () => {
    setForm({ title: '', client: '', industry: 'Real Estate', summary: '', challenge: '', solution: '', image: '', badge: 'Flagship' });
    setResultRows([{ label: 'Traffic Lift', value: '0', growth: '+0%' }]);
    setEditingId(null);
  };

  const openAdd = () => { resetForm(); setDrawerOpen(true); };
  const openEdit = (cs: CaseStudy) => {
    setEditingId(cs.id);
    setForm({ ...cs });
    setResultRows(cs.results || []);
    setDrawerOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.client) return;
    if (editingId) {
      setItems(items.map(i => i.id === editingId ? ({ ...i, ...form, results: resultRows }) as CaseStudy : i));
      setMessage('Case study updated & synced');
    } else {
      const n: CaseStudy = {
        id: `cs-${Date.now()}`,
        slug: (form.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: form.title!,
        client: form.client!,
        industry: form.industry!,
        mergedFrom: 'Sumit DigiTech',
        badge: form.badge || 'Case Study',
        summary: form.summary || '',
        challenge: form.challenge || '',
        solution: form.solution || '',
        results: resultRows,
        image: form.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop',
        chartData: [{ name: 'Start', value: 20 }, { name: '3mo', value: 55 }, { name: '6mo', value: 100 }],
      };
      setItems([n, ...items]);
      setMessage('Case study published');
    }
    resetForm();
    setDrawerOpen(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this case study?')) return;
    setItems(items.filter(i => i.id !== id));
    setMessage('Case study removed');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="space-y-7 animate-in fade-in">
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-xl">
          <Check className="w-4 h-4" /><span>{message}</span>
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1352D0] via-[#1E5BC6] to-[#0A3D9E] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Deep Dive Library</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Case Studies Manager</h1>
              <p className="text-sm text-blue-100 font-medium mt-1 max-w-xl">
                Publish ROI-driven case studies with challenges, solutions, and measurable results. The Featured flag controls hero placement on the public Case Studies page.
              </p>
            </div>
          </div>
          <button onClick={openAdd} className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1352D0] text-xs font-extrabold tracking-wide shadow-xl transition-all flex items-center space-x-2 shrink-0">
            <Plus className="w-4.5 h-4.5 text-[#1352D0]" /><span>New Case Study</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Total Case Studies', v: items.length, i: FileText, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { l: 'Industries Covered', v: industries.length - 1, i: Building2, c: 'text-amber-600', bg: 'bg-amber-50' },
          { l: 'Flagship Featured', v: items.filter(i => i.badge === 'Flagship').length, i: Award, c: 'text-[#D91212]', bg: 'bg-red-50' },
          { l: 'Brands Merged', v: new Set(items.map(i => i.mergedFrom)).size, i: Users, c: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {/* Filter Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search case study…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] focus:ring-4 focus:ring-[#1352D0]/10 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            {industries.map(c => (
              <button key={c} onClick={() => setActiveIndustry(c)} className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                activeIndustry === c ? 'bg-[#1352D0] text-white border-[#1352D0] shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}>{c}</button>
            ))}
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-600 shrink-0">{filtered.length} Results</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((cs, idx) => {
            const badgeClass = cs.badge === 'Flagship' ? 'bg-[#F4B400] text-slate-950 font-black' : 'bg-slate-900 text-white font-black';
            const industryClass = industryColors[cs.industry] || 'bg-slate-100 text-slate-700 border-slate-200 border';
            return (
              <motion.article
                key={cs.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-xl hover:border-[#1352D0]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={cs.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider ${badgeClass}`}>{cs.badge}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${industryClass}`}>{cs.industry}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#F4B400]">{cs.client}</div>
                      <h3 className="text-base sm:text-lg font-black text-white leading-snug line-clamp-2 mt-0.5">{cs.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">{cs.summary}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(cs.results || []).slice(0, 3).map((r, i) => (
                        <div key={i} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                          <div className="text-sm font-black text-[#1352D0] leading-none">{r.value}</div>
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wide mt-1 line-clamp-1">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-bold">
                      <Target className="w-3.5 h-3.5 text-[#1352D0]" />
                      <span>{cs.mergedFrom}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button onClick={() => openEdit(cs)} className="p-2.5 rounded-xl bg-blue-50 hover:bg-[#1352D0] text-[#1352D0] hover:text-white border border-blue-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(cs.id)} className="p-2.5 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[560px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
            >
              <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">{editingId ? 'Edit' : 'New Case Study'}</div>
                  <h3 className="text-lg font-black text-slate-900">{editingId ? 'Edit Case Study' : 'Publish New Case Study'}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Client *</label>
                    <input required value={form.client || ''} onChange={e => setForm({ ...form, client: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Industry</label>
                    <select value={form.industry || 'Real Estate'} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none appearance-none">
                      {industries.filter(i => i !== 'All').map(i => <option key={i}>{i}</option>)}
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>B2B Services</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Case Study Title *</label>
                  <input required value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Badge Label</label>
                  <input value={form.badge || ''} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="Flagship / Featured / New" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
                </div>
                <div>
                  <ImageUploadInput
                    label="Case Study Cover Image"
                    value={form.image || ''}
                    onChange={(newUrl) => setForm({ ...form, image: newUrl })}
                    placeholder="https://... or click Browse Computer"
                    helpText="Browse computer to upload Case Study image"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Executive Summary</label>
                  <textarea value={form.summary || ''} onChange={e => setForm({ ...form, summary: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Client Challenge</label>
                    <textarea value={form.challenge || ''} onChange={e => setForm({ ...form, challenge: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Our Solution</label>
                    <textarea value={form.solution || ''} onChange={e => setForm({ ...form, solution: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none resize-none" />
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-[#1352D0]" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Measurable Results</span>
                    </div>
                    <button type="button" onClick={() => setResultRows([...resultRows, { label: 'New Metric', value: '0', growth: '+0%' }])} className="px-3 py-1 rounded-xl bg-[#1352D0] text-white text-[11px] font-black">+ Add Row</button>
                  </div>
                  <div className="space-y-2">
                    {resultRows.map((r, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input value={r.label} onChange={e => { const nr = [...resultRows]; nr[i] = { ...r, label: e.target.value }; setResultRows(nr); }} placeholder="Label" className="col-span-5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none" />
                        <input value={r.value} onChange={e => { const nr = [...resultRows]; nr[i] = { ...r, value: e.target.value }; setResultRows(nr); }} placeholder="Value" className="col-span-4 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-[#1352D0] focus:outline-none" />
                        <input value={r.growth} onChange={e => { const nr = [...resultRows]; nr[i] = { ...r, growth: e.target.value }; setResultRows(nr); }} placeholder="+X%" className="col-span-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-emerald-600 focus:outline-none" />
                        <button type="button" disabled={resultRows.length <= 1} onClick={() => setResultRows(resultRows.filter((_, j) => j !== i))} className="col-span-1 p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-xs font-bold disabled:opacity-30 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
              <div className="border-t border-slate-200 p-5 flex items-center justify-end space-x-3 shrink-0 bg-slate-50">
                <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold transition-all">Cancel</button>
                <button onClick={submit} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold tracking-wide shadow-md transition-all flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#F4B400]" /><span>{editingId ? 'Save Changes' : 'Publish Case Study'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
