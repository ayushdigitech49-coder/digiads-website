export interface FooterLinkItem {
  label: string;
  path: string;
}

export interface LegacyBrandCard {
  title: string;
  stat: string;
}

export interface ContactFaqItem {
  q: string;
  a: string;
}

export interface ContactConfigData {
  city: string;
  availableCities: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  phone: string;
  phoneHours: string;
  whatsapp: string;
  whatsappResponseTime: string;
  email: string;
  emailSla: string;
  officeAddressLine1: string;
  officeAddressLine2: string;
  officeHours: string;
  footerTaglines?: string[];
  growthDivisionsHeading?: string;
  growthDivisionsLinks?: FooterLinkItem[];
  platformCompanyHeading?: string;
  platformCompanyLinks?: FooterLinkItem[];
  serviceCitiesHeading?: string;
  legacyBrandHeading?: string;
  legacyBrandCards?: LegacyBrandCard[];
  copyrightText?: string;
  securityText?: string;
  customScript?: string;
  metaTitle?: string;
  metaDescription?: string;
  faqs: ContactFaqItem[];
}

export const defaultContactData: ContactConfigData = {
  city: 'Jaipur, Rajasthan, India',
  availableCities: 'Jaipur, Delhi NCR, Mumbai, Bangalore, Pune, Ahmedabad, Hyderabad',
  heroBadge: 'Connect With Senior Strategists',
  heroTitleLine1: 'Let’s Build Your Next',
  heroTitleHighlight: '10× Revenue Engine',
  heroDescription: 'Have questions about scaling your digital acquisition, SEO rankings, or paid ad ROAS? Talk directly to our core Jaipur HQ growth squad — no sales gatekeepers.',
  phone: '+91 98765 43210',
  phoneHours: 'Mon - Sat • 9:30 AM - 7:30 PM IST',
  whatsapp: '+91 98765 43210',
  whatsappResponseTime: 'Average reply in 12 minutes',
  email: 'growth@sumitdigitech.com',
  emailSla: '24hr SLA response guarantee',
  officeAddressLine1: 'Tonk Road, Malviya Nagar',
  officeAddressLine2: 'Jaipur, Rajasthan, India • 302017',
  officeHours: 'Visits by appointment (Mon-Sat)',
  footerTaglines: [
    'AI-Powered Search & Revenue Growth Engine',
    'High-ROAS Performance Ads & Scalable SEO',
    'Full-Stack Digital Growth Engineering Squad',
  ],
  growthDivisionsHeading: 'Growth Divisions',
  growthDivisionsLinks: [
    { label: 'SEO & Organic Search (SEO Company Jaipur)', path: '/services/seo-services' },
    { label: 'Performance Ads (PerformanceMarketing4U)', path: '/services/performance-marketing' },
    { label: 'Web & App Engineering (Arvian Stack)', path: '/services/web-development' },
    { label: 'Social Media & Reels (Digimagnate)', path: '/services/social-media-marketing' },
    { label: 'Branding & Identity Design', path: '/services/branding-and-design' },
    { label: 'AI Marketing & Voice Agents', path: '/services/ai-marketing-solutions' },
  ],
  platformCompanyHeading: 'Platform & Company',
  platformCompanyLinks: [
    { label: 'About Agency Merger', path: '/about' },
    { label: 'Client Case Studies', path: '/case-studies' },
    { label: 'Work Showcase', path: '/portfolio' },
    { label: 'Growth Plans & Pricing', path: '/pricing' },
    { label: 'SEO & Ads Blog', path: '/blog' },
    { label: 'Free Website Audit Tool', path: '/free-audit' },
  ],
  serviceCitiesHeading: 'Service Cities',
  legacyBrandHeading: 'Legacy Brand Equity',
  legacyBrandCards: [
    { title: 'SEO Company Jaipur', stat: '12k+ Organic Rankings' },
    { title: 'PerformanceMarketing4U', stat: '$5M+ Ad Spend Managed' },
    { title: 'Arvian + Digimagnate', stat: 'Full-Stack Tech & Social' },
  ],
  copyrightText: 'Sumit DigiTech Pvt. Ltd. All rights reserved.',
  securityText: 'Enterprise Grade Security',
  metaTitle: 'Contact Us | Sumit DigiTech Jaipur Digital Growth Agency',
  metaDescription: 'Get in touch with Sumit DigiTech. Call +91 98765 43210 or email growth@sumitdigitech.com for a free 30-minute growth consultation.',
  faqs: [
    {
      q: 'How quickly will you respond to my inquiry?',
      a: 'We reply to 95% of inquiries within 2 business hours during working days (Mon-Sat). Enterprise & WhatsApp VIP messages typically receive a reply within 12 minutes.',
    },
    {
      q: 'Do you work with international clients outside India?',
      a: 'Absolutely. 35% of our client base spans USA, UAE, UK, Singapore, and Australia. We accommodate your timezone for calls and integrate multi-currency billing.',
    },
    {
      q: 'What does a typical first strategy call cover?',
      a: 'A 30-minute deep-dive: audit your current funnel, reveal 2 quick-win opportunities, show 3 comparable case studies, and propose a 90-day growth blueprint with pricing.',
    },
    {
      q: 'Can I visit your Jaipur office in-person?',
      a: 'Yes — we encourage it! Book a slot and our senior team will welcome you with a full-office tour, dedicated strategy room, and chai discussions with your future squad.',
    },
    {
      q: 'Is there a minimum project size or contract lock-in?',
      a: 'Minimum retainer starts at ₹29,999/month. No 12-month lock-in contracts — you stay because we deliver measurable ROI, not fine print.',
    },
  ],
};
