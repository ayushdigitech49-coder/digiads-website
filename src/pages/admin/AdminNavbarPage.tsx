import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, RefreshCw, Plus, Edit2, Trash2, Check, X, Eye, EyeOff,
  ChevronUp, ChevronDown, Home, Briefcase, FileText, BookOpen, Wallet, Phone, Zap, Search,
  Grid, Layers, ArrowRight, Save
} from 'lucide-react';
import { adminService, type NavbarItem } from '../../services/admin.service';
import { notifyCmsUpdate } from '../../utils/broadcastSync';
import { Swal } from '../../utils/swal.tsx';

const routeIcons: Record<string, any> = {
  '/': Home,
  '/about': Briefcase,
  '/services': Zap,
  '/portfolio': Briefcase,
  '/case-studies': FileText,
  '/pricing': Wallet,
  '/blog': BookOpen,
  '/contact': Phone,
};

export const AdminNavbarPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'navbar' | 'mega_menu'>('navbar');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'mega_menu') {
      setActiveTab('mega_menu');
    } else if (params.get('tab') === 'navbar') {
      setActiveTab('navbar');
    }
  }, [location.search]);
  
  // Navbar State
  const [items, setItems] = useState<NavbarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NavbarItem>>({ label: '', path: '/', visible: true, order: 1 });

  // Mega Menu State
  const [megaColumns, setMegaColumns] = useState<any[]>([]);
  const [activeColId, setActiveColId] = useState<string>('col_digital_marketing');
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
  const [editingMegaItem, setEditingMegaItem] = useState<any | null>(null);
  const [megaForm, setMegaForm] = useState<{ title: string; path: string; iconType: string; textBadge: string; iconBg: string; imageUrl?: string }>({
    title: '',
    path: '/services/seo-services',
    iconType: 'Search',
    textBadge: '',
    iconBg: 'bg-blue-500/10 text-[#1352D0]',
    imageUrl: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const resNav = await adminService.getNavbarConfig();
      if (resNav && resNav.success) setItems(resNav.navbar);

      const resMega = await adminService.getMegaMenuConfig();
      if (resMega && resMega.success && Array.isArray(resMega.megaMenuConfig)) {
        setMegaColumns(resMega.megaMenuConfig);
      }
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const saveNavbarOrder = async (newItems: NavbarItem[]) => {
    setItems(newItems);
    try {
      const res = await adminService.updateNavbarConfig(newItems);
      if (res.success) {
        notifyCmsUpdate('navbar');
        setMessage('Navbar saved & live'); setTimeout(() => setMessage(''), 2500);
      }
    } catch {}
  };

  const saveMegaMenu = async (newCols: any[]) => {
    setMegaColumns(newCols);
    try {
      const res = await adminService.updateMegaMenuConfig(newCols);
      if (res && res.success) {
        notifyCmsUpdate('mega_menu');
        setMessage('Mega Menu updated live'); setTimeout(() => setMessage(''), 2500);
      }
    } catch {}
  };

  // Navbar Handlers
  const toggle = async (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, visible: !i.visible } : i);
    saveNavbarOrder(updated);
  };

  const move = (id: string, dir: -1 | 1) => {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(i => i.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= sorted.length) return;
    [sorted[idx], sorted[target]] = [sorted[target], sorted[idx]];
    const reordered = sorted.map((it, i) => ({ ...it, order: i + 1 }));
    saveNavbarOrder(reordered);
  };

  const remove = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Remove Menu Link?',
      text: 'Are you sure you want to remove this link from top navbar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove Link',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
    });

    if (!confirm.isConfirmed) return;
    saveNavbarOrder(items.filter(i => i.id !== id).map((it, i) => ({ ...it, order: i + 1 })));
    Swal.toast('Navbar menu link removed', 'warning');
  };

  const openEdit = (it: NavbarItem) => { setEditingId(it.id); setForm({ ...it }); setDrawerOpen(true); };
  const openAdd = () => {
    const max = items.reduce((a, b) => Math.max(a, b.order), 0);
    setEditingId(null);
    setForm({ label: '', path: '/', visible: true, order: max + 1 });
    setDrawerOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.path) return;
    if (editingId) {
      saveNavbarOrder(items.map(i => i.id === editingId ? ({ ...i, ...form }) as NavbarItem : i));
      Swal.toast('Navbar link updated!', 'success');
    } else {
      const n: NavbarItem = { id: `nav-${Date.now()}`, label: form.label!, path: form.path!, visible: !!form.visible, order: form.order || items.length + 1, requiredPermission: null };
      saveNavbarOrder([...items, n]);
      Swal.toast('New link added to navbar!', 'success');
    }
    setDrawerOpen(false);
  };

  // Mega Menu Handlers
  const handleOpenAddMegaItem = (colId: string) => {
    setActiveColId(colId);
    setEditingMegaItem(null);
    setMegaForm({ title: '', path: '/services', iconType: 'Search', textBadge: '', iconBg: 'bg-blue-500/10 text-[#1352D0]', imageUrl: '' });
    setItemDrawerOpen(true);
  };

  const handleOpenEditMegaItem = (colId: string, item: any) => {
    setActiveColId(colId);
    setEditingMegaItem(item);
    setMegaForm({
      title: item.title,
      path: item.path,
      iconType: item.iconType || 'Search',
      textBadge: item.textBadge || '',
      iconBg: item.iconBg || 'bg-blue-500/10 text-[#1352D0]',
      imageUrl: item.imageUrl || ''
    });
    setItemDrawerOpen(true);
  };

  const handleDeleteMegaItem = async (colId: string, itemId: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Mega Menu Item?',
      text: 'Are you sure you want to remove this item from the Mega Menu dropdown?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Item',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
    });

    if (!confirm.isConfirmed) return;
    const updated = megaColumns.map(col => {
      if (col.id === colId) {
        return { ...col, items: col.items.filter((it: any) => it.id !== itemId) };
      }
      return col;
    });
    saveMegaMenu(updated);
    Swal.toast('Mega Menu item deleted', 'warning');
  };

  const handleSaveMegaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!megaForm.title || !megaForm.path) return;

    const updated = megaColumns.map(col => {
      if (col.id === activeColId) {
        let itemsList = col.items || [];
        if (editingMegaItem) {
          itemsList = itemsList.map((it: any) => it.id === editingMegaItem.id ? { ...it, ...megaForm } : it);
        } else {
          itemsList = [...itemsList, { id: `m_${Date.now()}`, ...megaForm }];
        }
        return { ...col, items: itemsList };
      }
      return col;
    });

    saveMegaMenu(updated);
    setItemDrawerOpen(false);
    Swal.toast(editingMegaItem ? 'Mega Menu item updated!' : 'New Mega Menu item added!', 'success');
  };

  const filtered = items.filter(i => !search || `${i.label} ${i.path}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-7 animate-in fade-in">
      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-xl">
          <Check className="w-4 h-4" /><span>{message}</span>
        </motion.div>
      )}

      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-[#1352D0] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0"><Compass className="w-7 h-7 text-white" /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">
                {activeTab === 'mega_menu' ? 'Services Mega Dropdown CMS' : 'Dynamic Navbar CMS'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {activeTab === 'mega_menu' ? 'Services Mega Menu Builder' : 'Header Navigation Builder'}
              </h1>
              <p className="text-sm text-indigo-100 font-medium mt-1 max-w-xl">
                {activeTab === 'mega_menu'
                  ? 'Manage the exact 4-column menu layout & sub-service links. All changes reflect live instantly.'
                  : 'Add, remove, re-order, and show/hide top navbar links. All changes reflect live instantly.'}
              </p>
            </div>
          </div>

          {/* TAB SWITCHER PILL */}
          <div className="flex items-center bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
            <button
              onClick={() => setActiveTab('navbar')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'navbar' ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Navbar Links
            </button>
            <button
              onClick={() => setActiveTab('mega_menu')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'mega_menu' ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Mega Dropdown CMS
            </button>
          </div>

        </div>
      </div>

      {/* TAB 1: NAVBAR LINKS */}
      {activeTab === 'navbar' && (
        <div className="space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: 'Menu Items', v: items.length, i: Compass, c: 'text-indigo-600', bg: 'bg-indigo-50' },
              { l: 'Visible in Nav', v: items.filter(i => i.visible).length, i: Eye, c: 'text-emerald-600', bg: 'bg-emerald-50' },
              { l: 'Hidden', v: items.filter(i => !i.visible).length, i: EyeOff, c: 'text-slate-500', bg: 'bg-slate-100' },
              { l: 'Max Recommended', v: '7', i: Zap, c: 'text-amber-600', bg: 'bg-amber-50' },
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

          {/* SEARCH BAR & ADD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu items…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
            </div>
            <button onClick={openAdd} className="px-5 py-2.5 rounded-2xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer">
              <Plus className="w-4 h-4 text-white" /><span>Add New Link</span>
            </button>
          </div>

          {/* TABLE */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="px-6 py-4 w-16">Order</th>
                    <th className="px-6 py-4">Menu Link</th>
                    <th className="px-6 py-4">Target Path</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {(loading ? Array.from({ length: 5 }) : filtered).map((it, idx) => {
                    const item = (it || {}) as NavbarItem;
                    const Icon = routeIcons[item.path || '/'] || Compass;
                    return (
                      <motion.tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-900 flex items-center justify-center">#{item.order || '·'}</span>
                            <div className="flex flex-col space-y-0.5">
                              <button onClick={() => item.id && move(item.id, -1)} disabled={!item.id} className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"><ChevronUp className="w-3 h-3" /></button>
                              <button onClick={() => item.id && move(item.id, 1)} disabled={!item.id} className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"><ChevronDown className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                            <div>
                              <div className="font-black text-slate-900">{item.label || 'Loading…'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-black text-[#1352D0]">{item.path || '—'}</code>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${
                            item.visible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${item.visible ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span>{item.visible ? 'SHOWN' : 'HIDDEN'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button onClick={() => item.id && toggle(item.id)} disabled={!item.id} className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                              item.visible ? 'bg-red-50 text-red-700 hover:bg-[#D91212] hover:text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                            }`}>{item.visible ? 'Hide' : 'Show'}</button>
                            <button onClick={() => item.id && openEdit(item)} disabled={!item.id} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => item.id && remove(item.id)} disabled={!item.id} className="p-2 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-200 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES MEGA DROPDOWN CMS */}
      {activeTab === 'mega_menu' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Grid className="w-5 h-5 text-[#1352D0]" />
              <span className="text-xs font-black text-slate-800">
                Manage exact 4 Columns & sub-service links displayed in Services Mega Menu Dropdown.
              </span>
            </div>
            <button
              onClick={() => saveMegaMenu(megaColumns)}
              className="px-5 py-2 rounded-xl bg-[#1352D0] text-white text-xs font-extrabold shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>

          {/* 4 COLUMNS EDITOR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {megaColumns.map((col) => (
              <div key={col.id} className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const updated = megaColumns.map(c => c.id === col.id ? { ...c, title: e.target.value } : c);
                        setMegaColumns(updated);
                      }}
                      className="text-xs font-black uppercase tracking-wider text-[#D91212] bg-transparent focus:bg-slate-50 px-2 py-1 rounded-lg border border-transparent focus:border-slate-300 focus:outline-none w-full"
                    />
                  </div>

                  {/* ITEMS LIST */}
                  <div className="space-y-2">
                    {(col.items || []).map((item: any) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between group">
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-900 flex items-center justify-center shrink-0">
                            {item.textBadge || item.title.charAt(0)}
                          </span>
                          <span className="text-xs font-extrabold text-slate-800 truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100">
                          <button onClick={() => handleOpenEditMegaItem(col.id, item)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-200">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteMegaItem(col.id, item.id)} className="p-1 rounded-lg text-red-500 hover:bg-red-100">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddMegaItem(col.id)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1352D0] text-xs font-black transition-colors border border-slate-200 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sub-Item</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NAVBAR LINK DRAWER */}
      {drawerOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
          >
            <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">{editingId ? 'Edit Link' : 'New Menu Link'}</div>
                <h3 className="text-lg font-black text-slate-900">{editingId ? 'Edit Menu Item' : 'Add New Menu Link'}</h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Menu Label *</label>
                <input required value={form.label || ''} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Case Studies" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Target Path *</label>
                <input required value={form.path || ''} onChange={e => setForm({ ...form, path: e.target.value })} placeholder="/case-studies" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-mono font-bold text-[#1352D0] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Display Order (position)</label>
                <input type="number" min={1} value={form.order || 1} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
              </div>
            </form>
            <div className="border-t border-slate-200 p-5 flex items-center justify-end space-x-3 shrink-0 bg-slate-50">
              <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold">Cancel</button>
              <button onClick={submit} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2">
                <Check className="w-4 h-4" /><span>{editingId ? 'Save Changes' : 'Add Menu Item'}</span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}

      {/* MEGA MENU ITEM DRAWER */}
      {itemDrawerOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setItemDrawerOpen(false)} />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
          >
            <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">Mega Menu Item</div>
                <h3 className="text-lg font-black text-slate-900">{editingMegaItem ? 'Edit Sub-Item' : 'Add Sub-Item'}</h3>
              </div>
              <button onClick={() => setItemDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveMegaItem} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Item Title *</label>
                <input required value={megaForm.title} onChange={e => setMegaForm({ ...megaForm, title: e.target.value })} placeholder="e.g. Amazon Account Management" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Target Path *</label>
                <input required value={megaForm.path} onChange={e => setMegaForm({ ...megaForm, path: e.target.value })} placeholder="/services/seo-services" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-mono font-bold text-[#1352D0] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Custom Image / Icon URL (Optional)</label>
                <input value={megaForm.imageUrl} onChange={e => setMegaForm({ ...megaForm, imageUrl: e.target.value })} placeholder="https://example.com/logo.png or SVG URL" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-mono font-bold text-slate-900 focus:outline-none" />
                {megaForm.imageUrl && (
                  <div className="mt-2 flex items-center space-x-2 p-2 rounded-xl bg-slate-100 border border-slate-200">
                    <img src={megaForm.imageUrl} alt="Preview" className="w-7 h-7 object-contain rounded-md" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <span className="text-[10px] font-bold text-slate-600">Custom Image Preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Badge Letter / Icon Text</label>
                <input value={megaForm.textBadge} onChange={e => setMegaForm({ ...megaForm, textBadge: e.target.value })} placeholder="e.g. W, S, woo, a, fk, m, b, si, Z, A, tc, N" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Icon Style Preset</label>
                <select value={megaForm.iconType} onChange={e => setMegaForm({ ...megaForm, iconType: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none">
                  <option value="Search">Search (SEO)</option>
                  <option value="Globe">Globe (Google Ads)</option>
                  <option value="TrendingUp">TrendingUp (Performance)</option>
                  <option value="Smartphone">Smartphone (Social)</option>
                  <option value="Palette">Palette (Design)</option>
                  <option value="Code2">Code2 (Web)</option>
                  <option value="Wrench">Wrench (Maintenance)</option>
                  <option value="Monitor">Monitor (Web Design)</option>
                  <option value="Package">Package (Amazon Listing)</option>
                  <option value="ShoppingBag">ShoppingBag (Product Upload)</option>
                  <option value="badge">Custom Text Badge / Custom Image</option>
                </select>
              </div>
            </form>
            <div className="border-t border-slate-200 p-5 flex items-center justify-end space-x-3 shrink-0 bg-slate-50">
              <button type="button" onClick={() => setItemDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold">Cancel</button>
              <button onClick={handleSaveMegaItem} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2">
                <Check className="w-4 h-4" /><span>Save Item</span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}

    </div>
  );
};
