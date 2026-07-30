import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Eye, EyeOff, Search, ShieldCheck, Zap, ChevronUp, ChevronDown, GripVertical
} from 'lucide-react';
import { adminService, type SectionToggle } from '../../services/admin.service';
import { NavLink } from 'react-router-dom';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

const sectionColors: Record<string, { grad: string; icon: string; accent: string }> = {
  sec_hero: { grad: 'from-[#1352D0] to-blue-600', icon: '🎯', accent: 'border-blue-200' },
  sec_media: { grad: 'from-[#F4B400] to-amber-600', icon: '📰', accent: 'border-amber-200' },
  sec_why_choose: { grad: 'from-purple-500 to-indigo-600', icon: '🎖️', accent: 'border-purple-200' },
  sec_flagship: { grad: 'from-[#D91212] to-rose-600', icon: '🌐', accent: 'border-red-200' },
  sec_industries: { grad: 'from-emerald-500 to-teal-600', icon: '🏆', accent: 'border-emerald-200' },
  sec_calculator: { grad: 'from-[#1352D0] to-indigo-600', icon: '🧮', accent: 'border-blue-200' },
  sec_offers: { grad: 'from-amber-500 to-red-500', icon: '🎁', accent: 'border-amber-200' },
  sec_stats: { grad: 'from-[#061329] to-blue-900', icon: '⚡', accent: 'border-blue-300' },
  sec_reels: { grad: 'from-red-500 to-pink-600', icon: '🎬', accent: 'border-red-200' },
  sec_case_studies: { grad: 'from-sky-500 to-blue-600', icon: '📊', accent: 'border-sky-200' },
  sec_pricing: { grad: 'from-[#F4B400] to-amber-500', icon: '💰', accent: 'border-amber-200' },
  sec_faq: { grad: 'from-slate-500 to-slate-700', icon: '❓', accent: 'border-slate-200' },
  sec_final_cta: { grad: 'from-[#1352D0] via-[#F4B400] to-[#D91212]', icon: '📣', accent: 'border-amber-200' },
};

const ALL_DEFAULT_SECTIONS: SectionToggle[] = [
  { id: 'sec_hero', name: 'Hero Section (Headline & Visual Data Mesh)', sectionKey: 'HeroSection', visible: true, requiredPermission: null },
  { id: 'sec_media', name: 'As Featured In Press Media Logos (Marquee)', sectionKey: 'MediaMarquee', visible: true, requiredPermission: null },
  { id: 'sec_why_choose', name: 'Why Choose Us (55/45 Split)', sectionKey: 'WhyChooseUsSection', visible: true, requiredPermission: null },
  { id: 'sec_flagship', name: 'Flagship Ecosystem (7 Growth Divisions)', sectionKey: 'FlagshipEcosystemSection', visible: true, requiredPermission: null },
  { id: 'sec_industries', name: 'Unified Industry Results Grid (12 Sectors)', sectionKey: 'IndustriesSection', visible: true, requiredPermission: null },
  { id: 'sec_calculator', name: 'Growth Potential ROI Calculator', sectionKey: 'GrowthCalculatorSection', visible: true, requiredPermission: null },
  { id: 'sec_offers', name: 'Limited-Time Special Offers & Deals', sectionKey: 'OffersSection', visible: true, requiredPermission: null },
  { id: 'sec_stats', name: 'Verified Revenue Results & Stats Bar', sectionKey: 'StatsSection', visible: true, requiredPermission: null },
  { id: 'sec_reels', name: 'Video Reels & Client Testimonials', sectionKey: 'VideoReelsTestimonials', visible: true, requiredPermission: null },
  { id: 'sec_case_studies', name: 'Verified Growth Stories (Bento Grid)', sectionKey: 'CaseStudiesSection', visible: true, requiredPermission: null },
  { id: 'sec_pricing', name: 'Flexible Digital Marketing Pricing Packages', sectionKey: 'PricingSection', visible: true, requiredPermission: null },
  { id: 'sec_faq', name: 'Frequently Asked Questions (FAQ)', sectionKey: 'FaqSection', visible: true, requiredPermission: null },
  { id: 'sec_final_cta', name: 'Final Conversion CTA Banner', sectionKey: 'FinalCtaSection', visible: true, requiredPermission: null },
];

export const AdminSectionsPage: React.FC = () => {
  const [sections, setSections] = useState<SectionToggle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSections();
      if (res.success && Array.isArray(res.sections) && res.sections.length > 0) {
        let items = [...res.sections];
        ALL_DEFAULT_SECTIONS.forEach(def => {
          if (!items.some(it => it.id === def.id || it.sectionKey === def.sectionKey)) {
            items.push(def);
          }
        });
        setSections(items);
      } else {
        setSections(ALL_DEFAULT_SECTIONS);
      }
    } catch {
      setSections(ALL_DEFAULT_SECTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSections(); }, []);

  const saveSectionsList = async (newList: SectionToggle[]) => {
    setSections(newList);
    try {
      await adminService.updateSections(newList);
    } catch (err) {
      console.warn('[AdminSectionsPage] Fallback update:', err);
    }
    notifyCmsUpdate('sections');
  };

  const toggle = async (id: string, visible: boolean, name: string) => {
    const actionText = visible ? 'hide' : 'publish LIVE';
    const confirm = await Swal.fire({
      title: `${visible ? 'Hide' : 'Publish'} ${name}?`,
      text: `Are you sure you want to ${actionText} this section on the public homepage?`,
      icon: visible ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: visible ? 'Yes, Hide Section' : 'Yes, Make LIVE',
      confirmButtonColor: visible ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700',
    });

    if (!confirm.isConfirmed) return;

    const newList = sections.map(s => s.id === id ? { ...s, visible: !visible } : s);
    await saveSectionsList(newList);
    Swal.toast(
      visible ? `${name} hidden globally` : `${name} is now LIVE on homepage!`,
      visible ? 'warning' : 'success'
    );
  };

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newList = [...sections];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    await saveSectionsList(newList);
    Swal.toast('Homepage section order updated!', 'info');
  };

  // DRAG AND DROP HANDLERS
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newList = [...sections];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(dropIndex, 0, draggedItem);

    setDraggedIndex(null);
    await saveSectionsList(newList);
    Swal.toast('Sections re-ordered via Drag & Drop!', 'success');
  };

  const visibleCount = sections.filter(s => s.visible).length;
  const filtered = sections.filter(s => !search || `${s.name} ${s.sectionKey}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-7 animate-in fade-in font-sans pb-12">
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1352D0] via-[#1E5BC6] to-[#0A3D9E] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0"><Layers className="w-7 h-7 text-white" /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Drag & Drop Layout CMS</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Homepage Sections Manager</h1>
              <p className="text-sm text-blue-100 font-medium mt-1 max-w-xl">
                Drag & drop section cards or use Up/Down arrows to re-order homepage layout. Toggle visibility LIVE in real-time!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <NavLink to="/" target="_blank" className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1352D0] text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-1.5 cursor-pointer">
              <Zap className="w-4 h-4 text-[#1352D0]" /><span>Preview Live Homepage</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Total Sections', v: sections.length, i: Layers, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { l: 'Visible · LIVE', v: visibleCount, i: Eye, c: 'text-emerald-600', bg: 'bg-emerald-50' },
          { l: 'Hidden', v: sections.length - visibleCount, i: EyeOff, c: 'text-slate-500', bg: 'bg-slate-100' },
          { l: 'Uptime SLA', v: '99.98%', i: ShieldCheck, c: 'text-amber-600', bg: 'bg-amber-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sections…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span>{visibleCount} Live</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-700">{filtered.length} Sections</span>
        </div>
      </div>

      {/* DRAG AND DROP LIST */}
      <div className="space-y-4">
        {(loading ? Array.from({ length: 8 }) : filtered).map((sec, i) => {
          const s = (sec || {}) as SectionToggle;
          const cfg = sectionColors[s.id || ''] || { grad: 'from-[#1352D0] to-blue-600', icon: '📦', accent: 'border-slate-200' };
          const isBeingDragged = draggedIndex === i;

          return (
            <motion.div
              key={s.id || i}
              draggable={true}
              onDragStart={(e: any) => handleDragStart(e, i)}
              onDragOver={(e: any) => handleDragOver(e, i)}
              onDrop={(e: any) => handleDrop(e, i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`relative rounded-3xl bg-white border cursor-grab active:cursor-grabbing transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isBeingDragged ? 'border-[#1352D0] shadow-2xl opacity-40 scale-[0.98]' : 'border-slate-200/90 shadow-xs hover:border-blue-300'
              } ${s.visible ? '' : 'opacity-60 bg-slate-50/50'}`}
            >
              <div className={`absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b ${cfg.grad}`} />
              
              <div className="flex items-start sm:items-center space-x-3.5 pl-3 min-w-0 flex-1">
                {/* Drag Grip Handle */}
                <div className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900 shrink-0 cursor-grab active:cursor-grabbing" title="Drag to re-order">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Order Index Badge */}
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                  #{i + 1}
                </div>

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cfg.grad} flex items-center justify-center text-xl shadow-xs shrink-0 text-white`}>
                  {cfg.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${s.visible ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.sectionKey || 'Section'}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">{s.name || 'Loading…'}</h3>
                </div>
              </div>

              {/* Actions & Re-order Controls */}
              <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {/* Move Up / Down Buttons */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => handleMove(i, 'up')}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 cursor-pointer transition-all"
                    title="Move Section Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(i, 'down')}
                    disabled={i === sections.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 cursor-pointer transition-all"
                    title="Move Section Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Visibility Toggle Button */}
                <button
                  onClick={() => s.id && toggle(s.id, !!s.visible, s.name || 'Section')}
                  disabled={!s.id}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 shadow-xs disabled:opacity-40 cursor-pointer ${
                    s.visible
                      ? 'bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-200'
                      : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200'
                  }`}
                >
                  {s.visible ? (<><EyeOff className="w-4 h-4" /><span>Hide Section</span></>) : (<><Eye className="w-4 h-4" /><span>Make LIVE</span></>)}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
