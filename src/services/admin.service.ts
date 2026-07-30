const API_BASE_URL = 'http://localhost:5000/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  permissions: string[];
}

export interface LeadItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  serviceRequired: string;
  monthlyBudget: string;
  message: string;
  source: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Closed Won';
  createdAt: string;
  contactMethod?: string;
}

export interface AboutBrandItem {
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  accent: string;
}

export interface AboutValueItem {
  iconName: string;
  color: string;
  title: string;
  desc: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  img: string;
  division: string;
}

export interface AboutConfigData {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  section2TitleLine1: string;
  section2TitleHighlight: string;
  section3TitleLine1: string;
  section3TitleHighlight: string;
  mergedBrands: AboutBrandItem[];
  coreValues: AboutValueItem[];
  leadershipTeam: AboutTeamMember[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  customScript: string;
}

export interface SectionToggle {
  id: string;
  name: string;
  sectionKey: string;
  visible: boolean;
  requiredPermission: string | null;
}

export interface NavbarItem {
  id: string;
  label: string;
  path: string;
  visible: boolean;
  requiredPermission: string | null;
  order: number;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface PermissionItem {
  key: string;
  label: string;
  category: string;
}

export interface AnnouncementBarData {
  id: string;
  bannerText: string;
  highlightText: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  priorityOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const adminService = {
  // 1. Super Admin Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  verifyToken: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // 2. RBAC Permissions
  getPermissions: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updateRolePermissions: async (token: string, roleId: string, permissions: string[]) => {
    const res = await fetch(`${API_BASE_URL}/admin/permissions/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleId, permissions }),
    });
    return res.json();
  },

  // 3. Dynamic Section Controls
  getSections: async () => {
    const res = await fetch(`${API_BASE_URL}/content/sections`);
    return res.json();
  },

  toggleSection: async (sectionId: string, visible?: boolean) => {
    const res = await fetch(`${API_BASE_URL}/content/sections/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, visible }),
    });
    return res.json();
  },

  updateSections: async (sections: any[]) => {
    const res = await fetch(`${API_BASE_URL}/content/sections/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    });
    return res.json();
  },

  // 4. Dynamic Navbar Controls
  getNavbarConfig: async () => {
    const res = await fetch(`${API_BASE_URL}/content/navbar`);
    return res.json();
  },

  updateNavbarConfig: async (navbarConfig: NavbarItem[]) => {
    const res = await fetch(`${API_BASE_URL}/content/navbar/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ navbarConfig }),
    });
    return res.json();
  },

  // 5. Dynamic Pricing Controls
  getPricingPlans: async () => {
    const res = await fetch(`${API_BASE_URL}/content/pricing`);
    return res.json();
  },

  updatePricingPlans: async (pricingPlans: any[]) => {
    const res = await fetch(`${API_BASE_URL}/content/pricing/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pricingPlans }),
    });
    return res.json();
  },

  // 5.5. Dynamic Services Controls
  getServices: async () => {
    const res = await fetch(`${API_BASE_URL}/content/services`);
    return res.json();
  },

  updateServices: async (services: any[]) => {
    const res = await fetch(`${API_BASE_URL}/content/services/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ services }),
    });
    return res.json();
  },

  createService: async (serviceData: any) => {
    const res = await fetch(`${API_BASE_URL}/content/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    return res.json();
  },

  deleteService: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/content/services/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // 5.6 Hero, Marquee & Reels Controls
  getHeroConfig: async () => {
    const res = await fetch(`${API_BASE_URL}/content/hero`);
    return res.json();
  },

  updateHeroConfig: async (heroConfig: any) => {
    const res = await fetch(`${API_BASE_URL}/content/hero/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroConfig }),
    });
    return res.json();
  },

  getMarqueeItems: async () => {
    const res = await fetch(`${API_BASE_URL}/content/marquee`);
    return res.json();
  },

  updateMarqueeItems: async (marqueeItems: any[]) => {
    const res = await fetch(`${API_BASE_URL}/content/marquee/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marqueeItems }),
    });
    return res.json();
  },

  getReels: async () => {
    const res = await fetch(`${API_BASE_URL}/content/reels`);
    return res.json();
  },

  updateReels: async (reelsItems: any[]) => {
    const res = await fetch(`${API_BASE_URL}/content/reels/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reelsItems }),
    });
    return res.json();
  },

  deleteReel: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/content/reels/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // 5.7 Announcement Bar Controls
  getAnnouncementBar: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/announcement-bar`);
      return res.json();
    } catch {
      const res = await fetch(`${API_BASE_URL}/content/announcement-bar`);
      return res.json();
    }
  },

  updateAnnouncementBar: async (data: Partial<AnnouncementBarData>) => {
    const id = data.id || 'announcement_01';
    const res = await fetch(`${API_BASE_URL}/announcement-bar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id }),
    });
    return res.json();
  },

  // 5.8 Mega Menu 4-Column CMS Controls
  getMegaMenuConfig: async () => {
    const res = await fetch(`${API_BASE_URL}/mega-menu`);
    return res.json();
  },

  updateMegaMenuConfig: async (megaMenuConfig: any[]) => {
    const res = await fetch(`${API_BASE_URL}/mega-menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ megaMenuConfig }),
    });
    return res.json();
  },

  // 5.9 Industry Results Grid CMS Controls
  getIndustries: async () => {
    const res = await fetch(`${API_BASE_URL}/industries`);
    return res.json();
  },

  updateIndustries: async (industries: any[]) => {
    const res = await fetch(`${API_BASE_URL}/industries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industries }),
    });
    return res.json();
  },

  // 5.10 Media Press Partners CMS Controls
  getMediaPartners: async () => {
    const res = await fetch(`${API_BASE_URL}/media-partners`);
    return res.json();
  },

  updateMediaPartners: async (mediaPartners: any[]) => {
    const res = await fetch(`${API_BASE_URL}/media-partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaPartners }),
    });
    return res.json();
  },

  // 5.11 Special Offers CMS Controls
  getOffers: async () => {
    const res = await fetch(`${API_BASE_URL}/offers`);
    return res.json();
  },

  updateOffers: async (offers: any[]) => {
    const res = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offers }),
    });
    return res.json();
  },

  // 5.12 Why Choose Us CMS Controls
  getWhyChooseUs: async () => {
    const res = await fetch(`${API_BASE_URL}/why-choose-us`);
    return res.json();
  },

  updateWhyChooseUs: async (whyChooseUs: any) => {
    const res = await fetch(`${API_BASE_URL}/why-choose-us`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whyChooseUs }),
    });
    return res.json();
  },

  // 5.13 Portfolio CMS Controls
  getPortfolio: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio`);
      return res.json();
    } catch {
      const res = await fetch(`${API_BASE_URL}/content/portfolio`);
      return res.json();
    }
  },

  getPortfolioAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/content/portfolio`);
    return res.json();
  },

  updatePortfolio: async (portfolio: any[]) => {
    const res = await fetch(`${API_BASE_URL}/content/portfolio/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio }),
    });
    return res.json();
  },

  createPortfolioItem: async (itemData: any) => {
    const res = await fetch(`${API_BASE_URL}/content/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    return res.json();
  },

  updatePortfolioItem: async (id: string, itemData: any) => {
    const res = await fetch(`${API_BASE_URL}/content/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    return res.json();
  },

  deletePortfolioItem: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/content/portfolio/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // 6. Lead Management Inbox
  getLeads: async () => {
    const res = await fetch(`${API_BASE_URL}/leads`);
    return res.json();
  },

  createLead: async (leadData: Partial<LeadItem> & any) => {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    return res.json();
  },

  submitLead: async (leadData: Partial<LeadItem> & any) => {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    return res.json();
  },

  updateLeadStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  deleteLead: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // 7. Admin Squad Management
  getSquadMembers: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  addSquadMember: async (token: string, memberData: { name: string; email: string; password: string; role: string }) => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });
    return res.json();
  },

  // 8. About Page CMS Controls
  getAboutConfig: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/about`);
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  updateAboutConfig: async (aboutConfig: AboutConfigData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/about/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aboutConfig }),
      });
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  // 9. Portfolio Extra CMS Controls (Stat Badges & Happy Clients)
  getPortfolioExtraConfig: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio-extra`);
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  updatePortfolioExtraConfig: async (extraData: { stats: any[]; clients: any[] }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio-extra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extraData),
      });
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  // 10. Contact Page CMS Controls
  getContactConfig: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/contact`);
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  updateContactConfig: async (contactConfig: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/contact/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactConfig }),
      });
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  // 11. Homepage FAQ CMS Controls
  getFaqConfig: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/faq`);
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },

  updateFaqConfig: async (faqConfig: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/faq/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqConfig }),
      });
      if (!res.ok) return { success: false };
      return res.json();
    } catch {
      return { success: false };
    }
  },
};
