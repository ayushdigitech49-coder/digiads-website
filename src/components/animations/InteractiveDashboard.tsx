import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Target, Activity, ArrowUpRight, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const trafficData = [
  { month: 'Jan', organic: 12000, paid: 8000, leads: 240 },
  { month: 'Feb', organic: 24000, paid: 15000, leads: 480 },
  { month: 'Mar', organic: 48000, paid: 28000, leads: 820 },
  { month: 'Apr', organic: 82000, paid: 42000, leads: 1350 },
  { month: 'May', organic: 125000, paid: 68000, leads: 2100 },
  { month: 'Jun', organic: 168000, paid: 95000, leads: 3450 },
];

export const InteractiveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'traffic' | 'roas' | 'leads'>('traffic');

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-6 text-white relative overflow-hidden group">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#D91212]" />
          <div className="w-3 h-3 rounded-full bg-[#F4B400]" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
            SumitDigiTech // Live Platform Analytics v1.0
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
            Live Syncing
          </span>
        </div>
      </div>

      {/* Metrics Row Aligned to Logo Palette */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div
          onClick={() => setActiveTab('traffic')}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
            activeTab === 'traffic'
              ? 'bg-[#1352D0]/20 border-[#1352D0] text-white shadow-lg'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Organic Traffic</span>
            <Users className="w-4 h-4 text-[#1352D0]" />
          </div>
          <div className="text-xl font-black font-mono">168.5K</div>
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center mt-0.5">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +340% YoY
          </div>
        </div>

        <div
          onClick={() => setActiveTab('roas')}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
            activeTab === 'roas'
              ? 'bg-[#D91212]/20 border-[#D91212] text-white shadow-lg'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Ad Spend ROAS</span>
            <TrendingUp className="w-4 h-4 text-[#D91212]" />
          </div>
          <div className="text-xl font-black font-mono">4.8x</div>
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center mt-0.5">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +42% Efficiency
          </div>
        </div>

        <div
          onClick={() => setActiveTab('leads')}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
            activeTab === 'leads'
              ? 'bg-[#F4B400]/20 border-[#F4B400] text-white shadow-lg'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Inbound Leads</span>
            <Target className="w-4 h-4 text-[#F4B400]" />
          </div>
          <div className="text-xl font-black font-mono">3,450</div>
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center mt-0.5">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +210% Surge
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Tracked Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black font-mono">₹14.2 Cr</div>
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center mt-0.5">
            <Zap className="w-3 h-3 mr-0.5" /> Client Revenue
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1352D0" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1352D0" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D91212" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#D91212" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4B400" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F4B400" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            />
            {activeTab === 'traffic' && (
              <Area type="monotone" dataKey="organic" stroke="#1352D0" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" name="Organic Search Traffic" />
            )}
            {activeTab === 'roas' && (
              <Area type="monotone" dataKey="paid" stroke="#D91212" strokeWidth={3} fillOpacity={1} fill="url(#colorPaid)" name="Performance Paid Sessions" />
            )}
            {activeTab === 'leads' && (
              <Area type="monotone" dataKey="leads" stroke="#F4B400" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" name="Qualified Lead Volume" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#1352D0]" />
          <span>Integrated Stack: SEO Company Jaipur + PerformanceMarketing4U + Arvian + Digimagnate</span>
        </div>
        <span className="font-mono text-emerald-400 font-semibold">99.8% Uptime</span>
      </div>
    </div>
  );
};
