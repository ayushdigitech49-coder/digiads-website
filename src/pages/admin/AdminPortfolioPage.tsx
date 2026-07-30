import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Tag,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Layers,
  Users,
  Link as LinkIcon,
  Hash,
  Zap,
  Save,
  RefreshCw,
  Database,
  Cloud
} from 'lucide-react';
import { portfolioData, defaultPortfolioStats, defaultPortfolioClients, type PortfolioStatItem, type PortfolioClientItem } from '../../data/portfolioData';
import type { PortfolioItem } from '../../types';
import { adminService } from '../../services/admin.service';
import { notifyCmsUpdate } from '../../utils/broadcastSync';
import { Swal } from '../../utils/swal.tsx';

const categoryBadgeStyles: Record<string, string> = {
  SEO: 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
  'SEO & Brand Marketing': 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
  'Performance Marketing': 'bg-blue-50 text-blue-700 border-blue-200 border',
  'Web Development & Performance': 'bg-sky-50 text-sky-700 border-sky-200 border',
  'Web Development': 'bg-sky-50 text-sky-700 border-sky-200 border',
  'Social Media': 'bg-pink-50 text-pink-700 border-pink-200 border',
  'Branding & Social Media': 'bg-purple-50 text-purple-700 border-purple-200 border',
  Branding: 'bg-purple-50 text-purple-700 border-purple-200 border',
  'AI Marketing': 'bg-amber-50 text-amber-700 border-amber-200 border',
  'Local & Enterprise SEO': 'bg-teal-50 text-teal-700 border-teal-200 border',
};

const getBadge = (c: string) => categoryBadgeStyles[c] || 'bg-slate-100 text-slate-700 border-slate-200 border';

const LOCAL_KEY = 'sumit_portfolio_data';
const LOCAL_STATS_KEY = 'sumit_portfolio_stats';
const LOCAL_CLIENTS_KEY = 'sumit_portfolio_clients';

export const AdminPortfolioPage: React.FC = () => {
  const [activeTabSection, setActiveTabSection] = useState<'projects' | 'stats' | 'clients'>('projects');
  const [items, setItems] = useState<PortfolioItem[]>(portfolioData);
  const [statsList, setStatsList] = useState<PortfolioStatItem[]>(defaultPortfolioStats);
  const [clientsList, setClientsList] = useState<PortfolioClientItem[]>(defaultPortfolioClients);

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [sortKey, setSortKey] = useState<'newest' | 'client' | 'cat'>('newest');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PortfolioItem>>({
    title: '', client: '', category: 'SEO & Brand Marketing', image: '',
    tags: [], stats: { label: 'ROI Generated', value: '0' }, link: '#',
  });
  const [tagInput, setTagInput] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'synced' | 'error'>('idle');

  // ---------- Load from backend + localStorage on mount ----------
  useEffect(() => {
    const loadData = async () => {
      setSyncStatus('loading');
      // Try localStorage first for instant UI
      try {
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setItems(parsed);
        }
        const savedStats = localStorage.getItem(LOCAL_STATS_KEY);
        if (savedStats) {
          const parsed = JSON.parse(savedStats);
          if (Array.isArray(parsed) && parsed.length > 0) setStatsList(parsed);
        }
        const savedClients = localStorage.getItem(LOCAL_CLIENTS_KEY);
        if (savedClients) {
          const parsed = JSON.parse(savedClients);
          if (Array.isArray(parsed) && parsed.length > 0) setClientsList(parsed);
        }
      } catch {}

      // Then sync from backend for source of truth
      try {
        const res = await adminService.getPortfolioAdmin();
        if (res && res.success && Array.isArray(res.portfolio) && res.portfolio.length > 0) {
          setItems(res.portfolio);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(res.portfolio));
          setSyncStatus('synced');
        }
      } catch {
        setSyncStatus('error');
      }

      try {
        const extraRes = await adminService.getPortfolioExtraConfig();
        if (extraRes && extraRes.success) {
          if (Array.isArray(extraRes.stats) && extraRes.stats.length > 0) {
            setStatsList(extraRes.stats);
            localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(extraRes.stats));
          }
          if (Array.isArray(extraRes.clients) && extraRes.clients.length > 0) {
            setClientsList(extraRes.clients);
            localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(extraRes.clients));
          }
        }
      } catch {}
    };
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('portfolio_updated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('portfolio_updated', loadData);
    };
  }, []);

  // Persist every state change to localStorage immediately
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }, [items]);

  const saveExtraConfig = async (newStats: PortfolioStatItem[], newClients: PortfolioClientItem[]) => {
    setStatsList(newStats);
    setClientsList(newClients);
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(newStats));
    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(newClients));
    try {
      await adminService.updatePortfolioExtraConfig({ stats: newStats, clients: newClients });
    } catch {}
    notifyCmsUpdate('portfolio_updated');
    setMessage('Saved changes successfully! 🚀');
    setTimeout(() => setMessage(''), 3000);
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.category)))], [items]);

  const filtered = useMemo(() => {
    let arr = items.filter(i => {
      const matchSearch = !search || `${i.title} ${i.client} ${i.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCat === 'All' || i.category === activeCat;
      return matchSearch && matchCat;
    });
    if (sortKey === 'client') arr = [...arr].sort((a, b) => a.client.localeCompare(b.client));
    if (sortKey === 'cat') arr = [...arr].sort((a, b) => a.category.localeCompare(b.category));
    return arr;
  }, [items, search, activeCat, sortKey]);

  const stats = {
    total: items.length,
    byCat: categories.filter(c => c !== 'All').length,
    featured: Math.round(items.length * 0.4),
    liveClients: new Set(items.map(i => i.client)).size,
  };

  const resetForm = () => {
    setForm({
      title: '', client: '', category: 'SEO & Brand Marketing', image: '',
      tags: [], stats: { label: 'ROI Generated', value: '0' }, link: '#',
    });
    setEditingId(null);
    setTagInput('');
  };

  const openAdd = () => { resetForm(); setDrawerOpen(true); };
  const openEdit = (it: PortfolioItem) => {
    setEditingId(it.id);
    setForm({
      ...it,
      tags: [...(it.tags || [])],
      stats: it.stats ? { ...it.stats } : { label: 'ROI Generated', value: '0' },
    });
    setDrawerOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.client) return;
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags || [],
      stats: form.stats || { label: 'ROI Generated', value: '0' },
      image: form.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
      link: form.link || '#',
    };

    try {
      let newItems: PortfolioItem[] = [];
      if (editingId) {
        // Update existing
        const res = await adminService.updatePortfolioItem(editingId, payload);
        if (res && res.success) {
          newItems = items.map(i => i.id === editingId ? { ...i, ...payload } as PortfolioItem : i);
          setMessage(`Updated "${form.title}" successfully`);
        } else {
          throw new Error('API failed');
        }
      } else {
        // Create new
        const res = await adminService.createPortfolioItem(payload);
        if (res && res.success) {
          const newItem: PortfolioItem = {
            id: res.item?.id || `port-${Date.now()}`,
            title: payload.title!,
            client: payload.client!,
            category: payload.category!,
            image: payload.image!,
            tags: payload.tags!,
            stats: payload.stats!,
            link: payload.link,
          };
          newItems = [newItem, ...items];
          setMessage(`New project "${form.title}" published 🚀`);
        } else {
          throw new Error('API failed');
        }
      }
      setItems(newItems);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newItems));
      notifyCmsUpdate('portfolio_updated');
      setSyncStatus('synced');
      resetForm();
      setDrawerOpen(false);
      setTimeout(() => setMessage(''), 3500);
    } catch {
      // Fallback: save locally only
      Swal.fire({
        icon: 'warning',
        title: 'Local Save',
        text: 'Server unreachable — data saved locally on this device.',
        confirmButtonColor: '#1352D0',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
      });
      if (editingId) {
        const localUpdated = items.map(i => i.id === editingId ? { ...i, ...payload } as PortfolioItem : i);
        setItems(localUpdated);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(localUpdated));
        setMessage(`Updated "${form.title}" locally`);
      } else {
        const newItem: PortfolioItem = {
          id: `port-${Date.now()}`,
          title: payload.title!,
          client: payload.client!,
          category: payload.category!,
          image: payload.image!,
          tags: payload.tags!,
          stats: payload.stats!,
          link: payload.link,
        };
        setItems([newItem, ...items]);
        localStorage.setItem(LOCAL_KEY, JSON.stringify([newItem, ...items]));
        setMessage(`"${form.title}" saved locally`);
      }
      setSyncStatus('error');
      resetForm();
      setDrawerOpen(false);
      setTimeout(() => setMessage(''), 3500);
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    const confirmed = await Swal.fire({
      title: 'Delete this portfolio project?',
      text: 'It will be removed from the public site.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D91212',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed.isConfirmed) return;

    try {
      await adminService.deletePortfolioItem(id);
    } catch {}
    const remaining = items.filter(i => i.id !== id);
    setItems(remaining);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(remaining));
    notifyCmsUpdate('portfolio_updated');
    setMessage('Portfolio item deleted');
    setTimeout(() => setMessage(''), 3000);
  };

  const forceSyncBackend = async () => {
    setSyncStatus('loading');
    try {
      await adminService.updatePortfolio(items);
      setSyncStatus('synced');
      Swal.fire({ icon: 'success', title: 'Synced!', text: 'All portfolio items pushed to live server.', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    } catch {
      setSyncStatus('error');
      Swal.fire({ icon: 'error', title: 'Sync failed', text: 'Backend server is offline.', toast: true, position: 'top-end', showConfirmButton: false, timer: 2500 });
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    setForm({ ...form, tags: [...(form.tags || []), t] });
    setTagInput('');
  };
  const removeTag = (t: string) => setForm({ ...form, tags: (form.tags || []).filter(x => x !== t) });

  const statusColor =
    syncStatus === 'synced' ? 'bg-emerald-500' :
    syncStatus === 'loading' ? 'bg-amber-500 animate-pulse' :
    syncStatus === 'error' ? 'bg-red-500' :
    'bg-slate-400';
  const statusLabel =
    syncStatus === 'synced' ? 'Cloud Synced' :
    syncStatus === 'loading' ? 'Syncing…' :
    syncStatus === 'error' ? 'Local Only' :
    'Idle';

  return (
    <div className="space-y-7 animate-in fade-in">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-xl"
        >
          <Check className="w-4 h-4" /><span>{message}</span>
        </motion.div>
      )}

      {/* PAGE HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1352D0] via-[#1E5BC6] to-[#0A3D9E] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Content Manager</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Portfolio Projects</h1>
              <p className="text-sm text-blue-100 font-medium mt-1 max-w-xl">
                Manage your client success stories — featured on the public portfolio page. Add case-ready campaigns with result metrics, tags, categories, and featured media.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={forceSyncBackend}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-extrabold transition-all flex items-center space-x-2"
              title="Push all local data to the live database"
            >
              {syncStatus === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
              <span className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                <span>{statusLabel}</span>
              </span>
            </button>
            <button
              onClick={openAdd}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1352D0] text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-2"
            >
              <Plus className="w-4.5 h-4.5 text-[#1352D0]" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION TABS (Projects, Stat Badges, Happy Customers) */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTabSection('projects')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTabSection === 'projects'
              ? 'bg-[#1352D0] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Project Case Studies ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSection('stats')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTabSection === 'stats'
              ? 'bg-[#1352D0] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Stat Counter Badges ({statsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSection('clients')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTabSection === 'clients'
              ? 'bg-[#1352D0] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Happy Customer Logos ({clientsList.length})</span>
        </button>
      </div>

      {/* TAB 1: PROJECTS LIST */}
      {activeTabSection === 'projects' && (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: 'Total Projects', v: stats.total, i: Briefcase, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
              { l: 'Categories', v: stats.byCat, i: Tag, c: 'text-emerald-600', bg: 'bg-emerald-50' },
              { l: 'Featured / Live', v: stats.featured, i: Sparkles, c: 'text-amber-600', bg: 'bg-amber-50' },
              { l: 'Unique Clients', v: stats.liveClients, i: Users, c: 'text-[#D91212]', bg: 'bg-red-50' },
            ].map((s, i) => {
              const Icon = s.i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2"
                >
                  <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.c}`} />
                  </div>
                  <div className="text-2xl font-black text-slate-900 leading-none">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.l}</div>
                </motion.div>
              );
            })}
          </div>

          {/* FILTER / SEARCH BAR */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search project, client, tags…"
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                      activeCat === c
                        ? 'bg-[#1352D0] text-white border-[#1352D0] shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-600">
                {filtered.length} Results
              </span>
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-600 focus:outline-none focus:border-[#1352D0]"
              >
                <option value="newest">Newest First</option>
                <option value="client">Sort by Client</option>
                <option value="cat">Sort by Category</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="px-6 py-4">
                      <div className="flex items-center space-x-2"><ImageIcon className="w-4 h-4" /><span>Project</span></div>
                    </th>
                    <th className="px-6 py-4"><div className="flex items-center space-x-2"><Layers className="w-4 h-4" /><span>Category</span></div></th>
                    <th className="px-6 py-4"><div className="flex items-center space-x-2"><Tag className="w-4 h-4" /><span>Tech / Campaign Tags</span></div></th>
                    <th className="px-6 py-4"><div className="flex items-center space-x-2"><TrendingUp className="w-4 h-4" /><span>Result Metric</span></div></th>
                    <th className="px-6 py-4"><div className="flex items-center space-x-2"><LinkIcon className="w-4 h-4" /><span>Case Link</span></div></th>
                    <th className="px-6 py-4 text-right"><span>Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <AnimatePresence>
                    {filtered.map((it, idx) => (
                      <motion.tr
                        key={it.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <img src={it.image} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs" />
                            <div className="min-w-0">
                              <div className="font-black text-slate-900 truncate max-w-sm">{it.title}</div>
                              <div className="text-xs text-slate-500 font-bold mt-0.5">for {it.client}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${getBadge(it.category)}`}>
                            {it.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {(it.tags || []).slice(0, 4).map(t => (
                              <span key={t} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">{t}</span>
                            ))}
                            {(it.tags || []).length > 4 && (
                              <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1352D0] border border-blue-100 text-[10px] font-bold">+{(it.tags || []).length - 4}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-black text-[#1352D0] text-base">{it.stats?.value}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{it.stats?.label}</div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg max-w-[140px] inline-block truncate">
                            {it.link || '#'}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <a
                              href={it.link || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all"
                              title="Preview link"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => openEdit(it)}
                              className="p-2.5 rounded-xl bg-blue-50 hover:bg-[#1352D0] text-[#1352D0] hover:text-white border border-blue-100 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(it.id)}
                              className="p-2.5 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="inline-flex flex-col items-center gap-3 text-slate-500">
                          <Briefcase className="w-12 h-12 text-slate-300" />
                          <div className="text-sm font-extrabold text-slate-700">No projects found</div>
                          <div className="text-xs font-bold text-slate-400">Try a different search or add a new project</div>
                          <button onClick={openAdd} className="mt-2 px-4 py-2 rounded-xl bg-[#1352D0] text-white text-xs font-extrabold">
                            <Plus className="w-3.5 h-3.5 inline mr-1" /> Add First Project
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: STAT BADGES BANNER MANAGER */}
      {activeTabSection === 'stats' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Manage Stat Badges Banner</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Edit circular number counters & labels shown on public Portfolio page.</p>
            </div>
            <button
              onClick={() => {
                const newStats = [...statsList, { id: `stat-${Date.now()}`, value: '100+', label: 'New Metric' }];
                saveExtraConfig(newStats, clientsList);
              }}
              className="px-5 py-3 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-black flex items-center space-x-2 shrink-0 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /><span>Add Stat Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statsList.map((st, idx) => (
              <div key={st.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-slate-500">
                  <span>Badge #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const newStats = statsList.filter((_, i) => i !== idx);
                      saveExtraConfig(newStats, clientsList);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Value (e.g. 25+)</label>
                    <input
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...statsList];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        saveExtraConfig(updated, clientsList);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:border-[#1352D0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Label Text</label>
                    <input
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...statsList];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        saveExtraConfig(updated, clientsList);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1352D0]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HAPPY CUSTOMERS BRAND LOGOS MANAGER */}
      {activeTabSection === 'clients' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Manage Happy Customer Brands</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Add or edit client brand logos displayed on the Portfolio page.</p>
            </div>
            <button
              onClick={() => {
                const newClients = [...clientsList, { id: `client-${Date.now()}`, name: 'NEW BRAND', style: 'bg-white text-slate-900 border-slate-200', font: 'tracking-wider font-black text-xs' }];
                saveExtraConfig(statsList, newClients);
              }}
              className="px-5 py-3 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-black flex items-center space-x-2 shrink-0 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /><span>Add Brand Logo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clientsList.map((client, idx) => (
              <div key={client.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-slate-500">
                  <span>Brand #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const newClients = clientsList.filter((_, i) => i !== idx);
                      saveExtraConfig(statsList, newClients);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Brand Name</label>
                  <input
                    value={client.name}
                    onChange={(e) => {
                      const updated = [...clientsList];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      saveExtraConfig(statsList, updated);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-black text-slate-900 focus:outline-none focus:border-[#1352D0]"
                  />
                </div>
                <div className="pt-2 flex items-center justify-center h-16 rounded-xl border border-slate-200 bg-white">
                  <span className={client.font || 'font-extrabold text-xs'}>{client.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[620px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
            >
              <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">{editingId ? 'Edit Mode' : 'New Project'}</div>
                  <h3 className="text-lg font-black text-slate-900">{editingId ? 'Edit Project Details' : 'Publish New Portfolio Case'}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
                {/* Basic Info */}
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5" /><span>Core Info</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Project Title *</label>
                      <input
                        value={form.title || ''}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                        placeholder="e.g. Fintech SaaS Growth Engine"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Client Name *</label>
                        <input
                          value={form.client || ''}
                          onChange={e => setForm({ ...form, client: e.target.value })}
                          required
                          placeholder="e.g. PayPulse Global"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
                        <select
                          value={form.category || 'SEO & Brand Marketing'}
                          onChange={e => setForm({ ...form, category: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none appearance-none"
                        >
                          {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                          <option>Web Development & Performance</option>
                          <option>SEO & Brand Marketing</option>
                          <option>Performance Marketing</option>
                          <option>Local & Enterprise SEO</option>
                          <option>Branding & Social Media</option>
                          <option>AI Marketing</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                        <ImageIcon className="w-3.5 h-3.5" /><span>Cover Image URL</span>
                      </label>
                      <input
                        value={form.image || ''}
                        onChange={e => setForm({ ...form, image: e.target.value })}
                        placeholder="https://images.unsplash.com/… or CDN link"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                      {form.image && (
                        <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 max-h-40">
                          <img src={form.image} alt="preview" className="w-full h-40 object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-1.5">
                    <Hash className="w-3.5 h-3.5" /><span>Tech Stack & Campaign Tags</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      placeholder="Type a tag and press Enter (e.g. Next.js)"
                      className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-black transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
                    {(form.tags || []).length === 0 && (
                      <span className="text-xs text-slate-400 font-bold italic px-2">No tags added yet</span>
                    )}
                    {(form.tags || []).map(t => (
                      <span
                        key={t}
                        className="group inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1352D0] text-xs font-bold"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="text-blue-400 hover:text-[#D91212] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Result Metric */}
                <div className="pt-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /><span>Key Result Metric (shown on card)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-amber-50/50 border border-blue-100">
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Metric Label</label>
                      <input
                        value={form.stats?.label || ''}
                        onChange={e => setForm({ ...form, stats: { ...form.stats!, label: e.target.value } })}
                        placeholder="e.g. Conversion Lift"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Value</label>
                      <input
                        value={form.stats?.value || ''}
                        onChange={e => setForm({ ...form, stats: { ...form.stats!, value: e.target.value } })}
                        placeholder="e.g. +140%"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#D91212] text-sm font-black text-[#1352D0] placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Case Link */}
                <div className="pt-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-1.5">
                    <LinkIcon className="w-3.5 h-3.5" /><span>Case Study / External Link</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <LinkIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <input
                        value={form.link || ''}
                        onChange={e => setForm({ ...form, link: e.target.value })}
                        placeholder="https://case-study.example.com or leave as # for internal"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Where the "Build Similar Growth Engine" button links</p>
                    </div>
                  </div>
                </div>

                <div className="h-6" />
              </form>

              <div className="border-t border-slate-200 p-5 flex items-center justify-between shrink-0 bg-slate-50">
                <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-100 transition-colors">Cancel</button>
                <button
                  onClick={submit}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 disabled:bg-blue-400 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 transition-all"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                    editingId ? <><Save className="w-4 h-4" /><span>Save Changes</span></> : <><Sparkles className="w-4 h-4 text-[#F4B400]" /><span>Publish Project</span></>
                  }
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
