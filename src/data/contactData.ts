export interface ContactFaqItem {
  q: string;
  a: string;
}

export interface ContactConfigData {
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
  customScript?: string;
  metaTitle?: string;
  metaDescription?: string;
  faqs: ContactFaqItem[];
}

export const defaultContactData: ContactConfigData = {
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
