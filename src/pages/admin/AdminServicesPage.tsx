import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Search, Plus, Edit2, Trash2, Eye, X, Sparkles,
  Zap, Globe, Code, CheckCircle2
} from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { servicesData } from '../../data/servicesData';
import type { ServiceItem } from '../../types';
import { Swal } from '../../utils/swal';
import { adminService } from '../../services/admin.service';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

const iconOptions = ['Search', 'TrendingUp', 'Code2', 'Share2', 'Palette', 'Cpu', 'Zap', 'Layers', 'Target', 'Star'];

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('sumit_dynamic_services');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return servicesData;
  });

  const loadBackendServices = async () => {
    try {
      const res = await adminService.getServices();
      if (res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        setServices(res.services);
        localStorage.setItem('sumit_dynamic_services', JSON.stringify(res.services));
      }
    } catch (e) {
      console.warn('[AdminServicesPage] Could not load services from backend:', e);
    }
  };

  useEffect(() => {
    loadBackendServices();
  }, []);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<ServiceItem>>({
    title: '',
    category: 'SEO',
    shortDesc: '',
    fullDesc: '',
    iconName: 'Search',
    features: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    metaSlug: '',
    customScript: ''
  });

  const [featureInput, setFeatureInput] = useState('');

  const filtered = services.filter(s => !search || `${s.title} ${s.category} ${s.shortDesc}`.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => {
    setForm({
      title: '',
      category: 'SEO',
      shortDesc: '',
      fullDesc: '',
      iconName: 'Search',
      features: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      metaSlug: '',
      customScript: ''
    });
    setEditingId(null);
    setFeatureInput('');
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setForm({ ...s });
    setModalOpen(true);
  };

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
    if (!form.title) {
      Swal.toast('Service Title is required', 'error');
      return;
    }

    const computedSlug = form.metaSlug || (form.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let updatedList: ServiceItem[];
    if (editingId) {
      updatedList = services.map(s => s.id === editingId ? ({
        ...s,
        ...form,
        slug: computedSlug,
        metaSlug: computedSlug,
      }) as ServiceItem : s);
    } else {
      const newServ: ServiceItem = {
        id: `service-${Date.now()}`,
        slug: computedSlug,
        metaSlug: computedSlug,
        title: form.title!,
        category: (form.category as any) || 'SEO',
        shortDesc: form.shortDesc || '',
        fullDesc: form.fullDesc || form.shortDesc || '',
        iconName: form.iconName || 'Zap',
        features: form.features || ['Enterprise SLA & Dedicated Manager'],
        metrics: [{ label: 'Avg Growth Lift', value: '+240%' }],
        deliverables: ['Custom Strategy Matrix', 'Monthly Analytics Portal'],
        faqs: form.faqs || [],
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.shortDesc,
        metaKeywords: form.metaKeywords || (form.features || []).join(', '),
        customScript: form.customScript || ''
      };
      updatedList = [...services, newServ];
    }

    setServices(updatedList);
    localStorage.setItem('sumit_dynamic_services', JSON.stringify(updatedList));

    try {
      await adminService.updateServices(updatedList);
    } catch (err) {
      console.warn('[AdminServicesPage] Backend update failed:', err);
    }

    notifyCmsUpdate('services');
    Swal.toast(editingId ? `${form.title} updated!` : `New Service ${form.title} created!`, 'success');

    resetForm();
    setModalOpen(false);
  };

  const remove = async (id: string, title: string) => {
    const confirm = await Swal.fire({
      title: `Delete ${title}?`,
      text: 'Are you sure you want to delete this service division?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Service',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
    });

    if (confirm.isConfirmed) {
      const updatedList = services.filter(s => s.id !== id);
      setServices(updatedList);
      localStorage.setItem('sumit_dynamic_services', JSON.stringify(updatedList));

      try {
        await adminService.deleteService(id);
      } catch (err) {
        console.warn('[AdminServicesPage] Backend delete failed:', err);
      }

      notifyCmsUpdate('services');
      Swal.toast(`${title} deleted`, 'warning');
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in font-sans">
      
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1352D0] via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Growth Divisions CMS</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Services & Divisions Manager</h1>
              <p className="text-sm text-blue-100 font-medium mt-1 max-w-xl">
                Add, update, or edit dynamic services, icons, TinyMCE content, and Meta SEO tags. Changes populate live across the frontend.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={openAdd} className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1352D0] text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-2 cursor-pointer">
              <Plus className="w-4.5 h-4.5 text-[#1352D0]" /><span>Add New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search service title, category, description…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#1352D0]">{filtered.length} Active Services</span>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((sec, idx) => (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1352D0] font-black shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase text-slate-600 tracking-wider">
                    {sec.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{sec.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                    {sec.shortDesc}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Features Included:</div>
                  {(sec.features || []).slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">/{sec.slug}</span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/services/${sec.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                    title="Preview Service Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button onClick={() => openEdit(sec)} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-[#1352D0] hover:text-white text-slate-600 transition-all cursor-pointer" title="Edit Service Modal">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(sec.id, sec.title)} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-red-600 hover:text-white text-red-600 transition-all cursor-pointer" title="Delete Service">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EDIT / CREATE MODAL FORM */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10 text-slate-900"
            >
              {/* Modal Header */}
              <div className="border-b border-slate-200 px-6 sm:px-8 py-5 shrink-0 bg-gradient-to-r from-blue-50/60 via-slate-50 to-indigo-50/60 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">
                    {editingId ? 'Edit Service & SEO' : 'New Growth Service'}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingId ? 'Edit Service & SEO Details' : 'Add New Service Division'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                <form onSubmit={submit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-[#1352D0] border-b border-slate-100 pb-2">
                      1. Service Overview & Category
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Service Title *
                        </label>
                        <input
                          required
                          value={form.title || ''}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Search Engine Optimization (SEO)"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Category / Division
                        </label>
                        <input
                          value={form.category || ''}
                          onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                          placeholder="e.g. SEO / Performance Marketing / Web Development"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Icon Style
                        </label>
                        <select
                          value={form.iconName || 'Search'}
                          onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                        >
                          {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Custom Slug (URL)
                        </label>
                        <input
                          value={form.metaSlug || ''}
                          onChange={(e) => setForm({ ...form, metaSlug: e.target.value })}
                          placeholder="e.g. seo-services-jaipur"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Short Summary *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={form.shortDesc || ''}
                        onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                        placeholder="Brief 1-2 line summary of what this service delivers..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-xs font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* SEO Meta Tags */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="text-xs font-black uppercase tracking-wider text-purple-700 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                      <Globe className="w-4 h-4" />
                      <span>2. Search Engine Optimization (SEO Meta Tags)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Meta Title
                        </label>
                        <input
                          value={form.metaTitle || ''}
                          onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                          placeholder="Page Title for Google Search Results..."
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Meta Keywords
                        </label>
                        <input
                          value={form.metaKeywords || ''}
                          onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                          placeholder="e.g. SEO Jaipur, Rank Google, Core Web Vitals"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={form.metaDescription || ''}
                        onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                        placeholder="Search Snippet description (150-160 characters)..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-xs font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* TinyMCE Rich Text Editor */}
                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <div className="text-xs font-black uppercase tracking-wider text-[#1352D0] border-b border-slate-100 pb-2">
                      3. Service Detailed Content (TinyMCE Rich Text Editor)
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                      <Editor
                        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
                        value={form.fullDesc || ''}
                        onEditorChange={(content) => setForm({ ...form, fullDesc: content })}
                        init={{
                          height: 320,
                          menubar: false,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                          ],
                          toolbar:
                            'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | link table code | help',
                          content_style: 'body { font-family:Inter,sans-serif; font-size:14px }'
                        }}
                      />
                    </div>
                  </div>

                  {/* Custom Script / Schema */}
                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                      <Code className="w-4 h-4" />
                      <span>4. Custom Script / Schema JSON-LD Code</span>
                    </div>
                    <textarea
                      rows={3}
                      value={form.customScript || ''}
                      onChange={(e) => setForm({ ...form, customScript: e.target.value })}
                      placeholder='<script type="application/ld+json">...</script> or Google Tracking Script'
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-amber-300 font-mono text-xs focus:outline-none border border-slate-800"
                    />
                  </div>

                  {/* Features Deliverables List */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      5. Feature Deliverables Bullet Points
                    </label>
                    <div className="flex space-x-2">
                      <input
                        value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        placeholder="Add feature bullet point..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2.5 bg-blue-50 text-[#1352D0] font-black text-xs rounded-xl border border-blue-200 hover:bg-[#1352D0] hover:text-white transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(form.features || []).map((feat, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{feat}</span>
                          </div>
                          <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 px-6 sm:px-8 py-4 shrink-0 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Editing Service & SEO Info
                </span>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                    <span>{editingId ? 'Save Changes' : 'Publish Service'}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
