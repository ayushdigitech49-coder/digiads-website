import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Plus, Edit2, Trash2, Filter, X, Check,
  Sparkles, Clock, User as UserIcon, Layers, HelpCircle, Tag, Eye,
  Globe, Code, FileText, Type
} from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import type { BlogPost } from '../../types';
import { getStoredBlogPosts, saveStoredBlogPosts, subscribeBlogUpdates } from '../../utils/blogStore';

const categoryColor: Record<string, string> = {
  'SEO Strategy': 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
  'Performance Marketing': 'bg-blue-50 text-blue-700 border-blue-200 border',
  'Web Development': 'bg-sky-50 text-sky-700 border-sky-200 border',
  'Social Media': 'bg-pink-50 text-pink-700 border-pink-200 border',
  'Branding': 'bg-purple-50 text-purple-700 border-purple-200 border',
  'AI Marketing': 'bg-amber-50 text-amber-700 border-amber-200 border',
  'Content Marketing': 'bg-orange-50 text-orange-700 border-orange-200 border',
};

export const AdminBlogPage: React.FC = () => {
  const editorRef = React.useRef<any>(null);
  const [items, setItems] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Active tab inside Modal: 'blog' (Blog & SEO Details) | 'faq' (FAQs)
  const [activeModalTab, setActiveModalTab] = useState<'blog' | 'faq'>('blog');

  // FAQ state inside form modal
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const [form, setForm] = useState<Partial<BlogPost> & { draft?: boolean }>({
    title: '',
    category: 'SEO Strategy',
    excerpt: '',
    content: '',
    image: '',
    readTime: '6 min read',
    publishedAt: new Date().toISOString(),
    author: {
      name: 'Sumit Sharma',
      role: 'Founder & Chief Growth Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    tags: [],
    faqs: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    metaSlug: '',
    customScript: '',
    draft: true,
  });

  useEffect(() => {
    return subscribeBlogUpdates((updatedPosts) => {
      setItems(updatedPosts);
    });
  }, []);

  const availablePresets = useMemo(() => {
    const defaults = ['Performance Marketing', 'SEO Strategy', 'Web Development', 'Social Media', 'AI Marketing', 'Branding', 'Content Writing', 'Digital Marketing', 'Website Design', 'E-commerce Growth'];
    const fromPosts = items.map(i => i.category).filter(Boolean);
    return Array.from(new Set([...defaults, ...fromPosts]));
  }, [items]);

  const cats = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.category)))], [items]);
  const catCls = (c: string) => categoryColor[c] || 'bg-slate-100 text-slate-700 border-slate-200 border';

  const filtered = useMemo(() => items.filter(p => {
    const s = !search || `${p.title} ${p.author.name} ${p.category} ${(p.tags || []).join(' ')} ${p.excerpt} ${p.metaTitle || ''} ${p.metaKeywords || ''}`.toLowerCase().includes(search.toLowerCase());
    const c = activeCat === 'All' || p.category === activeCat;
    return s && c;
  }), [items, search, activeCat]);

  const resetForm = () => {
    setForm({
      title: '',
      category: 'SEO Strategy',
      excerpt: '',
      content: '',
      image: '',
      readTime: '6 min read',
      publishedAt: new Date().toISOString(),
      author: {
        name: 'Sumit Sharma',
        role: 'Founder & Chief Growth Officer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      tags: [],
      faqs: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      metaSlug: '',
      customScript: '',
      draft: true,
    });
    setTagInput('');
    setNewFaqQ('');
    setNewFaqA('');
    setEditingId(null);
    setActiveModalTab('blog');
  };

  const openAdd = () => { resetForm(); setDrawerOpen(true); };

  const openEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setForm({
      ...p,
      faqs: p.faqs ? [...p.faqs] : [],
      tags: p.tags ? [...p.tags] : [],
      metaTitle: p.metaTitle || p.title || '',
      metaDescription: p.metaDescription || p.excerpt || '',
      metaKeywords: p.metaKeywords || (p.tags || []).join(', '),
      metaSlug: p.metaSlug || p.slug || '',
      customScript: p.customScript || '',
      draft: false
    });
    setNewFaqQ('');
    setNewFaqA('');
    setActiveModalTab('blog');
    setDrawerOpen(true);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!form.tags?.includes(cleanTag)) {
      setForm(prev => ({ ...prev, tags: [...(prev.tags || []), cleanTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setForm(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: newFaqQ.trim(), answer: newFaqA.trim() }]
    }));
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (index: number) => {
    setForm(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    // Generate slug from metaSlug or title
    const computedSlug = (form.metaSlug || form.slug || form.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let updatedList: BlogPost[];

    if (editingId) {
      updatedList = items.map(i => i.id === editingId ? ({
        ...i,
        ...form,
        slug: computedSlug,
        metaSlug: computedSlug,
      }) as BlogPost : i);
      setMessage('Article, SEO & FAQs updated successfully');
    } else {
      const n: BlogPost = {
        id: `b-${Date.now()}`,
        slug: computedSlug,
        metaSlug: computedSlug,
        title: form.title!,
        excerpt: form.excerpt || '',
        content: form.content || '',
        author: form.author || {
          name: 'Sumit Sharma',
          role: 'Founder & Chief Growth Officer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        category: form.category || 'SEO Strategy',
        publishedAt: form.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        readTime: form.readTime || '6 min read',
        image: form.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop',
        tags: form.tags || [],
        faqs: form.faqs || [],
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.excerpt,
        metaKeywords: form.metaKeywords || (form.tags || []).join(', '),
        customScript: form.customScript || ''
      };
      updatedList = [n, ...items];
      setMessage('New article, SEO & FAQs published live');
    }

    setItems(updatedList);
    saveStoredBlogPosts(updatedList);

    resetForm();
    setDrawerOpen(false);
    setTimeout(() => setMessage(''), 3500);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveStoredBlogPosts(updated);
    setMessage('Post removed');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="space-y-7 animate-in fade-in">
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-xl">
          <Check className="w-4 h-4" /><span>{message}</span>
        </motion.div>
      )}

      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Editorial CMS & SEO</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Blog Articles, Meta SEO & FAQs</h1>
              <p className="text-sm text-violet-100 font-medium mt-1 max-w-xl">
                Control frontend blogs, TinyMCE content, Meta Title, Description, Meta Keywords, Custom Slug, Custom Scripts & FAQs.
              </p>
            </div>
          </div>
          <button onClick={openAdd} className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-purple-700 text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer">
            <Plus className="w-4.5 h-4.5 text-purple-700" /><span>Write New Post</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Total Articles', v: items.length, i: BookOpen, c: 'text-purple-600', bg: 'bg-purple-50' },
          { l: 'Categories', v: cats.length - 1, i: Layers, c: 'text-amber-600', bg: 'bg-amber-50' },
          { l: 'Total FAQs', v: items.reduce((acc, curr) => acc + (curr.faqs?.length || 0), 0), i: HelpCircle, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { l: 'Avg Read Time', v: `${Math.round(items.reduce((a, b) => a + parseInt(b.readTime || '0'), 0) / Math.max(items.length, 1))} min`, i: Clock, c: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {/* FILTER BAR */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts, authors, tags, meta keywords…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            {cats.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border cursor-pointer ${
                activeCat === c ? 'bg-[#1352D0] text-white border-[#1352D0] shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}>{c}</button>
            ))}
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-600 shrink-0">{filtered.length} Results</span>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Article & Slug</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">SEO & FAQs</th>
                <th className="px-6 py-4">Read Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <AnimatePresence>
                {filtered.map((p, idx) => (
                  <motion.tr key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={p.image} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0 max-w-md">
                          <div className="font-black text-slate-900 truncate leading-tight">{p.title}</div>
                          <div className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                            /blog/<span className="text-purple-600 font-extrabold">{p.metaSlug || p.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${catCls(p.category)}`}>{p.category}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2.5">
                        <img src={p.author.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <div className="text-xs font-black text-slate-900">{p.author.name}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase">{p.author.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-100">
                          <Globe className="w-3 h-3" />
                          <span>Meta SEO</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-100">
                          <HelpCircle className="w-3 h-3" />
                          <span>{p.faqs?.length || 0} FAQs</span>
                        </span>
                      </div>
                      {p.customScript && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[9px] font-extrabold border border-amber-200">
                          <Code className="w-2.5 h-2.5" />
                          <span>Custom Script</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-black text-purple-700">{p.readTime}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <a
                          href={`/blog/${p.metaSlug || p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-100 transition-all cursor-pointer inline-flex items-center justify-center"
                          title="View Blog Details Page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => openEdit(p)} className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-100 transition-all cursor-pointer" title="Edit Post, SEO & FAQs">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(p.id)} className="p-2.5 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-100 transition-all cursor-pointer" title="Delete Post">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / CREATE MODAL WITH TABBED NAVIGATION */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
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
              {/* Modal Header with TAB SWITCHER */}
              <div className="border-b border-slate-200 px-6 sm:px-8 py-5 shrink-0 bg-gradient-to-r from-purple-50/60 via-slate-50 to-blue-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-0.5">
                    {editingId ? 'Edit Article & SEO' : 'New Article'}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingId ? 'Edit Blog Post, SEO & FAQs' : 'Write New Blog Post'}
                  </h3>
                </div>

                {/* MODAL TABS: BLOG | FAQ */}
                <div className="flex items-center space-x-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('blog')}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
                      activeModalTab === 'blog'
                        ? 'bg-purple-700 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Blog</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('faq')}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
                      activeModalTab === 'faq'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>FAQ ({form.faqs?.length || 0})</span>
                  </button>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-xs self-start sm:self-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Content */}
              <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 bg-white">
                
                {/* TAB 1: BLOG ARTICLE DETAILS & SEO FIELDS */}
                {activeModalTab === 'blog' && (
                  <div className="space-y-7 animate-in fade-in duration-200">
                    
                    {/* SECTION 1: BASIC INFO */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 border-b border-purple-100 pb-2 flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>1. Basic Article Information</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Post Title *
                        </label>
                        <input
                          required
                          value={form.title || ''}
                          onChange={e => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. The 2026 SEO Blueprint: How to Rank in AI Search"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Category *</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              required
                              value={form.category || ''}
                              onChange={e => setForm({ ...form, category: e.target.value })}
                              placeholder="e.g. Performance Marketing, SEO Strategy"
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                            />
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5 text-[11px] font-bold text-slate-500">
                              <span className="text-slate-400 font-semibold">Quick Presets:</span>
                              {availablePresets.map(c => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setForm({ ...form, category: c })}
                                  className={`px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                                    form.category === c ? 'bg-purple-700 text-white border-purple-700 shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Publish Date 📅
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={form.publishedAt || ''}
                              onChange={e => setForm({ ...form, publishedAt: e.target.value })}
                              placeholder="e.g. July 30, 2026"
                              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                            />
                            <input
                              type="date"
                              onChange={e => {
                                if (e.target.value) {
                                  const d = new Date(e.target.value);
                                  const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                                  setForm({ ...form, publishedAt: formatted });
                                }
                              }}
                              className="px-3 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
                              title="Select Date from Calendar"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 font-medium">Type manually or pick from calendar</p>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Read Time</label>
                          <input
                            value={form.readTime || ''}
                            onChange={e => setForm({ ...form, readTime: e.target.value })}
                            placeholder="e.g. 6 min read"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Cover Image URL
                        </label>
                        <input
                          value={form.image || ''}
                          onChange={e => setForm({ ...form, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Excerpt / Short Summary
                        </label>
                        <textarea
                          rows={2}
                          value={form.excerpt || ''}
                          onChange={e => setForm({ ...form, excerpt: e.target.value })}
                          placeholder="Brief overview of the article for blog cards..."
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* SECTION 2: SEO META TAGS & CUSTOM SLUG */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-emerald-600" />
                          <span>2. Search Engine Optimization (SEO Meta Tags & URL)</span>
                        </h4>
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          Google Search Ready
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Meta Title
                          </label>
                          <input
                            value={form.metaTitle || ''}
                            onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                            placeholder="e.g. 2026 SEO Blueprint: Rank #1 on Google AI Overviews & SearchGPT"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                          />
                          <p className="text-[11px] text-slate-400 mt-1 font-medium">Recommended length: 55-60 characters</p>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Meta Custom Slug / URL
                          </label>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-500">
                              /blog/
                            </span>
                            <input
                              value={form.metaSlug || ''}
                              onChange={e => setForm({ ...form, metaSlug: e.target.value })}
                              placeholder="seo-strategy-2026-ai-search"
                              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-bold text-purple-700 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Meta Description
                          </label>
                          <textarea
                            rows={3}
                            value={form.metaDescription || ''}
                            onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                            placeholder="Compelling meta description for search engine result snippets..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-bold text-slate-900 focus:outline-none transition-all resize-none"
                          />
                          <p className="text-[11px] text-slate-400 mt-1 font-medium">Recommended length: 150-160 characters</p>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Meta Keywords (comma separated)
                          </label>
                          <input
                            value={form.metaKeywords || ''}
                            onChange={e => setForm({ ...form, metaKeywords: e.target.value })}
                            placeholder="SEO 2026, AI Search, Google AI Overviews, SearchGPT, Headless SEO"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                              Canonical URL (rel="canonical")
                            </label>
                            <input
                              value={form.canonicalUrl || ''}
                              onChange={e => setForm({ ...form, canonicalUrl: e.target.value })}
                              placeholder="https://sumitdigitech.com/blog/your-slug"
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                            />
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">Master URL to avoid duplicate penalty. Auto-generated if left blank.</p>
                          </div>

                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                              Robots Meta Tag (Crawling Instructions)
                            </label>
                            <select
                              value={form.metaRobots || 'index, follow, max-image-preview:large, max-snippet:-1'}
                              onChange={e => setForm({ ...form, metaRobots: e.target.value })}
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm font-bold text-slate-900 focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                              <option value="index, follow, max-image-preview:large, max-snippet:-1">index, follow (Default — Index & Follow links)</option>
                              <option value="noindex, follow">noindex, follow (Hide from Google, follow links)</option>
                              <option value="index, nofollow">index, nofollow (Index on Google, don't follow links)</option>
                              <option value="noindex, nofollow">noindex, nofollow (Completely hide from search engines)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: AUTHOR DETAILS */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 border-b border-purple-100 pb-2 flex items-center space-x-2">
                        <UserIcon className="w-4 h-4" />
                        <span>3. Author Details</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Author Name</label>
                          <input
                            value={form.author?.name || ''}
                            onChange={e => setForm({ ...form, author: { ...form.author!, name: e.target.value } })}
                            placeholder="Sumit Sharma"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Author Role</label>
                          <input
                            value={form.author?.role || ''}
                            onChange={e => setForm({ ...form, author: { ...form.author!, role: e.target.value } })}
                            placeholder="Founder & CGO"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Avatar Image URL</label>
                          <input
                            value={form.author?.avatar || ''}
                            onChange={e => setForm({ ...form, author: { ...form.author!, avatar: e.target.value } })}
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: TINYMCE RICH TEXT EDITOR WITH H1-H6 QUICK HEADING TOOLBAR */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>4. Article Body (TinyMCE Rich Text Editor & Heading Controls)</span>
                        </h4>
                        <span className="text-[10px] font-black uppercase text-white bg-[#1352D0] px-2.5 py-1 rounded-lg">
                          H1–H6 Headings Enabled
                        </span>
                      </div>

                      {/* QUICK HEADING LEVEL SELECTOR TOOLBAR */}
                      <div className="bg-[#1D2B53] text-white p-3 sm:p-3.5 rounded-t-2xl border border-[#1D2B53] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="text-xs font-black uppercase text-amber-400 mr-1 flex items-center space-x-1">
                            <Type className="w-3.5 h-3.5" />
                            <span>Heading Level:</span>
                          </span>
                          {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((hTag) => (
                            <button
                              key={hTag}
                              type="button"
                              onClick={() => {
                                if (editorRef.current) {
                                  editorRef.current.execCommand('FormatBlock', false, hTag.toLowerCase());
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#1352D0] hover:text-white border border-white/20 text-white text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                              title={`Convert selected paragraph to ${hTag}`}
                            >
                              {hTag}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              if (editorRef.current) {
                                editorRef.current.execCommand('FormatBlock', false, 'p');
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-slate-700 border border-white/20 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                            title="Convert to Paragraph"
                          >
                            Paragraph
                          </button>
                        </div>

                        <div className="text-[11px] font-medium text-slate-300">
                          ✨ Select text & click <strong>H1–H6</strong> or use <em>Blocks</em> dropdown below
                        </div>
                      </div>

                      {/* TINYMCE EDITOR CONTAINER */}
                      <div className="border border-slate-200 rounded-b-2xl overflow-hidden shadow-xs border-t-0">
                        <Editor
                          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
                          value={form.content || ''}
                          onInit={(_evt, editor) => { editorRef.current = editor; }}
                          onEditorChange={(newContent) => setForm(prev => ({ ...prev, content: newContent }))}
                          init={{
                            height: 440,
                            menubar: false,
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre; Quote=blockquote',
                            toolbar: 'undo redo | blocks formatselect | ' +
                              'bold italic underline strikethrough forecolor backcolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | link image table | code fullscreen help',
                            content_style: `
                              body { font-family: Inter, Helvetica, Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.7; padding: 12px; }
                              h1 { font-size: 2.25rem; font-weight: 900; color: #1d2b53; margin-top: 1.5rem; margin-bottom: 0.75rem; line-height: 1.25; }
                              h2 { font-size: 1.75rem; font-weight: 800; color: #1352d0; margin-top: 1.25rem; margin-bottom: 0.5rem; line-height: 1.3; }
                              h3 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-top: 1rem; margin-bottom: 0.5rem; }
                              h4 { font-size: 1.2rem; font-weight: 700; color: #334155; margin-top: 0.85rem; margin-bottom: 0.4rem; }
                              h5 { font-size: 1.05rem; font-weight: 700; color: #475569; margin-top: 0.75rem; margin-bottom: 0.3rem; }
                              h6 { font-size: 0.95rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.65rem; margin-bottom: 0.25rem; }
                            `,
                            branding: false
                          }}
                        />
                      </div>
                    </div>

                    {/* SECTION 5: TAGS */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 border-b border-purple-100 pb-2 flex items-center space-x-2">
                        <Tag className="w-4 h-4" />
                        <span>5. Tags</span>
                      </h4>
                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                          placeholder="Add tag (press Enter or Add)..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-black hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          Add Tag
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(form.tags || []).map((t, idx) => (
                          <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                            <span>#{t}</span>
                            <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-red-600 cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 6: CUSTOM SCRIPT / TRACKING HEADER SCRIPT */}
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                          <Code className="w-4 h-4 text-amber-600" />
                          <span>6. Custom Script / Tracking Code</span>
                        </h4>
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">HTML / JS Code</span>
                      </div>
                      <textarea
                        rows={4}
                        value={form.customScript || ''}
                        onChange={e => setForm({ ...form, customScript: e.target.value })}
                        placeholder={`<!-- Custom Analytics, Pixel or Schema JSON-LD -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting"\n}\n</script>`}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none border border-slate-800 transition-all resize-none"
                      />
                      <p className="text-[11px] text-slate-400 font-medium">
                        Inject custom tracking scripts, Google Tag Manager snippets, or Schema JSON-LD structured data for this post.
                      </p>
                    </div>

                  </div>
                )}

                {/* TAB 2: FAQ QUESTIONS & ANSWERS */}
                {activeModalTab === 'faq' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>FAQs (Frequently Asked Questions)</span>
                      </h4>
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {form.faqs?.length || 0} Questions Added
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Add and manage questions for this blog article. These questions will be displayed on the frontend article page.
                    </p>

                    {/* EXISTING QUESTIONS LIST */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Existing Questions ({form.faqs?.length || 0})</h5>
                      
                      {(form.faqs || []).length === 0 ? (
                        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-400 font-bold">
                          No FAQ questions added yet for this post. Add questions below.
                        </div>
                      ) : (
                        (form.faqs || []).map((faq, index) => (
                          <div key={index} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 relative group hover:border-blue-200 transition-all">
                            <div className="flex justify-between items-start">
                              <div className="font-extrabold text-slate-900 text-sm">
                                <span className="text-blue-600 mr-2 font-black">Q{index + 1}:</span>
                                {faq.question}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(index)}
                                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shrink-0 ml-2 cursor-pointer shadow-xs"
                                title="Remove FAQ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100 font-medium">
                              <span className="font-bold text-slate-500 mr-1">Answer:</span>
                              {faq.answer}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* ADD NEW FAQ QUESTION FORM */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4 shadow-xs">
                      <div className="text-xs font-extrabold text-blue-900 flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span>Add New Question & Answer</span>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-blue-900 mb-1.5">Question Title *</label>
                        <input
                          value={newFaqQ}
                          onChange={e => setNewFaqQ(e.target.value)}
                          placeholder="e.g. What is entity-based SEO and why is it essential in 2026?"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-blue-900 mb-1.5">Answer Content *</label>
                        <textarea
                          rows={3}
                          value={newFaqA}
                          onChange={e => setNewFaqA(e.target.value)}
                          placeholder="Provide a comprehensive answer to this question..."
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        disabled={!newFaqQ.trim() || !newFaqA.trim()}
                        className="px-5 py-3 rounded-xl bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Question to List</span>
                      </button>
                    </div>

                  </div>
                )}

              </form>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 p-5 flex items-center justify-between shrink-0 bg-slate-50">
                <div className="text-xs font-bold text-slate-500">
                  {activeModalTab === 'blog' ? (
                    <span>Editing Blog Article Details, SEO Meta Tags & Content</span>
                  ) : (
                    <span>Editing {form.faqs?.length || 0} FAQ Questions</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                    <span>{editingId ? 'Save Changes' : 'Publish Article'}</span>
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
