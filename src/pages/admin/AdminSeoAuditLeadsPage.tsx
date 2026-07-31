import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  Search,
  Trash2,
  ExternalLink,
  PhoneCall,
  Mail,
  Calendar,
  Globe,
  RefreshCw,
  Zap,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { Swal } from '../../utils/swal';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export const AdminSeoAuditLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAuditLeads = async () => {
    setLoading(true);
    try {
      // Fetch from local storage and backend
      const localRaw = JSON.parse(localStorage.getItem('sumit_leads') || '[]');
      const localAuditLeads = localRaw.filter((l: any) => l.serviceRequired && l.serviceRequired.includes('Audit'));

      const res = await adminService.getSeoAuditLeads();
      const backendLeads = (res && res.success && Array.isArray(res.leads)) ? res.leads : [];

      const map = new Map<string, any>();
      [...localAuditLeads, ...backendLeads].forEach(item => map.set(item.id || item.phone, item));
      setLeads(Array.from(map.values()));
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLeads();
    return subscribeCmsUpdate((type) => {
      if (type === 'leads' || type === 'all') {
        fetchAuditLeads();
      }
    });
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Audit Lead?',
      text: 'Are you sure you want to remove this lead entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete'
    });

    if (confirm.isConfirmed) {
      // Remove from local storage
      const localRaw = JSON.parse(localStorage.getItem('sumit_leads') || '[]');
      const updated = localRaw.filter((l: any) => l.id !== id);
      localStorage.setItem('sumit_leads', JSON.stringify(updated));

      await adminService.deleteSeoAuditLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      Swal.toast('Lead deleted successfully', 'success');
    }
  };

  const filtered = leads.filter((l) =>
    (l.name || l.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.websiteUrl || l.domain || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.phone || '').includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#1352D0]">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Real-Time Audit Lead Submissions</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SEO Audit Leads Inbox</h1>
          <p className="text-xs font-bold text-slate-500">Leads captured from the Free SEO Audit Engine (/seo-audit)</p>
        </div>

        <button
          onClick={fetchAuditLeads}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by lead name, email, phone, or website URL..."
          className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* LEADS TABLE CONTAINER */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold text-sm space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1352D0]" />
            <p>Fetching Audit Leads...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold text-sm space-y-2">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <p>No SEO Audit Leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Lead Info</th>
                  <th className="px-6 py-4">Website URL</th>
                  <th className="px-6 py-4">SEO Score</th>
                  <th className="px-6 py-4">Audit Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-extrabold text-slate-900 text-sm">{item.name || item.fullName || 'Anonymous'}</div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.email}</span>
                        </span>
                        <span className="flex items-center space-x-1 font-bold text-[#1352D0]">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{item.phone}</span>
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={item.websiteUrl.startsWith('http') ? item.websiteUrl : `https://${item.websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span className="truncate max-w-xs">{item.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                        (item.seoScore || 75) >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : (item.seoScore || 75) >= 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        🎯 {item.seoScore || 75} / 100
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1352D0] inline-block transition-colors"
                        title="Call Lead"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#D91212] transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
