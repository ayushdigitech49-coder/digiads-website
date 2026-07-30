import React, { useState, useEffect } from 'react';
import {
  Megaphone, Save, Sparkles, Check
} from 'lucide-react';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';
import { adminService, type AnnouncementBarData } from '../../services/admin.service';

const PRESET_EMOJIS = ['🔥', '🚀', '⭐', '🎯', '⚡', '📢', '🎁', '💎', '✨', '📣'];
const PRESET_BG_COLORS = ['#1352D0', '#D91212', '#061329', '#059669', '#7C3AED', '#DB2777', '#F59E0B', '#000000'];
const PRESET_TEXT_COLORS = ['#FFFFFF', '#F4B400', '#F8FAFC', '#0F172A', '#E2E8F0', '#FEF08A'];

export const defaultAnnouncementBar: AnnouncementBarData = {
  id: 'announcement_01',
  bannerText: 'Free Audit for August',
  highlightText: 'Only 20 Slots Available',
  icon: '🔥',
  backgroundColor: '#1352D0',
  textColor: '#FFFFFF',
  isActive: true,
  priorityOrder: 1,
};

export const AdminAnnouncementBarPage: React.FC = () => {
  const [config, setConfig] = useState<AnnouncementBarData>(() => {
    const saved = localStorage.getItem('sumit_announcement_bar');
    if (saved) {
      try { return { ...defaultAnnouncementBar, ...JSON.parse(saved) }; } catch {}
    }
    return defaultAnnouncementBar;
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await adminService.getAnnouncementBar();
        if (res && res.success && res.announcementBar) {
          const merged = { ...defaultAnnouncementBar, ...res.announcementBar };
          setConfig(merged);
          localStorage.setItem('sumit_announcement_bar', JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('[AdminAnnouncementBarPage] Could not fetch data from backend:', err);
      }
    };

    fetchAnnouncement();
  }, []);

  const saveAnnouncementBar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    localStorage.setItem('sumit_announcement_bar', JSON.stringify(config));
    
    try {
      await adminService.updateAnnouncementBar(config);
    } catch (err) {
      console.warn('[AdminAnnouncementBarPage] Backend save failed:', err);
    }

    notifyCmsUpdate('announcement_bar');
    setIsSaving(false);
    Swal.toast('Announcement Bar Updated Successfully', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans text-slate-900 pb-16">
      
      {/* PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061329] via-[#0D3BA1] to-[#1352D0] text-white p-6 sm:p-9 shadow-2xl border border-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Megaphone className="w-8 h-8 text-[#F4B400]" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-[#F4B400]" />
                <span>Global CMS Module</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Announcement Bar Manager</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1.5 max-w-2xl leading-relaxed">
                Manage the global announcement banner displayed at the top of the website. Changes update instantly across all active visitor sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => saveAnnouncementBar()}
              disabled={isSaving}
              className="px-6 py-3.5 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SINGLE COLUMN FULL WIDTH LAYOUT FOR FORM CONTROLS */}
      <div className="w-full space-y-6">
        <form onSubmit={saveAnnouncementBar} className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Announcement Banner Configuration</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Customize global headline, highlight badge, colors, and visibility</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              config.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {config.isActive ? 'Active Global' : 'Disabled'}
            </span>
          </div>

          <div className="space-y-6">
            
            {/* 1. Show Banner Toggle Switch */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">Show Announcement Banner</h4>
                <p className="text-[11px] text-slate-500 font-medium">Globally display or hide the top banner on all website pages</p>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                  config.isActive ? 'bg-[#1352D0]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
                  config.isActive ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* 2. Banner Text */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                1. Banner Text *
              </label>
              <input
                type="text"
                value={config.bannerText}
                onChange={e => setConfig({ ...config, bannerText: e.target.value })}
                placeholder="e.g. Free Audit for August"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
              />
            </div>

            {/* 3. Highlight Text */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                2. Highlight Text Badge
              </label>
              <input
                type="text"
                value={config.highlightText}
                onChange={e => setConfig({ ...config, highlightText: e.target.value })}
                placeholder="e.g. Only 20 Slots Available"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
              />
            </div>

            {/* 4. Icon / Emoji Picker */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                3. Icon / Emoji
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={config.icon}
                  onChange={e => setConfig({ ...config, icon: e.target.value })}
                  placeholder="e.g. 🔥"
                  className="w-full sm:w-32 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-lg font-bold text-slate-900 focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-200 flex-1">
                  {PRESET_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setConfig({ ...config, icon: emoji })}
                      className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer ${
                        config.icon === emoji ? 'bg-white shadow-md scale-110 ring-2 ring-[#1352D0]' : 'hover:bg-slate-200/60'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Color Pickers (Background & Text) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Background Color */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  4. Background Color
                </label>
                <div className="flex items-center space-x-3 mb-2">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={e => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={config.backgroundColor}
                    onChange={e => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-800 uppercase focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_BG_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setConfig({ ...config, backgroundColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer transition-transform ${
                        config.backgroundColor.toLowerCase() === color.toLowerCase() ? 'scale-125 ring-2 ring-slate-900' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  5. Text Color
                </label>
                <div className="flex items-center space-x-3 mb-2">
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={e => setConfig({ ...config, textColor: e.target.value })}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={config.textColor}
                    onChange={e => setConfig({ ...config, textColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-800 uppercase focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TEXT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setConfig({ ...config, textColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border-2 border-slate-300 shadow-sm cursor-pointer transition-transform ${
                        config.textColor.toLowerCase() === color.toLowerCase() ? 'scale-125 ring-2 ring-slate-900' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* 6. Priority Order */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                6. Priority Order
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={config.priorityOrder}
                onChange={e => setConfig({ ...config, priorityOrder: parseInt(e.target.value) || 1 })}
                className="w-full sm:w-32 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-4 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4 text-white" />
                <span>{isSaving ? 'Updating...' : 'Save & Publish Banner'}</span>
              </button>
            </div>

          </div>
        </form>
      </div>

    </div>
  );
};
