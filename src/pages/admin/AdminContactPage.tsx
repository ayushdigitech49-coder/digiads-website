import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Phone, Mail, MapPin, Sparkles, CheckCircle2, MessageCircle, FileText } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { defaultContactData, type ContactConfigData, type ContactFaqItem } from '../../data/contactData';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export const AdminContactPage: React.FC = () => {
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
        console.warn('Failed loading contact config from backend:', err);
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
      setMsg('Contact Page settings saved successfully!');
    } catch (err) {
      setMsg('Saved to local storage (Backend sync failed).');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const addFaq = () => {
    setConfig(prev => ({
      ...prev,
      faqs: [...prev.faqs, { q: 'New Question?', a: 'Detailed answer here...' }]
    }));
  };

  const removeFaq = (index: number) => {
    setConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const updateFaq = (index: number, key: 'q' | 'a', value: string) => {
    setConfig(prev => {
      const nextFaqs = [...prev.faqs];
      nextFaqs[index] = { ...nextFaqs[index], [key]: value };
      return { ...prev, faqs: nextFaqs };
    });
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-16">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#1352D0] text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contact Page CMS Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Manage Contact Us Page</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Update phone numbers, WhatsApp, email, office address, hero titles, and FAQs in real time.</p>
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

      {/* SECTION 1: CONTACT CHANNELS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <Phone className="w-5 h-5 text-[#1352D0]" />
          <span>Contact Channels (Phone, WhatsApp, Email, Office)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Phone */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1352D0]">
              <Phone className="w-4 h-4" />
              <span>Direct Phone Hotline</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number</label>
              <input
                type="text"
                value={config.phone}
                onChange={e => setConfig({ ...config, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Hours Subtext</label>
              <input
                type="text"
                value={config.phoneHours}
                onChange={e => setConfig({ ...config, phoneHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-emerald-600">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp VIP Desk</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={config.whatsapp}
                onChange={e => setConfig({ ...config, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Response Time Subtext</label>
              <input
                type="text"
                value={config.whatsappResponseTime}
                onChange={e => setConfig({ ...config, whatsappResponseTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-blue-600">
              <Mail className="w-4 h-4" />
              <span>Official Email</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
              <input
                type="text"
                value={config.email}
                onChange={e => setConfig({ ...config, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">SLA Guarantee Subtext</label>
              <input
                type="text"
                value={config.emailSla}
                onChange={e => setConfig({ ...config, emailSla: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Office */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-red-600">
              <MapPin className="w-4 h-4" />
              <span>Jaipur HQ Address</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Address Line 1</label>
              <input
                type="text"
                value={config.officeAddressLine1}
                onChange={e => setConfig({ ...config, officeAddressLine1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Address Line 2 (City, State, Pincode)</label>
              <input
                type="text"
                value={config.officeAddressLine2}
                onChange={e => setConfig({ ...config, officeAddressLine2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
              />
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: HERO & META SETTINGS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#1352D0]" />
          <span>Hero Header & Meta SEO Settings</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hero Badge Text</label>
            <input
              type="text"
              value={config.heroBadge}
              onChange={e => setConfig({ ...config, heroBadge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hero Title (Line 1)</label>
            <input
              type="text"
              value={config.heroTitleLine1}
              onChange={e => setConfig({ ...config, heroTitleLine1: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hero Title (Highlight Word)</label>
            <input
              type="text"
              value={config.heroTitleHighlight}
              onChange={e => setConfig({ ...config, heroTitleHighlight: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-[#D91212] bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">SEO Meta Title</label>
            <input
              type="text"
              value={config.metaTitle || ''}
              onChange={e => setConfig({ ...config, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Hero Sub-Description</label>
            <textarea
              rows={3}
              value={config.heroDescription}
              onChange={e => setConfig({ ...config, heroDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: FAQS EDITOR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#F4B400]" />
            <span>Contact FAQs ({config.faqs?.length || 0})</span>
          </h2>
          <button
            onClick={addFaq}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1352D0] font-black text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {config.faqs?.map((faq, index) => (
            <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500">FAQ Item #{index + 1}</span>
                <button
                  onClick={() => removeFaq(index)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Question</label>
                <input
                  type="text"
                  value={faq.q}
                  onChange={e => updateFaq(index, 'q', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Answer</label>
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={e => updateFaq(index, 'a', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 font-medium text-slate-800 bg-white text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
