import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Plus, Edit2, Trash2, Check, X, Eye, EyeOff, Sparkles,
  ChevronUp, ChevronDown, Image as ImageIcon
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';
import { ImageUploadInput } from '../../components/admin/ImageUploadInput';

export interface MediaItemCMS {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  imageUrl?: string;
  visible: boolean;
  order: number;
}

export const defaultMediaListCMS: MediaItemCMS[] = [
  { id: 'med_1', name: 'Google News', badge: 'DIGITAL PRESS', badgeBg: 'bg-blue-100 text-[#1352D0]', imageUrl: 'https://www.sumitdigitech.com/uploads/media/6745f4120848456cd26710f4876fb54b.jpg', visible: true, order: 1 },
  { id: 'med_2', name: 'Dainik Jagran', badge: 'LEADING DAILY', badgeBg: 'bg-amber-100 text-amber-900', imageUrl: 'https://www.sumitdigitech.com/uploads/media/16e60319fa0191ef3f5ff9cd77f24738.jpg', visible: true, order: 2 },
  { id: 'med_3', name: 'Zee News', badge: 'NATIONAL NEWS', badgeBg: 'bg-[#061329] text-[#F4B400]', imageUrl: 'https://www.sumitdigitech.com/uploads/media/e937e78addccae2fce55c8e975ec633f.jpg', visible: true, order: 3 },
  { id: 'med_4', name: 'Dainik Bhaskar', badge: 'PRINT MEDIA', badgeBg: 'bg-[#F4B400]/20 text-slate-900', imageUrl: 'https://www.sumitdigitech.com/uploads/media/ea70f76e124f9af626097daf802ca521.jpg', visible: true, order: 4 },
  { id: 'med_5', name: 'Rajasthan Patrika', badge: 'REGIONAL NEWS', badgeBg: 'bg-blue-100 text-[#1352D0]', imageUrl: 'https://www.sumitdigitech.com/uploads/media/d927c73b6526f9d3b9e7c715d534e7b5.jpg', visible: true, order: 5 },
  { id: 'med_6', name: 'Mid Day', badge: 'BUSINESS PRESS', badgeBg: 'bg-red-100 text-red-700', imageUrl: 'https://www.sumitdigitech.com/uploads/media/0ee3433046b3507844c3548fe4c54f3c.jpg', visible: true, order: 6 },
  { id: 'med_7', name: 'News Nation', badge: 'TV COVERAGE', badgeBg: 'bg-slate-100 text-slate-800', imageUrl: 'https://www.sumitdigitech.com/uploads/media/44ea159d3b7740bef9f297fb9eb252a8.jpg', visible: true, order: 7 },
];

export const AdminMediaPage: React.FC = () => {
  const [items, setItems] = useState<MediaItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItemCMS | null>(null);

  const [form, setForm] = useState<{
    name: string;
    badge: string;
    badgeBg: string;
    imageUrl: string;
  }>({
    name: '',
    badge: 'NATIONAL PRESS',
    badgeBg: 'bg-blue-100 text-[#1352D0]',
    imageUrl: '',
  });

  const fetchMediaData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMediaPartners();
      if (res && res.success && Array.isArray(res.mediaPartners) && res.mediaPartners.length > 0) {
        setItems(res.mediaPartners);
        localStorage.setItem('sumit_media_partners_cms', JSON.stringify(res.mediaPartners));
      } else {
        const saved = localStorage.getItem('sumit_media_partners_cms');
        if (saved) {
          try { setItems(JSON.parse(saved)); } catch { setItems(defaultMediaListCMS); }
        } else {
          setItems(defaultMediaListCMS);
        }
      }
    } catch {
      setItems(defaultMediaListCMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, []);

  const saveMediaToBackend = async (newList: MediaItemCMS[]) => {
    setItems(newList);
    localStorage.setItem('sumit_media_partners_cms', JSON.stringify(newList));
    setIsSaving(true);
    try {
      await adminService.updateMediaPartners(newList);
    } catch (err) {
      console.warn('[AdminMediaPage] Backend update fallback:', err);
    }
    notifyCmsUpdate('media');
    setIsSaving(false);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      badge: 'NATIONAL PRESS',
      badgeBg: 'bg-blue-100 text-[#1352D0]',
      imageUrl: '',
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: MediaItemCMS) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      badge: item.badge,
      badgeBg: item.badgeBg || 'bg-blue-100 text-[#1352D0]',
      imageUrl: item.imageUrl || '',
    });
    setDrawerOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      Swal.toast('Please enter media name', 'warning');
      return;
    }

    let newList = [...items];
    if (editingItem) {
      newList = newList.map(it => it.id === editingItem.id ? { ...it, ...form } : it);
    } else {
      const newId = `med_${Date.now()}`;
      newList.push({
        id: newId,
        ...form,
        visible: true,
        order: newList.length + 1,
      });
    }

    await saveMediaToBackend(newList);
    setDrawerOpen(false);
    Swal.toast(editingItem ? 'Media press partner updated!' : 'New media press partner added!', 'success');
  };

  const handleToggleVisible = async (id: string) => {
    const newList = items.map(it => it.id === id ? { ...it, visible: !it.visible } : it);
    await saveMediaToBackend(newList);
    Swal.toast('Visibility toggled', 'info');
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Media Press Partner?',
      text: 'Are you sure you want to remove this media press logo from the marquee slider?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: 'bg-red-600',
    });

    if (confirm.isConfirmed) {
      const newList = items.filter(it => it.id !== id);
      await saveMediaToBackend(newList);
      Swal.toast('Media partner deleted', 'success');
    }
  };

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newList = [...items];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    newList.forEach((item, idx) => { item.order = idx + 1; });
    await saveMediaToBackend(newList);
  };

  return (
    <div className="space-y-8 animate-in fade-in font-sans text-slate-900 pb-16">
      
      {/* PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061329] via-[#0D3BA1] to-[#1352D0] text-white p-6 sm:p-9 shadow-2xl border border-blue-500/20">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-8 h-8 text-[#F4B400]" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4B400] text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-[#F4B400]" />
                <span>Media & Press Module</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Media Press Partners CMS</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1.5 max-w-2xl leading-relaxed">
                Add, edit, re-order, and manage news & press logos (Zee News, Dainik Bhaskar, Patrika, Mid Day, Google News) displayed in the marquee.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 rounded-2xl bg-[#F4B400] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add Media Press Logo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl bg-white border shadow-sm space-y-4 relative flex flex-col justify-between ${
              item.visible ? 'border-slate-200/90' : 'border-slate-300 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.badgeBg || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {item.badge}
                </span>

                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer" title="Move Up"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === items.length - 1} className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer" title="Move Down"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-xl object-contain border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1352D0] font-black">
                    <Award className="w-5 h-5 text-[#1352D0]" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{item.id}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleVisible(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 border cursor-pointer ${
                  item.visible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{item.visible ? 'Visible' : 'Hidden'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button onClick={() => handleOpenEdit(item)} className="p-2 rounded-xl bg-blue-50 text-[#1352D0] hover:bg-[#1352D0] hover:text-white transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-50 text-[#D91212] hover:bg-[#D91212] hover:text-white transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DRAWER FORM */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
            >
              <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">Media Press CMS</div>
                  <h3 className="text-lg font-black text-slate-900">{editingItem ? 'Edit Press Partner' : 'Add Press Partner'}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Media Press Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Zee News or Dainik Bhaskar" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Category Badge Text</label>
                  <input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. NATIONAL NEWS or DIGITAL PRESS" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none" />
                </div>

                <div>
                  <ImageUploadInput
                    label="Media Partner Logo"
                    value={form.imageUrl}
                    onChange={(newUrl) => setForm({ ...form, imageUrl: newUrl })}
                    placeholder="https://... or click Browse Computer"
                    helpText="Enter image URL or click Browse Computer to upload logo directly"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer">
                    <Check className="w-4 h-4" /><span>{editingItem ? 'Update Partner' : 'Save Partner'}</span>
                  </button>
                </div>
              </form>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
