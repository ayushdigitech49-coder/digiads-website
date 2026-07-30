import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, HelpCircle, CheckCircle2, Sparkles, FileText, MoveUp, MoveDown } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { defaultFaqData, type FaqConfigData, type FaqItem } from '../../data/faqData';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

export const AdminFaqPage: React.FC = () => {
  const [config, setConfig] = useState<FaqConfigData>(() => {
    const saved = localStorage.getItem('sumit_faq_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultFaqData;
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await adminService.getFaqConfig();
        if (res && res.success && res.faqConfig) {
          setConfig(res.faqConfig);
          localStorage.setItem('sumit_faq_config', JSON.stringify(res.faqConfig));
        }
      } catch (err) {
        console.warn('Failed loading FAQ config from API:', err);
      }
    };
    fetchFaqs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      localStorage.setItem('sumit_faq_config', JSON.stringify(config));
      await adminService.updateFaqConfig(config);
      notifyCmsUpdate('faq');
      setMsg('Homepage FAQs saved successfully!');
    } catch (err) {
      setMsg('Saved to local storage (Backend sync offline).');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const addFaqItem = () => {
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'New Question Here?',
      answer: 'Write comprehensive answer here...',
      category: 'General Growth',
    };
    setConfig(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeFaqItem = (index: number) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, key: keyof FaqItem, val: string) => {
    setConfig(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, items: updated };
    });
  };

  const moveFaq = (index: number, dir: -1 | 1) => {
    if (index + dir < 0 || index + dir >= config.items.length) return;
    setConfig(prev => {
      const nextItems = [...prev.items];
      const temp = nextItems[index];
      nextItems[index] = nextItems[index + dir];
      nextItems[index + dir] = temp;
      return { ...prev, items: nextItems };
    });
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-16">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#1352D0] text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Homepage FAQs Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Manage Homepage FAQs</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Add, edit, reorder, or remove FAQ questions and categories displayed on the Homepage.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3.5 bg-[#1352D0] hover:bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Publish FAQs'}</span>
        </button>
      </div>

      {msg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-black flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{msg}</span>
        </motion.div>
      )}

      {/* SECTION HEADER TEXT */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#1352D0]" />
          <span>Section Header Titles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Badge Tagline</label>
            <input
              type="text"
              value={config.sectionTag}
              onChange={e => setConfig({ ...config, sectionTag: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Section Main Title</label>
            <input
              type="text"
              value={config.sectionTitle}
              onChange={e => setConfig({ ...config, sectionTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Sub-Header Description</label>
            <input
              type="text"
              value={config.sectionSubtitle}
              onChange={e => setConfig({ ...config, sectionSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* FAQS MANAGER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#1352D0]" />
            <span>Homepage Questions ({config.items.length})</span>
          </h2>

          <button
            onClick={addFaqItem}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#1352D0] rounded-xl font-black text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {config.items.map((item, index) => (
            <div key={item.id || index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase text-blue-600 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                    Item #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={item.category}
                    onChange={e => updateItem(index, 'category', e.target.value)}
                    placeholder="Category (e.g. SEO, Retainer)"
                    className="px-3 py-1 rounded-lg border border-slate-300 font-bold text-xs text-slate-700 bg-white"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveFaq(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 rounded cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFaq(index, 1)}
                    disabled={index === config.items.length - 1}
                    className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 rounded cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFaqItem(index)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Question</label>
                <input
                  type="text"
                  value={item.question}
                  onChange={e => updateItem(index, 'question', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Answer</label>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={e => updateItem(index, 'answer', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 bg-white text-sm leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
