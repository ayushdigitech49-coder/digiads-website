import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BookOpen,
  Wallet,
  Inbox,
  Layers,
  Compass,
  LogOut,
  Menu,
  RefreshCw,
  Bell,
  Crown,
  Zap,
  Layout,
  Megaphone,
  TrendingUp,
  Award,
  Gift,
  Building2,
  PhoneCall,
  HelpCircle
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Logo, LogoIcon } from '../common/Logo';
import { Swal } from '../../utils/swal.tsx';
import { notifyCmsUpdate } from '../../utils/broadcastSync';

const sidebarSections = [
  {
    id: 'primary',
    heading: 'MANAGEMENT',
    items: [
      { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, badge: null, color: 'text-[#1352D0]' },
      { path: '/admin/why-choose-us', label: 'Why Choose Us CMS', icon: Award, badge: null, color: 'text-amber-600' },
      { path: '/admin/about', label: 'About Us CMS', icon: Building2, badge: null, color: 'text-indigo-600' },
      { path: '/admin/contact', label: 'Contact Us CMS', icon: PhoneCall, badge: null, color: 'text-red-600' },
      { path: '/admin/faq', label: 'Homepage FAQs CMS', icon: HelpCircle, badge: null, color: 'text-sky-600' },
      { path: '/admin/offers-cms', label: 'Special Offers CMS', icon: Gift, badge: null, color: 'text-amber-500' },
      { path: '/admin/industries', label: 'Industry Results CMS', icon: TrendingUp, badge: null, color: 'text-emerald-600' },
      { path: '/admin/services', label: 'Services CMS', icon: Zap, badge: null, color: 'text-blue-600' },
      { path: '/admin/portfolio', label: 'Portfolio Items', icon: Briefcase, badge: null, color: 'text-emerald-600' },
      { path: '/admin/case-studies', label: 'Case Studies', icon: FileText, badge: null, color: 'text-blue-600' },
      { path: '/admin/blog', label: 'Blog Posts', icon: BookOpen, badge: null, color: 'text-violet-600' },
      { path: '/admin/pricing', label: 'Pricing Plans', icon: Wallet, badge: null, color: 'text-amber-600' },
    ],
  },
  {
    id: 'operations',
    heading: 'OPERATIONS & CMS',
    items: [
      { path: '/admin/leads', label: 'Lead Inbox', icon: Inbox, badge: null, color: 'text-[#D91212]' },
      { path: '/admin/contact', label: 'Footer & Contact CMS', icon: PhoneCall, badge: null, color: 'text-red-600' },
      { path: '/admin/media', label: 'Media Press CMS', icon: Award, badge: null, color: 'text-amber-500' },
      { path: '/admin/announcement-bar', label: 'Announcement Bar', icon: Megaphone, badge: null, color: 'text-amber-500' },
      { path: '/admin/hero', label: 'Hero Content CMS', icon: Layout, badge: null, color: 'text-[#1352D0]' },
      { path: '/admin/sections', label: 'Home Sections', icon: Layers, badge: null, color: 'text-blue-600' },
      { path: '/admin/navbar', label: 'Navbar & Mega CMS', icon: Compass, badge: null, color: 'text-indigo-600' },
    ],
  },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  // Auto Reset Scroll Position to Top on Page Navigation
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const handleRefresh = () => {
    setRefreshing(true);
    notifyCmsUpdate('all');
    setContentKey(prev => prev + 1);
    Swal.toast('Page content refreshed!', 'info');
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: 'Logout of Super Admin?',
      text: 'Are you sure you want to end your active Super Admin session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Log Out',
      cancelButtonText: 'Stay Logged In',
      confirmButtonColor: 'bg-[#D91212] hover:bg-red-700',
    });

    if (confirm.isConfirmed) {
      logout();
      Swal.toast('Logged out successfully', 'success');
      navigate('/admin/login');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans flex select-none">
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 shadow-sm transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-slate-200/80 flex items-center justify-between px-3.5 shrink-0 bg-white">
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="shrink-0 scale-90 origin-left">
                <Logo size="sm" />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shrink-0 ml-2 cursor-pointer"
                title="Collapse Sidebar"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <button
                onClick={() => setSidebarOpen(true)}
                className="relative group/toggle p-1 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
              >
                <LogoIcon size="md" className="group-hover/toggle:scale-110 transition-transform" />
                <div className="fixed left-20 top-4 ml-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black whitespace-nowrap shadow-2xl opacity-0 group-hover/toggle:opacity-100 transition-all pointer-events-none z-[9999] border border-slate-800">
                  Expand Sidebar
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-3.5 py-5 space-y-5 bg-white flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {sidebarSections.map((section) => (
              <div key={section.id} className="space-y-1.5">
                {sidebarOpen && (
                  <p className="px-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {section.heading}
                  </p>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path} className="relative group/tooltip flex items-center">
                        <NavLink
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `group w-full relative flex items-center ${sidebarOpen ? 'space-x-3.5 px-3.5' : 'justify-center px-0'} py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-[#1352D0] text-white shadow-md shadow-blue-600/25 font-extrabold'
                                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                              {sidebarOpen && (
                                <>
                                  <span className="font-extrabold flex-1 truncate text-sm">{item.label}</span>
                                  {item.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                                      isActive ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-600 border border-blue-600/20'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </NavLink>

                        {/* TOOLTIP FOR COLLAPSED SIDEBAR */}
                        {!sidebarOpen && (
                          <div className="fixed left-20 ml-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black whitespace-nowrap shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none z-[9999] flex items-center space-x-2 border border-slate-800">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#1352D0] text-white text-[9px] font-black">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar Footer Status */}
          {sidebarOpen && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-700">Single Super Admin</span>
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">v2.5</span>
            </div>
          )}
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-30">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-base font-black text-slate-900 tracking-tight">Super Admin Control Panel</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">LIVE</span>
            </div>
          </div>

          {/* TOP RIGHT HEADER ACTIONS */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              title="Refresh Page Content"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Bell Notifications */}
            <button
              onClick={() => Swal.toast('No unread admin notifications', 'info')}
              className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D91212]" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* PROFILE IMAGE AVATAR */}
            <div
              className="relative py-1"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative flex items-center justify-center p-0.5 rounded-full hover:ring-4 hover:ring-blue-500/20 transition-all cursor-pointer group"
                title={user?.name || 'Super Admin'}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#1352D0] group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 top-full mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-50 text-slate-900"
                  >
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                          className="w-10 h-10 rounded-full border-2 border-[#1352D0] object-cover shrink-0"
                          alt=""
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-900 text-sm truncate">{user?.name || 'Sumit Sharma'}</div>
                          <div className="text-xs text-slate-500 font-bold truncate">{user?.email || 'admin@sumitdigitech.com'}</div>
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#1352D0] border border-blue-200 text-[9px] font-black uppercase">
                            <Crown className="w-3 h-3 mr-1" />
                            {user?.role || 'Super Admin'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-[#D91212] text-[#D91212] hover:text-white border border-red-200 hover:border-[#D91212] text-xs font-black transition-all cursor-pointer shadow-xs"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout from Admin</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT BODY */}
        <main ref={mainRef} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-slate-50/80">
          <div key={contentKey} className="w-full space-y-6 animate-in fade-in duration-300">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="h-9 bg-white border-t border-slate-200/80 px-6 flex items-center justify-between text-[10px] text-slate-500 font-extrabold shrink-0">
          <span>© 2025 Sumit DigiTech Enterprise Admin</span>
          <span className="text-emerald-600 font-black">● Single Super Admin active</span>
        </footer>

      </div>
    </div>
  );
};
