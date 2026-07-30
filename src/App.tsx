import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { StickyWhatsApp } from './components/common/StickyWhatsApp';
import { FloatingCall } from './components/common/FloatingCall';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { Preloader } from './components/common/Preloader';
import { FreeAuditModal } from './components/forms/FreeAuditModal';
import { BookConsultationModal } from './components/forms/BookConsultationModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { GlobalSeoUpdater } from './components/common/GlobalSeoUpdater';

import { HomePage } from './pages/HomePage';

// Resilient dynamic import helper that handles connection errors and stale chunk reload
function lazyWithRetry<T extends React.ComponentType<any>>(
  importFn: () => Promise<any>,
  exportName?: string
) {
  return lazy(async () => {
    try {
      const module = await importFn();
      const component = exportName ? module[exportName] : module.default || module;
      sessionStorage.removeItem('lazy_reload_attempt');
      return { default: component };
    } catch (error) {
      const hasReloaded = sessionStorage.getItem('lazy_reload_attempt');
      if (!hasReloaded) {
        sessionStorage.setItem('lazy_reload_attempt', 'true');
        window.location.reload();
      }
      throw error;
    }
  });
}

// Lazy loaded public pages
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'), 'AboutPage');
const ServicesPage = lazyWithRetry(() => import('./pages/ServicesPage'), 'ServicesPage');
const ServiceDetailPage = lazyWithRetry(() => import('./pages/ServiceDetailPage'), 'ServiceDetailPage');
const PortfolioPage = lazyWithRetry(() => import('./pages/PortfolioPage'), 'PortfolioPage');
const CaseStudiesPage = lazyWithRetry(() => import('./pages/CaseStudiesPage'), 'CaseStudiesPage');
const PricingPage = lazyWithRetry(() => import('./pages/PricingPage'), 'PricingPage');
const BlogPage = lazyWithRetry(() => import('./pages/BlogPage'), 'BlogPage');
const BlogPostPage = lazyWithRetry(() => import('./pages/BlogPostPage'), 'BlogPostPage');
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'), 'ContactPage');
const FreeAuditPage = lazyWithRetry(() => import('./pages/FreeAuditPage'), 'FreeAuditPage');
const OffersPage = lazyWithRetry(() => import('./pages/OffersPage'), 'OffersPage');

// Lazy loaded admin pages
const AdminLoginPage = lazyWithRetry(() => import('./pages/admin/AdminLoginPage'), 'AdminLoginPage');
const AdminOverviewPage = lazyWithRetry(() => import('./pages/admin/AdminOverviewPage'), 'AdminOverviewPage');
const AdminServicesPage = lazyWithRetry(() => import('./pages/admin/AdminServicesPage'), 'AdminServicesPage');
const AdminHeroPage = lazyWithRetry(() => import('./pages/admin/AdminHeroPage'), 'AdminHeroPage');
const AdminPortfolioPage = lazyWithRetry(() => import('./pages/admin/AdminPortfolioPage'), 'AdminPortfolioPage');
const AdminCaseStudiesPage = lazyWithRetry(() => import('./pages/admin/AdminCaseStudiesPage'), 'AdminCaseStudiesPage');
const AdminBlogPage = lazyWithRetry(() => import('./pages/admin/AdminBlogPage'), 'AdminBlogPage');
const AdminPricingPage = lazyWithRetry(() => import('./pages/admin/AdminPricingPage'), 'AdminPricingPage');
const AdminLeadsPage = lazyWithRetry(() => import('./pages/admin/AdminLeadsPage'), 'AdminLeadsPage');
const AdminNavbarPage = lazyWithRetry(() => import('./pages/admin/AdminNavbarPage'), 'AdminNavbarPage');
const AdminAnnouncementBarPage = lazyWithRetry(() => import('./pages/admin/AdminAnnouncementBarPage'), 'AdminAnnouncementBarPage');
const AdminIndustriesPage = lazyWithRetry(() => import('./pages/admin/AdminIndustriesPage'), 'AdminIndustriesPage');
const AdminMediaPage = lazyWithRetry(() => import('./pages/admin/AdminMediaPage'), 'AdminMediaPage');
const AdminOffersPage = lazyWithRetry(() => import('./pages/admin/AdminOffersPage'), 'AdminOffersPage');
const AdminWhyChooseUsPage = lazyWithRetry(() => import('./pages/admin/AdminWhyChooseUsPage'), 'AdminWhyChooseUsPage');
const AdminAboutPage = lazyWithRetry(() => import('./pages/admin/AdminAboutPage'), 'AdminAboutPage');
const AdminContactPage = lazyWithRetry(() => import('./pages/admin/AdminContactPage'), 'AdminContactPage');
const AdminFaqPage = lazyWithRetry(() => import('./pages/admin/AdminFaqPage'), 'AdminFaqPage');
const AdminSectionsPage = lazyWithRetry(() => import('./pages/admin/AdminSectionsPage'), 'AdminSectionsPage');
const AdminPermissionsPage = lazyWithRetry(() => import('./pages/admin/AdminPermissionsPage'), 'AdminPermissionsPage');

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-[#1352D0] border-t-transparent rounded-full animate-spin" />
  </div>
);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#061329] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1352D0] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verifying admin session…</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return <>{children}</>;
};

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedAdminRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedAdminRoute>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white selection:bg-[#1352D0] selection:text-white">
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/free-audit" element={<FreeAuditPage />} />

            {/* Admin Auth (no layout guard) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Dashboard with Sidebar + Top Bar Layout */}
            <Route path="/admin/dashboard" element={<AdminShell><AdminOverviewPage /></AdminShell>} />
            <Route path="/admin/hero" element={<AdminShell><AdminHeroPage /></AdminShell>} />
            <Route path="/admin/services" element={<AdminShell><AdminServicesPage /></AdminShell>} />
            <Route path="/admin/portfolio" element={<AdminShell><AdminPortfolioPage /></AdminShell>} />
            <Route path="/admin/case-studies" element={<AdminShell><AdminCaseStudiesPage /></AdminShell>} />
            <Route path="/admin/blog" element={<AdminShell><AdminBlogPage /></AdminShell>} />
            <Route path="/admin/pricing" element={<AdminShell><AdminPricingPage /></AdminShell>} />
            <Route path="/admin/offers-cms" element={<AdminShell><AdminOffersPage /></AdminShell>} />
            <Route path="/admin/why-choose-us" element={<AdminShell><AdminWhyChooseUsPage /></AdminShell>} />
            <Route path="/admin/leads" element={<AdminShell><AdminLeadsPage /></AdminShell>} />
            <Route path="/admin/media" element={<AdminShell><AdminMediaPage /></AdminShell>} />
            <Route path="/admin/about" element={<AdminShell><AdminAboutPage /></AdminShell>} />
            <Route path="/admin/contact" element={<AdminShell><AdminContactPage /></AdminShell>} />
            <Route path="/admin/footer" element={<AdminShell><AdminContactPage /></AdminShell>} />
            <Route path="/admin/faq" element={<AdminShell><AdminFaqPage /></AdminShell>} />
            <Route path="/admin/industries" element={<AdminShell><AdminIndustriesPage /></AdminShell>} />
            <Route path="/admin/navbar" element={<AdminShell><AdminNavbarPage /></AdminShell>} />
            <Route path="/admin/announcement-bar" element={<AdminShell><AdminAnnouncementBarPage /></AdminShell>} />
            <Route path="/admin/sections" element={<AdminShell><AdminSectionsPage /></AdminShell>} />
            <Route path="/admin/permissions" element={<AdminShell><AdminPermissionsPage /></AdminShell>} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyWhatsApp />}
      {!isAdminRoute && <FloatingCall />}
      <FreeAuditModal />
      <BookConsultationModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ModalProvider>
        <AdminAuthProvider>
          <Preloader />
          <Router>
            <ScrollToTop />
            <GlobalSeoUpdater />
            <ScrollProgressBar />
            <AppContent />
          </Router>
        </AdminAuthProvider>
      </ModalProvider>
    </ErrorBoundary>
  );
};

export default App;
