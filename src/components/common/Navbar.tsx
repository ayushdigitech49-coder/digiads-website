import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, ShieldCheck, Phone, TrendingUp, Search } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { Logo, LogoIcon } from './Logo';
import { MegaDropdown } from './MegaDropdown';
import { adminService, type NavbarItem } from '../../services/admin.service';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavbarItem[]>([]);
  const location = useLocation();
  const { openConsultationModal, openAuditModal } = useModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location]);

  // Lock background page scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await adminService.getNavbarConfig();
        if (res.success && res.navbar) {
          setNavItems(res.navbar.filter((item: NavbarItem) => item.visible));
        }
      } catch {
        // Fallback default menu items if offline
        setNavItems([
          { id: 'nav_home', label: 'Home', path: '/', visible: true, requiredPermission: null, order: 1 },
          { id: 'nav_services', label: 'Services', path: '/services', visible: true, requiredPermission: null, order: 2 },
          { id: 'nav_portfolio', label: 'Portfolio', path: '/portfolio', visible: true, requiredPermission: null, order: 3 },
          { id: 'nav_offers', label: 'Offers', path: '/offers', visible: true, requiredPermission: null, order: 4 },
          { id: 'nav_case_studies', label: 'Case Studies', path: '/case-studies', visible: true, requiredPermission: null, order: 5 },
          { id: 'nav_pricing', label: 'Pricing Plans', path: '/pricing', visible: true, requiredPermission: null, order: 6 },
          { id: 'nav_about', label: 'About Us', path: '/about', visible: true, requiredPermission: null, order: 7 },
          { id: 'nav_blog', label: 'Blog', path: '/blog', visible: true, requiredPermission: null, order: 8 },
          { id: 'nav_contact', label: 'Contact', path: '/contact', visible: true, requiredPermission: null, order: 9 },
        ]);
      }
    };
    fetchNav();
  }, []);

  const [hasAnnouncement, setHasAnnouncement] = useState(true);

  useEffect(() => {
    const checkAnnouncement = async () => {
      const isDismissed = sessionStorage.getItem('sumit_announcement_dismissed') === 'true';
      if (isDismissed) {
        setHasAnnouncement(false);
        return;
      }

      try {
        const res = await adminService.getAnnouncementBar();
        if (res && res.success && res.announcementBar) {
          setHasAnnouncement(Boolean(res.announcementBar.isActive));
          return;
        }
      } catch {}
      const saved = localStorage.getItem('sumit_announcement_bar');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setHasAnnouncement(Boolean(parsed.isActive));
          return;
        } catch {}
      }
      setHasAnnouncement(true);
    };

    checkAnnouncement();

    const handleDismissEvent = () => setHasAnnouncement(false);
    window.addEventListener('sumit_announcement_dismissed_event', handleDismissEvent);

    return () => {
      window.removeEventListener('sumit_announcement_dismissed_event', handleDismissEvent);
    };
  }, []);

  const timeoutRef = React.useRef<any>(null);

  const handleMouseEnterServices = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 250);
  };

  return (
    <header className={`fixed ${hasAnnouncement ? 'top-8 sm:top-10' : 'top-2 sm:top-3'} left-0 right-0 z-40 px-3 sm:px-4 font-sans transition-all duration-300`}>
      {/* 100% PURE WHITE NAVBAR CONTAINER ACROSS ALL SCREENS */}
      <div className={`max-w-[92rem] mx-auto rounded-full px-3 sm:px-8 py-1.5 sm:py-2 flex items-center justify-between transition-all duration-300 bg-white/95 backdrop-blur-xl border border-slate-200/90 ${
        scrolled ? 'shadow-xl' : 'shadow-md'
      }`}>
        
        {/* Official Brand Logo - Single robust responsive wrapper */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Sumit DigiTech Home"
          className="hover:opacity-90 transition-opacity shrink-0 flex items-center cursor-pointer"
        >
          <Logo size="md" />
        </Link>

        {/* Dynamic Navigation Links (Desktop) */}
        <nav aria-label="Main Navigation" className="hidden xl:flex items-center space-x-7 text-sm font-extrabold text-slate-800 tracking-tight">
          {navItems.map((item) => {
            if (item.path === '/services') {
              return (
                <div
                  key={item.id}
                  className="relative py-2 -my-2"
                  onMouseEnter={handleMouseEnterServices}
                  onMouseLeave={handleMouseLeaveServices}
                >
                  <Link
                    to="/services"
                    className={`hover:text-[#1352D0] transition-colors flex items-center space-x-1 py-1 ${
                      location.pathname.startsWith('/services') ? 'text-[#1352D0]' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#1352D0]' : ''}`} />
                  </Link>

                  {servicesDropdownOpen && (
                    <MegaDropdown
                      onClose={() => setServicesDropdownOpen(false)}
                      onMouseEnter={handleMouseEnterServices}
                      onMouseLeave={handleMouseLeaveServices}
                    />
                  )}
                </div>
              );
            }

            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`hover:text-[#1352D0] transition-colors py-1 ${isActive ? 'text-[#1352D0]' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons (Desktop) */}
        <div className="hidden lg:flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <Link
            to="/seo-audit"
            className="relative group px-4 py-2 rounded-full bg-gradient-to-r from-[#1352D0] to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Free SEO Audit</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider animate-pulse">
              FREE
            </span>
          </Link>

          <Link
            to="/admin/login"
            className="p-2 text-slate-500 hover:text-[#1352D0] transition-colors"
            title="Super Admin Portal"
            aria-label="Super Admin Control Portal"
          >
            <ShieldCheck className="w-5 h-5" />
          </Link>

          <button
            onClick={openAuditModal}
            className="w-11 h-11 rounded-full bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-blue-200 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center"
            title="Get Free Instant Growth Audit"
            aria-label="Get Free Instant Growth Audit"
          >
            <TrendingUp className="w-5 h-5 text-[#1352D0]" strokeWidth={2.75} />
          </button>

          <button
            onClick={() => openConsultationModal()}
            className="w-11 h-11 rounded-full bg-[#D91212] hover:bg-red-700 text-white active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center"
            title="Book A Call Now"
            aria-label="Book A Call Now"
          >
            <Phone className="w-5 h-5 text-white" strokeWidth={2.75} />
          </button>
        </div>

        {/* MOBILE ACTIONS + TOGGLE BAR */}
        <div className="flex xl:hidden items-center space-x-1.5 min-[380px]:space-x-2 shrink-0">
          {/* Quick Free Audit Growth Surge Icon Button - White circle */}
          <button
            onClick={openAuditModal}
            className="p-1.5 min-[380px]:p-2 rounded-full bg-white border-2 border-blue-100 hover:bg-blue-50 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Get Free Instant Growth Audit"
            aria-label="Get Free Instant Growth Audit"
          >
            <TrendingUp className="w-4 h-4 text-[#1352D0]" strokeWidth={2.5} />
          </button>

          {/* Quick Book A Call Icon Button - Solid Red circle */}
          <button
            onClick={() => openConsultationModal()}
            className="p-1.5 min-[380px]:p-2 rounded-full bg-[#D91212] hover:bg-red-700 text-white active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Book A Call Now"
            aria-label="Book A Call Now"
          >
            <Phone className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 min-[380px]:p-2 text-slate-900 hover:text-[#1352D0] focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 min-[380px]:w-6 min-[380px]:h-6" /> : <Menu className="w-5 h-5 min-[380px]:w-6 min-[380px]:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer - Properly BELOW navbar with gap */}
      {mobileMenuOpen && (
        <>
          {/* Dim backdrop behind drawer */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div
            className={`fixed ${
              hasAnnouncement ? 'top-[4.75rem] sm:top-[5.25rem]' : 'top-[4.25rem] sm:top-[4.75rem]'
            } left-3 right-3 sm:left-4 sm:right-4 z-50 max-w-7xl mx-auto max-h-[calc(100vh-7rem)] overflow-y-auto bg-white text-slate-900 border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-200`}
          >
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-base font-extrabold text-slate-900 hover:text-[#1352D0] border-b border-slate-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 text-base font-black text-[#1352D0] border-b border-slate-100 flex items-center space-x-2"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-[#1352D0]" />
              <span>Super Admin Control Portal</span>
            </Link>
            
            <div className="pt-4 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuditModal();
                }}
                className="w-full py-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1352D0] font-extrabold text-sm rounded-full flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-xs active:scale-[0.98]"
              >
                <TrendingUp className="w-4.5 h-4.5 text-[#1352D0]" />
                <span>Get Free Instant Growth Audit</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openConsultationModal();
                }}
                className="w-full py-3.5 bg-[#D91212] hover:bg-red-700 text-white font-black text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Book A Call Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
