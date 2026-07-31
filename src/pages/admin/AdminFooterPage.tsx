import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Sparkles, CheckCircle2, Building2, Layout } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { defaultContactData, type ContactConfigData } from '../../data/contactData';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export const AdminFooterPage: React.FC = () => {
  const [config, setConfig] = useState<ContactConfigData>(() => {
    const saved = localStorage.getItem('sumit_contact_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultContactData;
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await adminService.getContactConfig();
        if (res && res.success && res.contactConfig) {
          setConfig(res.contactConfig);
          localStorage.setItem('sumit_contact_config', JSON.stringify(res.contactConfig));
        }
      } catch (err) {
        console.warn('Failed loading footer config from backend:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      localStorage.setItem('sumit_contact_config', JSON.stringify(config));
      await adminService.updateContactConfig(config);
      notifyCmsUpdate('contact');
      setMsg('Footer CMS settings saved successfully!');
    } catch (err) {
      setMsg('Saved to local storage (Backend sync failed).');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const addFooterTagline = () => {
    setConfig(prev => ({
      ...prev,
      footerTaglines: [...(prev.footerTaglines || defaultContactData.footerTaglines || []), 'New Brand Tagline...']
    }));
  };

  const removeFooterTagline = (index: number) => {
    setConfig(prev => ({
      ...prev,
      footerTaglines: (prev.footerTaglines || defaultContactData.footerTaglines || []).filter((_, i) => i !== index)
    }));
  };

  const updateFooterTagline = (index: number, value: string) => {
    setConfig(prev => {
      const list = [...(prev.footerTaglines || defaultContactData.footerTaglines || [])];
      list[index] = value;
      return { ...prev, footerTaglines: list };
    });
  };

  const addGrowthLink = () => {
    setConfig(prev => ({
      ...prev,
      growthDivisionsLinks: [...(prev.growthDivisionsLinks || defaultContactData.growthDivisionsLinks || []), { label: 'New Service Link', path: '/services' }]
    }));
  };

  const removeGrowthLink = (index: number) => {
    setConfig(prev => ({
      ...prev,
      growthDivisionsLinks: (prev.growthDivisionsLinks || defaultContactData.growthDivisionsLinks || []).filter((_, i) => i !== index)
    }));
  };

  const updateGrowthLink = (index: number, key: 'label' | 'path', value: string) => {
    setConfig(prev => {
      const list = [...(prev.growthDivisionsLinks || defaultContactData.growthDivisionsLinks || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, growthDivisionsLinks: list };
    });
  };

  const addPlatformLink = () => {
    setConfig(prev => ({
      ...prev,
      platformCompanyLinks: [...(prev.platformCompanyLinks || defaultContactData.platformCompanyLinks || []), { label: 'New Page Link', path: '/' }]
    }));
  };

  const removePlatformLink = (index: number) => {
    setConfig(prev => ({
      ...prev,
      platformCompanyLinks: (prev.platformCompanyLinks || defaultContactData.platformCompanyLinks || []).filter((_, i) => i !== index)
    }));
  };

  const updatePlatformLink = (index: number, key: 'label' | 'path', value: string) => {
    setConfig(prev => {
      const list = [...(prev.platformCompanyLinks || defaultContactData.platformCompanyLinks || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, platformCompanyLinks: list };
    });
  };

  const addLegacyCard = () => {
    setConfig(prev => ({
      ...prev,
      legacyBrandCards: [...(prev.legacyBrandCards || defaultContactData.legacyBrandCards || []), { title: 'Brand Equity Name', stat: 'Key Result / Metric' }]
    }));
  };

  const removeLegacyCard = (index: number) => {
    setConfig(prev => ({
      ...prev,
      legacyBrandCards: (prev.legacyBrandCards || defaultContactData.legacyBrandCards || []).filter((_, i) => i !== index)
    }));
  };

  const updateLegacyCard = (index: number, key: 'title' | 'stat', value: string) => {
    setConfig(prev => {
      const list = [...(prev.legacyBrandCards || defaultContactData.legacyBrandCards || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, legacyBrandCards: list };
    });
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-16">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#1352D0] text-xs font-black mb-2">
            <Layout className="w-3.5 h-3.5" />
            <span>Website Footer CMS Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Manage Website Footer</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Update all 5 columns of the website footer, logo taglines, service cities, and copyright texts in real time.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3.5 bg-[#1352D0] hover:bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {msg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-black flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{msg}</span>
        </motion.div>
      )}

      {/* SECTION 1: FOOTER CMS CONTROLS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-[#1352D0]" />
          <span>Footer 5-Column Content Controls</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Footer Logo Taglines CMS Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-black uppercase text-indigo-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Column 1: Footer Logo Taglines & Brand Highlights (Under DIGIADS Logo)</span>
              </div>
              <button
                type="button"
                onClick={addFooterTagline}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-colors flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tagline</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600 font-medium">
              Edit the bullet points that display directly below/next to the DIGIADS logo in the website Footer.
            </p>

            <div className="space-y-3 pt-1">
              {(config.footerTaglines || defaultContactData.footerTaglines || []).map((tagline, idx) => (
                <div key={idx} className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => updateFooterTagline(idx, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-indigo-200 font-bold text-slate-900 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter tagline bullet text..."
                  />
                  <button
                    type="button"
                    onClick={() => removeFooterTagline(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Remove Tagline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Growth Divisions Links CMS */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-black uppercase text-blue-700">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Column 2: Growth Divisions Links CMS</span>
              </div>
              <button
                type="button"
                onClick={addGrowthLink}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Growth Link</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Column Heading</label>
              <input
                type="text"
                value={config.growthDivisionsHeading || defaultContactData.growthDivisionsHeading}
                onChange={(e) => setConfig({ ...config, growthDivisionsHeading: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white text-xs"
              />
            </div>

            <div className="space-y-3 pt-2">
              {(config.growthDivisionsLinks || defaultContactData.growthDivisionsLinks || []).map((link, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-slate-200">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Link Text</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateGrowthLink(idx, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Path / URL</label>
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => updateGrowthLink(idx, 'path', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeGrowthLink(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Platform & Company Links CMS */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-black uppercase text-purple-700">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Column 3: Platform & Company Links CMS</span>
              </div>
              <button
                type="button"
                onClick={addPlatformLink}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-colors flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Platform Link</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Column Heading</label>
              <input
                type="text"
                value={config.platformCompanyHeading || defaultContactData.platformCompanyHeading}
                onChange={(e) => setConfig({ ...config, platformCompanyHeading: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white text-xs"
              />
            </div>

            <div className="space-y-3 pt-2">
              {(config.platformCompanyLinks || defaultContactData.platformCompanyLinks || []).map((link, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-slate-200">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Link Text</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updatePlatformLink(idx, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Path / URL</label>
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => updatePlatformLink(idx, 'path', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removePlatformLink(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Footer City & Service Cities CMS Fields */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1352D0]">
              <Building2 className="w-4 h-4" />
              <span>Column 4: Service Cities & HQ City CMS Control</span>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Column Heading</label>
              <input
                type="text"
                value={config.serviceCitiesHeading || defaultContactData.serviceCitiesHeading}
                onChange={(e) => setConfig({ ...config, serviceCitiesHeading: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-blue-300 font-bold text-slate-900 bg-white text-xs mb-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Headquarter City (Top Footer Card)</label>
                <input
                  type="text"
                  value={config.city || 'Jaipur, Rajasthan, India'}
                  onChange={e => setConfig({ ...config, city: e.target.value })}
                  placeholder="e.g. Jaipur, Rajasthan, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1352D0]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Services Available In These Cities (Footer Locations List)</label>
                <input
                  type="text"
                  value={config.availableCities || 'Jaipur, Delhi NCR, Mumbai, Bangalore, Pune, Ahmedabad'}
                  onChange={e => setConfig({ ...config, availableCities: e.target.value })}
                  placeholder="e.g. Jaipur, Delhi NCR, Mumbai, Bangalore, Pune, Ahmedabad"
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1352D0]"
                />
              </div>
            </div>
          </div>

          {/* Column 5: Legacy Brand Equity Cards CMS */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-black uppercase text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Column 5: Legacy Brand Equity Cards CMS</span>
              </div>
              <button
                type="button"
                onClick={addLegacyCard}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Brand Card</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Column Heading</label>
              <input
                type="text"
                value={config.legacyBrandHeading || defaultContactData.legacyBrandHeading}
                onChange={(e) => setConfig({ ...config, legacyBrandHeading: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-amber-300 font-bold text-slate-900 bg-white text-xs"
              />
            </div>

            <div className="space-y-3 pt-2">
              {(config.legacyBrandCards || defaultContactData.legacyBrandCards || []).map((card, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-amber-200">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Card Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateLegacyCard(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle / Stat Metric</label>
                    <input
                      type="text"
                      value={card.stat}
                      onChange={(e) => updateLegacyCard(idx, 'stat', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeLegacyCard(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar Copyright & Security CMS */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bottom Footer Bar (Copyright & Security Badge)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Copyright Text</label>
                <input
                  type="text"
                  value={config.copyrightText || defaultContactData.copyrightText}
                  onChange={(e) => setConfig({ ...config, copyrightText: e.target.value })}
                  placeholder="e.g. Sumit DigiTech Pvt. Ltd. All rights reserved."
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 font-bold text-slate-900 bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Security Badge Label</label>
                <input
                  type="text"
                  value={config.securityText || defaultContactData.securityText}
                  onChange={(e) => setConfig({ ...config, securityText: e.target.value })}
                  placeholder="e.g. Enterprise Grade Security"
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 font-bold text-slate-900 bg-white text-xs"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
