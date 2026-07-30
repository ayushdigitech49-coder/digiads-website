import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Save, Plus, Trash2, Globe, Code, Sparkles, UserPlus, Layers,
  Target, ShieldCheck, Zap, Brain, Users, Star
} from 'lucide-react';
import { adminService, type AboutConfigData, type AboutBrandItem, type AboutValueItem, type AboutTeamMember } from '../../services/admin.service';
import { defaultAboutData } from '../../data/aboutData';
import { Swal } from '../../utils/swal';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export const AdminAboutPage: React.FC = () => {
  const [config, setConfig] = useState<AboutConfigData>(() => {
    const saved = localStorage.getItem('sumit_about_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultAboutData;
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await adminService.getAboutConfig();
        if (res && res.success && res.aboutConfig) {
          setConfig(res.aboutConfig);
          localStorage.setItem('sumit_about_config', JSON.stringify(res.aboutConfig));
        }
      } catch (e) {
        console.warn('[AdminAboutPage] Could not load from backend:', e);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('sumit_about_config', JSON.stringify(config));
      await adminService.updateAboutConfig(config);
      notifyCmsUpdate('about');
      Swal.toast('About Us Page updated live!', 'success');
    } catch (err) {
      Swal.toast('Failed to save to backend, saved locally', 'warning');
    } finally {
      setSaving(false);
    }
  };

  // Merged Agencies Handlers
  const addBrand = () => {
    const newBrand: AboutBrandItem = {
      tag: 'New Division',
      tagColor: 'bg-blue-50 text-[#1352D0] border-blue-200',
      title: 'Agency Name',
      desc: 'Short breakdown of achievements and capabilities...',
      stat: '100+',
      statLabel: 'Projects Completed',
      accent: 'border-l-4 border-l-[#1352D0]'
    };
    setConfig({ ...config, mergedBrands: [...(config.mergedBrands || []), newBrand] });
  };

  const updateBrand = (index: number, field: keyof AboutBrandItem, val: string) => {
    const updated = [...config.mergedBrands];
    updated[index] = { ...updated[index], [field]: val };
    setConfig({ ...config, mergedBrands: updated });
  };

  const removeBrand = (index: number) => {
    setConfig({ ...config, mergedBrands: config.mergedBrands.filter((_: AboutBrandItem, i: number) => i !== index) });
  };

  // Team Handlers
  const addTeam = () => {
    const newMember: AboutTeamMember = {
      name: 'Team Member',
      role: 'Growth Leader',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      division: 'Jaipur Squad'
    };
    setConfig({ ...config, leadershipTeam: [...(config.leadershipTeam || []), newMember] });
  };

  const updateTeam = (index: number, field: keyof AboutTeamMember, val: string) => {
    const updated = [...config.leadershipTeam];
    updated[index] = { ...updated[index], [field]: val };
    setConfig({ ...config, leadershipTeam: updated });
  };

  const removeTeam = (index: number) => {
    setConfig({ ...config, leadershipTeam: config.leadershipTeam.filter((_: AboutTeamMember, i: number) => i !== index) });
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans pb-12">
      
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1352D0] via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Dynamic CMS</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">About Us Page Manager</h1>
              <p className="text-sm text-blue-100 font-medium mt-1 max-w-xl">
                Edit dynamic hero content, section headings, merged agency cards, leadership team, core values, and SEO tags. Changes sync live on the website.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1352D0] text-xs font-black tracking-wide shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Save className="w-4.5 h-4.5 text-[#1352D0]" />
            <span>{saving ? 'Saving Changes...' : 'Save Live Content'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. HERO SECTION & SEO */}
        <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-[#1352D0]">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-black text-slate-900">1. Hero Banner & SEO Meta Tags</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Hero Top Badge Text</label>
              <input
                value={config.heroBadge}
                onChange={(e) => setConfig({ ...config, heroBadge: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1352D0]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Hero Title Line 1</label>
              <input
                value={config.heroTitleLine1}
                onChange={(e) => setConfig({ ...config, heroTitleLine1: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1352D0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Hero Highlight Phrase</label>
            <input
              value={config.heroTitleHighlight}
              onChange={(e) => setConfig({ ...config, heroTitleHighlight: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1352D0]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Hero Paragraph Description</label>
            <textarea
              rows={3}
              value={config.heroDescription}
              onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1352D0]"
            />
          </div>

          {/* Meta Tags */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center space-x-1.5 text-purple-700 text-xs font-black uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>SEO Meta Options</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Title</label>
                <input
                  value={config.metaTitle || ''}
                  onChange={(e) => setConfig({ ...config, metaTitle: e.target.value })}
                  placeholder="Page title for search engines..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Keywords</label>
                <input
                  value={config.metaKeywords || ''}
                  onChange={(e) => setConfig({ ...config, metaKeywords: e.target.value })}
                  placeholder="Comma separated keywords..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Description</label>
              <textarea
                rows={2}
                value={config.metaDescription || ''}
                onChange={(e) => setConfig({ ...config, metaDescription: e.target.value })}
                placeholder="Meta description snippet for Google..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. MERGED AGENCIES SHOWCASE & TITLE */}
        <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-[#1352D0]">
              <Layers className="w-5 h-5" />
              <h2 className="text-lg font-black text-slate-900">2. Merged Agencies Section & Title</h2>
            </div>
            <button
              type="button"
              onClick={addBrand}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-[#1352D0] hover:text-white text-[#1352D0] font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Agency Card</span>
            </button>
          </div>

          {/* Dynamic Section Title Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Section Title (Line 1)</label>
              <input
                value={config.section2TitleLine1 || 'The Specialized Agencies'}
                onChange={(e) => setConfig({ ...config, section2TitleLine1: e.target.value })}
                placeholder="e.g. The Specialized Agencies"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1352D0] mb-1.5">Section Title Highlight (Line 2)</label>
              <input
                value={config.section2TitleHighlight || 'Merged Into Sumit DigiTech'}
                onChange={(e) => setConfig({ ...config, section2TitleHighlight: e.target.value })}
                placeholder="e.g. Merged Into Sumit DigiTech"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(config.mergedBrands || []).map((brand: AboutBrandItem, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Agency #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeBrand(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tag / Category</label>
                    <input
                      value={brand.tag}
                      onChange={(e) => updateBrand(idx, 'tag', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Agency Name / Title</label>
                    <input
                      value={brand.title}
                      onChange={(e) => updateBrand(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Stat Value</label>
                    <input
                      value={brand.stat}
                      onChange={(e) => updateBrand(idx, 'stat', e.target.value)}
                      placeholder="e.g. 12,450+"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Stat Label</label>
                    <input
                      value={brand.statLabel}
                      onChange={(e) => updateBrand(idx, 'statLabel', e.target.value)}
                      placeholder="e.g. Page 1 Keywords"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={brand.desc}
                    onChange={(e) => updateBrand(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. LEADERSHIP TEAM SHOWCASE */}
        <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-[#1352D0]">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-black text-slate-900">3. Leadership Team Members ({(config.leadershipTeam || []).length})</h2>
            </div>
            <button
              type="button"
              onClick={addTeam}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-[#1352D0] hover:text-white text-[#1352D0] font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(config.leadershipTeam || []).map((member: AboutTeamMember, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Member #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTeam(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 mx-auto">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                  <input
                    value={member.name}
                    onChange={(e) => updateTeam(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Role / Designation</label>
                  <input
                    value={member.role}
                    onChange={(e) => updateTeam(idx, 'role', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Photo Image URL</label>
                  <input
                    value={member.img}
                    onChange={(e) => updateTeam(idx, 'img', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-mono text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SAVE BUTTON */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4.5 h-4.5 text-[#F4B400]" />
            <span>{saving ? 'Saving Content...' : 'Save Live Content'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
