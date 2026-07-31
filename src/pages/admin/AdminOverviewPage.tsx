import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  FileText,
  BookOpen,
  Wallet,
  Phone,
  Mail,
  Calendar,
  Eye,
  MessageCircle,
  Clock,
  Sparkles,
  Zap,
  Target,
  Award,
  ChevronRight,
  Plus,
  Globe
} from 'lucide-react';
import {
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminService, type LeadItem, type SectionToggle } from '../../services/admin.service';
import { portfolioData } from '../../data/portfolioData';
import { blogPosts } from '../../data/blogData';
import { caseStudiesData } from '../../data/caseStudiesData';
import { pricingPlans } from '../../data/pricingData';
import { NavLink } from 'react-router-dom';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate, subscribeCmsUpdate } from '../../utils/broadcastSync';

const leadGrowthData = [
  { name: 'Mon', leads: 12, closed: 3 },
  { name: 'Tue', leads: 19, closed: 5 },
  { name: 'Wed', leads: 15, closed: 4 },
  { name: 'Thu', leads: 22, closed: 6 },
  { name: 'Fri', leads: 28, closed: 8 },
  { name: 'Sat', leads: 14, closed: 4 },
  { name: 'Sun', leads: 9, closed: 2 },
];

const revenueData = [
  { name: 'Jan', revenue: 420000, target: 400000 },
  { name: 'Feb', revenue: 510000, target: 450000 },
  { name: 'Mar', revenue: 480000, target: 500000 },
  { name: 'Apr', revenue: 620000, target: 550000 },
  { name: 'May', revenue: 710000, target: 600000 },
  { name: 'Jun', revenue: 840000, target: 700000 },
  { name: 'Jul', revenue: 920000, target: 750000 },
];

const channelData = [
  { name: 'Organic SEO', value: 38, color: '#1352D0' },
  { name: 'Instagram', value: 24, color: '#F4B400' },
  { name: 'Google Ads', value: 18, color: '#D91212' },
  { name: 'LinkedIn', value: 12, color: '#06B6D4' },
  { name: 'Referral', value: 8, color: '#10B981' },
];

const serviceMix = [
  { name: 'SEO', count: 28 },
  { name: 'Perf Ads', count: 22 },
  { name: 'Web Dev', count: 18 },
  { name: 'Social', count: 16 },
  { name: 'Branding', count: 12 },
  { name: 'AI Tools', count: 9 },
  { name: 'Content', count: 7 },
];

const fmtRupees = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

export const AdminOverviewPage: React.FC = () => {
  const { user } = useAdminAuth();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [sections, setSections] = useState<SectionToggle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
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

      const [leadRes, secRes] = await Promise.all([
        adminService.getLeads().catch(() => ({ success: false, leads: [] })),
        adminService.getSections().catch(() => ({ success: false, sections: [] })),
      ]);

      if (secRes && secRes.success) setSections(secRes.sections);

      let merged: LeadItem[] = [];
      if (leadRes && leadRes.success && Array.isArray(leadRes.leads)) {
        const map = new Map<string, LeadItem>();
        [...localLeads, ...leadRes.leads].forEach(item => map.set(item.id, item));
        merged = Array.from(map.values());
      } else {
        merged = localLeads;
      }

      merged.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setLeads(merged);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return subscribeCmsUpdate((type) => {
      if (type === 'leads' || type === 'all') {
        fetchData();
      }
    });
  }, []);

  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New' || !l.status).length;
  const closedWonCount = leads.filter(l => l.status === 'Closed Won').length;
  const convRate = totalLeadsCount ? Math.round((closedWonCount / totalLeadsCount) * 100) : 0;
  
  const totalPipelineVal = leads.reduce((acc, l) => {
    const rawB = String(l.monthlyBudget || l.budget || '25000').replace(/\D/g, '');
    const num = parseInt(rawB, 10) || 25000;
    return acc + num;
  }, 0);

  const avgDeal = totalLeadsCount ? Math.round(totalPipelineVal / totalLeadsCount) : 0;
  const clientRoiCrores = ((totalPipelineVal * 12) / 10000000).toFixed(1);

  // Dynamic Lead Source Channels Pie Data
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    const src = l.source || 'Contact Form';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const totalSourcesCount = totalLeadsCount || 1;
  const dynamicChannelData = Object.keys(sourceCounts).length > 0 ? Object.entries(sourceCounts).map(([name, count], i) => ({
    name,
    value: Math.round((count / totalSourcesCount) * 100),
    count,
    color: ['#1352D0', '#F4B400', '#D91212', '#06B6D4', '#10B981', '#8B5CF6'][i % 6]
  })) : channelData;

  // Dynamic Service Mix Bar Data
  const serviceCounts: Record<string, number> = {};
  leads.forEach(l => {
    const sName = (l.serviceRequired || 'SEO & Organic Search').split('(')[0].trim();
    serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
  });

  const dynamicServiceMix = Object.keys(serviceCounts).length > 0 ? Object.entries(serviceCounts).map(([name, count]) => ({
    name,
    count
  })) : serviceMix;

  // Dynamic Weekly Lead Funnel (Day of Week)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyMap: Record<string, { leads: number; closed: number }> = {
    Mon: { leads: 0, closed: 0 },
    Tue: { leads: 0, closed: 0 },
    Wed: { leads: 0, closed: 0 },
    Thu: { leads: 0, closed: 0 },
    Fri: { leads: 0, closed: 0 },
    Sat: { leads: 0, closed: 0 },
    Sun: { leads: 0, closed: 0 },
  };

  leads.forEach(l => {
    const d = l.createdAt ? new Date(l.createdAt) : new Date();
    const dayName = dayNames[d.getDay()];
    if (weeklyMap[dayName]) {
      weeklyMap[dayName].leads += 1;
      if (l.status === 'Closed Won') {
        weeklyMap[dayName].closed += 1;
      }
    }
  });

  const dynamicWeeklyFunnel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    name: day,
    leads: weeklyMap[day].leads,
    closed: weeklyMap[day].closed,
  }));

  // Dynamic Revenue Performance vs Target (Last 7 Months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const last7Months = Array.from({ length: 7 }, (_, i) => {
    const idx = (currentMonthIdx - 6 + i + 12) % 12;
    return monthNames[idx];
  });

  const monthlyRevMap: Record<string, number> = {};
  last7Months.forEach(m => monthlyRevMap[m] = 0);

  leads.forEach(l => {
    const d = l.createdAt ? new Date(l.createdAt) : new Date();
    const mName = monthNames[d.getMonth()];
    if (monthlyRevMap[mName] !== undefined) {
      const rawB = String(l.monthlyBudget || l.budget || '25000').replace(/\D/g, '');
      const val = parseInt(rawB, 10) || 25000;
      monthlyRevMap[mName] += val;
    }
  });

  const dynamicRevenueData = last7Months.map(m => ({
    name: m,
    revenue: monthlyRevMap[m],
    target: Math.round(monthlyRevMap[m] * 0.85) || 100000,
  }));

  const weeklyAvgLeads = (totalLeadsCount / 4).toFixed(1);
  const dailyAvgLeads = (totalLeadsCount / 30).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HERO HEADER BENTO - LIGHT SAAS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1352D0] via-[#1E5BC6] to-[#0A3D9E] text-white p-6 sm:p-8 shadow-xl"
      >
        <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-black text-white tracking-wider uppercase">Live Agency Dashboard · {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Welcome back, <span className="text-[#F4B400]">{user?.name?.split(' ')[0] || 'Sumit'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-xl">
              Your agency captured <span className="text-white font-black">{totalLeadsCount} total leads</span> with a <span className="text-emerald-300 font-black">{convRate}% conversion rate</span>.
              You have <span className="text-[#F4B400] font-black">{newLeadsCount} new leads</span> pending review
              and <span className="text-emerald-300 font-black">{sections.filter(s => s.visible).length} homepage sections</span> live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <NavLink
                to="/admin/leads"
                onClick={() => Swal.toast('Navigating to Lead Inbox...', 'info')}
                className="w-full sm:w-auto justify-center px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1352D0] text-xs font-black tracking-wide shadow-lg transition-all flex items-center space-x-2"
              >
                <Inbox className="w-4 h-4 text-[#1352D0]" />
                <span>Process Lead Inbox</span>
                <ChevronRight className="w-4 h-4 text-[#1352D0]" />
              </NavLink>
              <NavLink
                to="/admin/portfolio"
                onClick={() => Swal.toast('Opening Portfolio Manager...', 'info')}
                className="w-full sm:w-auto justify-center px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-extrabold transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Portfolio Item</span>
              </NavLink>
            </div>
          </div>

          {/* Quick Stats Grid - Original Agency Stats */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full lg:w-96 shrink-0">
            {[
              { label: 'Active Clients', value: `${portfolioData.length + closedWonCount}`, icon: Users, color: 'text-[#1352D0]', bg: 'bg-white' },
              { label: 'Projects Live', value: `${portfolioData.length}`, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-white' },
              { label: 'Team On-duty', value: '14', icon: Zap, color: 'text-amber-600', bg: 'bg-white' },
              { label: 'Countries', value: '8', icon: Globe, color: 'text-[#D91212]', bg: 'bg-white' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1.5 sm:space-y-2">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${s.bg} flex items-center justify-center shadow-xs`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white leading-none">{s.value}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-100 truncate">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* COMPACT KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL LEADS CAPTURED', value: totalLeadsCount, delta: 'Live Count', up: true, icon: Inbox, color: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { label: 'WEEKLY LEAD AVERAGE', value: `${weeklyAvgLeads} / wk`, delta: 'Active Pace', up: true, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'DAILY LEAD AVERAGE', value: `${dailyAvgLeads} / day`, delta: 'Live Track', up: true, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'LEAD CONVERSION %', value: `${convRate}%`, delta: 'Live Rate', up: true, icon: Target, color: 'text-[#D91212]', bg: 'bg-red-50' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{k.label}</span>
                  <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center shadow-xs`}>
                    <Icon className={`w-4 h-4 ${k.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{k.value}</div>
                <div className={`flex items-center space-x-1 text-[11px] font-bold ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{k.delta}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Revenue Performance vs Target</h3>
              <p className="text-xs text-slate-500 font-medium">Last 7 months · Closings in Indian Rupees</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-[#1352D0]" />
                <span>Actual Revenue</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-[#F4B400] border-2 border-[#F4B400]" />
                <span>Target Goal</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dynamicRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1352D0" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1352D0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={fmtRupees} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
                formatter={(v: any) => [`₹${(Number(v) / 100000).toFixed(2)}L`, '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#1352D0" strokeWidth={3} fill="url(#revGradLight)" name="Revenue" activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 3 }} />
              <Line type="monotone" dataKey="target" stroke="#F4B400" strokeWidth={2.5} strokeDasharray="6 6" dot={false} name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead Channel Pie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs"
        >
          <div className="mb-5">
            <h3 className="text-lg font-black text-slate-900">Lead Source Channels</h3>
            <p className="text-xs text-slate-500 font-medium">Where your new clients originate</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={dynamicChannelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {dynamicChannelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="#ffffff" strokeWidth={3} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
                formatter={(v: any) => [`${v}%`, 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {dynamicChannelData.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-700">{c.name}</span>
                </div>
                <span className="text-slate-900 font-black">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECOND ROW: Weekly Funnel + Content Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Weekly Lead Funnel · Capture vs Closed</h3>
              <p className="text-xs text-slate-500 font-medium">Daily performance tracking</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black">
              {dynamicWeeklyFunnel.reduce((a, b) => a + b.leads, 0)} Leads Captured
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dynamicWeeklyFunnel} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} fontWeight={800} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" />
              <Bar dataKey="leads" name="Leads Captured" fill="#1352D0" radius={[10, 10, 0, 0]} barSize={30} />
              <Bar dataKey="closed" name="Closed Won" fill="#10B981" radius={[10, 10, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Content Snapshot Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-4">Content Library</h3>
            <div className="space-y-3">
              {[
                { label: 'Portfolio Projects', count: portfolioData.length, icon: Briefcase, color: 'bg-emerald-50 text-emerald-600', to: '/admin/portfolio' },
                { label: 'Case Studies', count: caseStudiesData.length, icon: FileText, color: 'bg-sky-50 text-sky-600', to: '/admin/case-studies' },
                { label: 'Blog Articles', count: blogPosts.length, icon: BookOpen, color: 'bg-violet-50 text-violet-600', to: '/admin/blog' },
                { label: 'Pricing Plans', count: pricingPlans.length, icon: Wallet, color: 'bg-amber-50 text-amber-600', to: '/admin/pricing' },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <NavLink
                    key={i}
                    to={c.to}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center font-bold`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-extrabold text-sm text-slate-800 group-hover:text-[#1352D0]">{c.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-black text-slate-700">{c.count}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1352D0] transition-colors" />
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Service Mix */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Active Mandates</h3>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">by division</span>
            </div>
            <div className="space-y-3">
              {dynamicServiceMix.map((s, i) => {
                const max = Math.max(...dynamicServiceMix.map(x => x.count)) || 1;
                const pct = (s.count / max) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-extrabold text-slate-700">{s.name}</span>
                      <span className="font-black text-slate-900">{s.count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.9 }}
                        className="h-full rounded-full bg-[#1352D0]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RECENT LEADS INBOX */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Recent Lead Inquiries</h3>
            <p className="text-xs text-slate-500 font-medium">Latest submissions from contact forms & modals</p>
          </div>
          <NavLink
            to="/admin/leads"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#1352D0] text-slate-700 hover:text-white border border-slate-200 text-xs font-black transition-all flex items-center space-x-1.5"
          >
            <span>View All Leads</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
        <div className="divide-y divide-slate-100">
          {(loading ? Array.from({ length: 4 }) : leads.slice(0, 5)).map((lead, i) => {
            const l = (lead || {}) as LeadItem;
            const statusColor = {
              'New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'Contacted': 'bg-blue-50 text-blue-700 border-blue-200',
              'Proposal Sent': 'bg-purple-50 text-purple-700 border-purple-200',
              'Closed Won': 'bg-amber-50 text-amber-700 border-amber-200',
            }[l.status || 'New'];
            return (
              <div key={l.id || i} className="p-5 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1352D0] to-blue-600 flex items-center justify-center shrink-0 font-black text-white shadow-xs">
                      {(l.fullName || 'U').split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-slate-900 text-sm truncate">{l.fullName || '—'}</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black tracking-wide ${statusColor}`}>
                          {l.status || 'New'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                          {l.source || 'Website'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center space-x-1"><Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>{l.phone || '—'}</span></span>
                        <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>{l.email || '—'}</span></span>
                        <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—'}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[#1352D0] text-xs font-black">{l.serviceRequired || '—'}</div>
                    <div className="text-emerald-700 text-xs font-bold mt-0.5">{l.monthlyBudget || 'Budget: —'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
