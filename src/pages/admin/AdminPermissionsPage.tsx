import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Lock, Check, Plus, Users, RefreshCw,
  Crown, X, Search, Key, ChevronDown, Sparkles, Award, Trash2, Edit2
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminService, type RoleItem, type PermissionItem } from '../../services/admin.service';
import { Swal } from '../../utils/swal';

export const AdminPermissionsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoleTab, setActiveRoleTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'Content Editor' });

  const [squad, setSquad] = useState([
    { id: 'u1', name: 'Sumit Sharma', email: 'sumit@sumitdigitech.com', role: 'Super Admin', status: 'Active', last: '2 min ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
    { id: 'u2', name: 'Priya Sharma', email: 'priya@sumitdigitech.com', role: 'Growth Lead', status: 'Active', last: 'Just now', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop' },
    { id: 'u3', name: 'Ananya Gupta', email: 'ananya@sumitdigitech.com', role: 'Content Editor', status: 'Active', last: '1 hr ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop' },
    { id: 'u4', name: 'Rahul Mehta', email: 'rahul@sumitdigitech.com', role: 'Content Editor', status: 'Invited', last: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (token) {
        const res = await adminService.getPermissions(token);
        if (res.success) { setRoles(res.roles); setPermissions(res.permissions); return; }
      }
    } catch {}
    setRoles([
      { id: 'r1', name: 'Super Admin', description: 'Unrestricted access to every module, CMS, billing, RBAC and squad', permissions: ['*'] },
      { id: 'r2', name: 'Growth Lead', description: 'Manage leads, update case studies, portfolio, blog publishing', permissions: ['leads:manage', 'portfolio:edit', 'case_studies:edit', 'blog:edit', 'sections:view'] },
      { id: 'r3', name: 'Content Editor', description: 'Publish blog posts, edit portfolio, case study content only', permissions: ['blog:edit', 'portfolio:view', 'case_studies:view', 'blog:view', 'portfolio:edit'] },
    ]);
    setPermissions([
      { key: 'leads:view', label: 'View Leads Inbox', category: 'CRM & Lead Mgmt' },
      { key: 'leads:manage', label: 'Update Lead Status, Delete', category: 'CRM & Lead Mgmt' },
      { key: 'portfolio:view', label: 'View Portfolio', category: 'Content CMS' },
      { key: 'portfolio:edit', label: 'Add / Edit Portfolio Items', category: 'Content CMS' },
      { key: 'case_studies:view', label: 'View Case Studies', category: 'Content CMS' },
      { key: 'case_studies:edit', label: 'Publish Case Studies', category: 'Content CMS' },
      { key: 'blog:view', label: 'View Blog Posts', category: 'Content CMS' },
      { key: 'blog:edit', label: 'Publish / Edit Blog', category: 'Content CMS' },
      { key: 'pricing:view', label: 'View Pricing Tiers', category: 'Revenue & Billing' },
      { key: 'pricing:edit', label: 'Edit Pricing & Plans', category: 'Revenue & Billing' },
      { key: 'sections:view', label: 'View Section Toggles', category: 'Site Builder' },
      { key: 'sections:edit', label: 'Toggle Sections Live', category: 'Site Builder' },
      { key: 'navbar:edit', label: 'Modify Navbar Menu', category: 'Site Builder' },
      { key: 'rbac:manage', label: 'Manage Roles & Permissions', category: 'Admin & RBAC' },
    ]);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [token]);

  const togglePerm = async (roleId: string, permKey: string) => {
    const target = roles.find(r => r.id === roleId);
    if (!target || target.name === 'Super Admin') return;
    const has = target.permissions.includes(permKey);
    const updated = has ? target.permissions.filter(p => p !== permKey) : [...target.permissions, permKey];
    setRoles(roles.map(r => r.id === roleId ? { ...r, permissions: updated } : r));
    try {
      if (token) { await adminService.updateRolePermissions(token, roleId, updated); }
    } catch {}
    Swal.toast(`${target.name}: ${has ? 'Revoked' : 'Granted'} "${permissions.find(p => p.key === permKey)?.label || permKey}"`, has ? 'warning' : 'success');
  };

  const saveSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;
    setSquad([...squad, {
      id: `u-${Date.now()}`, name: userForm.name, email: userForm.email, role: userForm.role, status: 'Invited', last: 'Just invited',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
    }]);
    setDrawerOpen(false);
    setUserForm({ name: '', email: '', password: '', role: 'Content Editor' });
    Swal.toast(`Invite sent to ${userForm.name}!`, 'success');
  };

  const categories = Array.from(new Set(permissions.map(p => p.category)));
  const filteredPerms = permissions.filter(p => !search || `${p.label} ${p.category}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-7 animate-in fade-in">
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0"><ShieldCheck className="w-7 h-7 text-white" /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1">Admin · RBAC Suite</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Roles, Permissions & Squad</h1>
              <p className="text-sm text-emerald-100 font-medium mt-1 max-w-xl">
                Manage admin roles and grant granular permissions across every CMS and operations module. Role changes sync instantly across the control panel.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={() => setDrawerOpen(true)} className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-emerald-700 text-xs font-black tracking-wide shadow-xl transition-all flex items-center space-x-1.5 cursor-pointer">
              <Plus className="w-4 h-4 text-emerald-700" /><span>Invite Team Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { l: 'Squad Members', v: squad.length, i: Users, c: 'text-[#1352D0]', bg: 'bg-blue-50' },
          { l: 'Active Roles', v: roles.length, i: Award, c: 'text-emerald-600', bg: 'bg-emerald-50' },
          { l: 'Permission Lines', v: permissions.length, i: Key, c: 'text-amber-600', bg: 'bg-amber-50' },
          { l: 'Categories', v: categories.length, i: ShieldCheck, c: 'text-purple-600', bg: 'bg-purple-50' },
          { l: 'Super Admins', v: squad.filter(s => s.role === 'Super Admin').length, i: Crown, c: 'text-[#D91212]', bg: 'bg-red-50' },
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

      {/* SQUAD MEMBERS */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2"><Users className="w-5 h-5 text-[#1352D0]" /><span>Squad Members</span></h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">People with access to the Super Admin control panel</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#1352D0]">{squad.length} Members</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
          {squad.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={u.avatar} className="w-11 h-11 rounded-2xl object-cover border border-slate-200" alt="" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-black text-slate-900 text-sm truncate">{u.name}</div>
                  <div className="text-xs text-slate-500 font-medium truncate">{u.email}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  u.role === 'Super Admin' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  u.role === 'Growth Lead' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-purple-50 text-purple-700 border-purple-200'
                }`}>{u.role === 'Super Admin' && <Crown className="w-3 h-3 inline mr-1" />}{u.role}</span>
                <div className="text-[10px] font-bold text-slate-500">{u.last}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MATRIX */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /><span>Permission Access Matrix</span></h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Check a box to grant — uncheck to revoke. Super Admin role is always fully enabled.</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search permissions…" className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Permission</th>
                {roles.map(r => (
                  <th key={r.id} className="px-6 py-4 text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {categories.map(cat => (
                <React.Fragment key={cat}>
                  <tr className="bg-slate-50/60">
                    <td colSpan={roles.length + 1} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#1352D0]">{cat}</td>
                  </tr>
                  {filteredPerms.filter(p => p.category === cat).map(p => (
                    <tr key={p.key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-900">{p.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.key}</div>
                      </td>
                      {roles.map(r => {
                        const isSuper = r.name === 'Super Admin';
                        const checked = isSuper || r.permissions.includes('*') || r.permissions.includes(p.key);
                        return (
                          <td key={r.id} className="px-6 py-3.5 text-center">
                            <button
                              disabled={isSuper}
                              onClick={() => togglePerm(r.id, p.key)}
                              className={`w-7 h-7 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer ${
                                checked
                                  ? 'bg-[#1352D0] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              } ${isSuper ? 'opacity-80' : ''}`}
                            >
                              {checked ? (isSuper ? <Crown className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />) : <Lock className="w-3 h-3" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE DRAWER */}
      {drawerOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
          >
            <div className="h-20 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#1352D0] mb-0.5">New Squad Member</div>
                <h3 className="text-lg font-black text-slate-900">Invite Team Member</h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveSquad} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Full Name *</label>
                <input required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="e.g. Aditya Verma" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Work Email *</label>
                <input type="email" required value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="name@sumitdigitech.com" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Assign Role</label>
                <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1352D0] text-sm font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer">
                  {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </form>
            <div className="border-t border-slate-200 p-5 flex items-center justify-end space-x-3 shrink-0 bg-slate-50">
              <button type="button" onClick={() => setDrawerOpen(false)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer">Cancel</button>
              <button onClick={saveSquad} className="px-6 py-2.5 rounded-xl bg-[#1352D0] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 cursor-pointer">
                <Sparkles className="w-4 h-4 text-[#F4B400]" /><span>Send Invite</span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </div>
  );
};
