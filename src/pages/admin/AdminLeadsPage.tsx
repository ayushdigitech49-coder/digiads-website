import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, Search, Filter, Plus, Check, X, Trash2, ChevronDown, Sparkles,
  Phone, Mail, Calendar, Building2, DollarSign, MessageCircle, Download,
  Clock, Eye, ArrowRight, Users, TrendingUp, Zap, Target, Star
} from 'lucide-react';
import { adminService, type LeadItem } from '../../services/admin.service';
import { NavLink } from 'react-router-dom';
import { Swal } from '../../utils/swal';

const statusMap: Record<string, { bg: string; text: string; dot: string }> = {
  New: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Contacted: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Proposal Sent': { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Closed Won': { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  Lost: { bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
};

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSource, setActiveSource] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [previewLead, setPreviewLead] = useState<LeadItem | null>(null);
  const [bulkSelect, setBulkSelect] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const localRaw = JSON.parse(localStorage.getItem('sumit_leads') || '[]');
      const localLeads: LeadItem[] = localRaw.map((l: any) => ({
        id: l.id || 'local-' + Math.random().toString(36).substring(2, 9),
        fullName: l.name || l.fullName || 'Anonymous',
        email: l.email || '',
        phone: l.phone || '',
        companyName: l.websiteUrl || l.companyName || '',
        serviceRequired: l.serviceRequired || `SEO Cost Calculator (${l.websiteType || 'SEO'})`,
        budget: l.estimatedBudget || l.budget || '₹8,000/mo',
        message: l.message && l.message.includes('City:') ? l.message : `City: ${l.city || 'N/A'} | Target: ${l.targetLocation || 'N/A'} | Keywords: ${l.keywordTier || 'N/A'} | Tech: ${l.techStack || 'N/A'} | Note: ${l.message || 'None'}`,
        source: l.source || 'SEO Calculator',
        status: l.status || 'New',
        createdAt: l.createdAt || new Date().toISOString()
      }));

      const res = await adminService.getLeads();
      if (res.success && Array.isArray(res.leads)) {
        const map = new Map<string, LeadItem>();
        [...localLeads, ...res.leads].forEach(item => map.set(item.id, item));
        setLeads(Array.from(map.values()));
      } else {
        setLeads(localLeads);
      }
    } catch {
      setLeads([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => leads.filter(l => {
    const s = !search || `${l.fullName} ${l.email} ${l.phone} ${l.serviceRequired} ${l.message}`.toLowerCase().includes(search.toLowerCase());
    const src = activeSource === 'All' || (l.source || '').toLowerCase().includes(activeSource.toLowerCase().replace(' ', ''));
    const st = activeStatus === 'All' || l.status === activeStatus;
    return s && src && st;
  }), [leads, search, activeSource, activeStatus]);

  const handleStatus = async (id: string, status: string, name: string) => {
    try {
      const res = await adminService.updateLeadStatus(id, status);
      if (res.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: status as any } : l));
        Swal.toast(`${name} status → ${status}`, 'success');
      }
    } catch {
      Swal.fire({ title: 'Status Update Failed', icon: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirm = await Swal.fire({
      title: `Delete lead for ${name}?`,
      text: 'Are you sure you want to permanently delete this lead inquiry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Lead',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await adminService.deleteLead(id);
      if (res.success) {
        setLeads(leads.filter(l => l.id !== id));
        Swal.toast(`Lead ${name} removed`, 'warning');
      }
    } catch {
      Swal.fire({ title: 'Error', text: 'Could not delete lead', icon: 'error' });
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    won: leads.filter(l => l.status === 'Closed Won').length,
    contacted: leads.filter(l => l.status === 'Contacted' || l.status === 'Proposal Sent').length,
    estValue: leads.reduce((a, b) => a + (parseInt(String((b.monthlyBudget || '0').replace(/[^0-9]/g, '')) || '0', 10) * (b.status === 'Closed Won' ? 1 : b.status === 'Proposal Sent' ? 0.5 : b.status === 'Contacted' ? 0.25 : 0.1)), 0),
  };

  return (
    <div className="space-y-7 animate-in fade-in">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D91212] via-red-600 to-rose-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 relative">
              <Inbox className="w-7 h-7 text-white" />
              {stats.new > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full bg-[#F4B400] text-slate-950 text-[10px] font-black flex items-center justify-center px-1.5 animate-pulse shadow-md">{stats.new}</span>
              )}
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Realtime Lead Capture · Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Lead Inbox & CRM</h1>
              <p className="text-sm text-red-100 font-medium mt-1 max-w-2xl">
                Manage every consultation request, audit inquiry, and website lead in one place — track statuses, move deals through your pipeline, and export data anytime.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={fetchData} className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#D91212] text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-1.5 cursor-pointer">
              <Zap className="w-4 h-4 text-[#D91212]" /><span>Refresh Inbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { l: 'All Leads', v: stats.total, i: Inbox, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { l: 'New · Unread', v: stats.new, i: Clock, c: 'text-emerald-600', bg: 'bg-emerald-50', t: 'LIVE' },
          { l: 'In Pipeline', v: stats.contacted, i: Users, c: 'text-purple-600', bg: 'bg-purple-50' },
          { l: 'Closed Won 🎉', v: stats.won, i: Star, c: 'text-amber-600', bg: 'bg-amber-50', t: '⭐' },
          { l: 'Est. Pipeline (₹)', v: stats.estValue > 0 ? `₹${(stats.estValue / 100000).toFixed(1)}L` : '—', i: DollarSign, c: 'text-[#D91212]', bg: 'bg-red-50' },
        ].map((s, i) => {
          const Icon = s.i;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="relative p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${s.c}`} /></div>
                {s.t && (
                  <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                    s.t === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse' : 'bg-amber-50 text-amber-700'
                  }`}>{s.t}</span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{s.v}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.l}</div>
            </motion.div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, email, service, message…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D91212] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
              {['All', 'New', 'Contacted', 'Proposal Sent', 'Closed Won'].map(st => (
                <button key={st} onClick={() => setActiveStatus(st)} className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap cursor-pointer ${activeStatus === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{st}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4 w-12"><input type="checkbox" className="w-4 h-4 rounded accent-[#D91212]" disabled={filtered.length === 0} onChange={e => setBulkSelect(e.target.checked ? new Set(filtered.map(f => f.id)) : new Set())} /></th>
                <th className="px-6 py-4"><div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>Lead Info</span></div></th>
                <th className="px-6 py-4"><div className="flex items-center space-x-2"><Target className="w-4 h-4" /><span>Service</span></div></th>
                <th className="px-6 py-4"><div className="flex items-center space-x-2"><DollarSign className="w-4 h-4" /><span>Budget</span></div></th>
                <th className="px-6 py-4"><div className="flex items-center space-x-2"><Clock className="w-4 h-4" /><span>Source · Status</span></div></th>
                <th className="px-6 py-4"><div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>Submitted</span></div></th>
                <th className="px-6 py-4 text-right"><span>Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <AnimatePresence>
                {(loading ? Array.from({ length: 4 }) : filtered).map((lead, idx) => {
                  const l = (lead || {}) as LeadItem;
                  const stC = statusMap[l.status || 'New'] || statusMap.New;
                  return (
                    <motion.tr key={l.id || idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        {l.id && (
                          <input type="checkbox" checked={bulkSelect.has(l.id)} onChange={e => {
                            const n = new Set(bulkSelect);
                            if (e.target.checked) n.add(l.id); else n.delete(l.id);
                            setBulkSelect(n);
                          }} className="w-4 h-4 rounded accent-[#D91212]" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1352D0] to-blue-600 flex items-center justify-center shrink-0 font-black text-white text-xs shadow-xs">
                            {loading ? '··' : (l.fullName || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="font-black text-slate-900 truncate">{l.fullName || <span className="text-slate-400">Loading…</span>}</div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                              {l.phone && <a href={`tel:${l.phone}`} className="flex items-center space-x-1 hover:text-[#1352D0] transition-colors"><Phone className="w-3 h-3 text-slate-400" /><span>{l.phone}</span></a>}
                              {l.email && <a href={`mailto:${l.email}`} className="flex items-center space-x-1 hover:text-[#1352D0] transition-colors truncate"><Mail className="w-3 h-3 text-slate-400 shrink-0" /><span className="truncate max-w-[180px]">{l.email}</span></a>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-extrabold">{l.serviceRequired || 'General Strategy'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-emerald-700">{l.monthlyBudget || <span className="text-slate-400 font-medium">Not set</span>}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold block w-max">{l.source || 'Website'}</span>
                            <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black ${
                              l.contactMethod === 'Phone Call' ? 'bg-blue-50 text-[#1352D0] border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {l.contactMethod === 'Phone Call' ? '📞 Call' : '💬 WhatsApp'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${stC.dot}`} />
                            <span className={`text-xs font-black ${stC.text}`}>{l.status || 'New'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-700 whitespace-nowrap">{l.createdAt ? new Date(l.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button onClick={() => l.id && setPreviewLead(l)} disabled={!l.id} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer" title="View details"><Eye className="w-4 h-4" /></button>
                          {l.id && (
                            <select
                              value={l.status}
                              onChange={e => handleStatus(l.id, e.target.value, l.fullName || 'Lead')}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Proposal Sent">Proposal</option>
                              <option value="Closed Won">Closed Won 🎉</option>
                              <option value="Lost">Lost</option>
                            </select>
                          )}
                          <button onClick={() => l.id && handleDelete(l.id, l.fullName || 'Lead')} disabled={!l.id} className="p-2 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD PREVIEW DRAWER */}
      <AnimatePresence>
        {previewLead && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewLead(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
            >
              <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1352D0] flex items-center justify-center font-black text-white text-sm">
                    {previewLead.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 leading-tight">{previewLead.fullName}</div>
                    <div className="text-xs text-slate-500 font-bold">{previewLead.email}</div>
                  </div>
                </div>
                <button onClick={() => setPreviewLead(null)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <a href={`tel:${previewLead.phone}`} className="flex items-center space-x-2 text-emerald-600 font-bold"><Phone className="w-4 h-4" /><span className="text-xs uppercase tracking-wider text-slate-500">Phone ({previewLead.contactMethod || 'WhatsApp'})</span></a>
                    <div className="text-sm font-black text-slate-900">{previewLead.phone}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <a href={`mailto:${previewLead.email}`} className="flex items-center space-x-2 text-[#1352D0] font-bold"><Mail className="w-4 h-4" /><span className="text-xs uppercase tracking-wider text-slate-500">Email</span></a>
                    <div className="text-sm font-black text-slate-900 truncate">{previewLead.email}</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#1352D0]"><MessageCircle className="w-4 h-4" /><span>Growth Message / Goals</span></div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{previewLead.message || 'No message attached.'}</p>
                </div>
              </div>
              <div className="border-t border-slate-200 p-5 flex items-center justify-between shrink-0 bg-slate-50">
                <button onClick={() => setPreviewLead(null)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer">Close</button>
                <a href={`https://wa.me/91${(previewLead.phone || '').replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black tracking-wide shadow-md flex items-center space-x-1.5 cursor-pointer">
                  <Sparkles className="w-4 h-4" /><span>WhatsApp Directly</span><ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
