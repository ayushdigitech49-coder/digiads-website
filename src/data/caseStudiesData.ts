import type { CaseStudy } from '../types';

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'real-estate-hypergrowth',
    slug: 'jaipur-luxury-villas-450-leads',
    title: '450+ High-Ticket Luxury Villa Leads in 90 Days',
    client: 'Royal Heritage Real Estate',
    industry: 'Real Estate & Luxury Housing',
    mergedFrom: 'PerformanceMarketing4U',
    badge: 'Performance Marketing & Meta Ads',
    summary: 'How PerformanceMarketing4U (now Sumit DigiTech) scaled qualified high-net-worth lead volume by 320% while dropping CPA by 42% for a flagship luxury villa township in Jaipur.',
    challenge: 'High cost per lead (₹2,400+), unqualified inquiries, and low ad conversion rates on conventional search & display campaigns.',
    solution: 'Engineered multi-stage video funnel with WhatsApp interactive qualification chatbot and server-side Meta Conversions API setup.',
    results: [
      { label: 'Total Qualified Leads', value: '458 Leads', growth: '+320%' },
      { label: 'Cost Per Lead', value: '₹680', growth: '-71%' },
      { label: 'Closed Revenue Generated', value: '₹14.2 Cr', growth: '18x ROAS' }
    ],
    testimonial: {
      quote: 'Sumit DigiTech transformed our sales pipeline. Their lead qualification chatbot stopped budget waste and delivered ready-to-buy villa clients directly to our site office.',
      author: 'Vikramaditya Singh',
      role: 'Director of Marketing',
      company: 'Royal Heritage Group',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    chartData: [
      { name: 'Month 1', value: 45 },
      { name: 'Month 2', value: 140 },
      { name: 'Month 3', value: 280 },
      { name: 'Month 4', value: 458 }
    ]
  },
  {
    id: 'ecommerce-seo-domination',
    slug: 'ecommerce-fashion-organic-10x',
    title: '10x Organic Traffic Surge & #1 Rankings for E-Commerce Fashion Brand',
    client: 'EthnicCrafts Apparel',
    industry: 'E-Commerce & Retail',
    mergedFrom: 'SEO Company Jaipur',
    badge: 'Enterprise & E-Commerce SEO',
    summary: 'Consolidating SEO Company Jaipur’s keyword engine to dominate 450+ transactional search terms, taking monthly organic sessions from 12k to 145k.',
    challenge: 'Low domain authority, duplicate product meta descriptions, slow mobile loading speeds, and page #3 ranking drop for high-intent keywords.',
    solution: 'Complete Next.js migration, programmatic structured JSON-LD schema, entity-based blog content clusters, and DR 70+ editorial outreach.',
    results: [
      { label: 'Monthly Organic Visits', value: '145,000+', growth: '+1,108%' },
      { label: 'Page 1 Keyword Rankings', value: '482 Keywords', growth: '+450%' },
      { label: 'Monthly Organic Revenue', value: '₹68 Lakhs', growth: '+340%' }
    ],
    testimonial: {
      quote: 'The SEO expertise brought by Sumit DigiTech team is phenomenal. We went from invisible on Google to top rankers for Kurti Sets & Designer Lehengas nationwide.',
      author: 'Priya Sharma',
      role: 'Founder & CEO',
      company: 'EthnicCrafts',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    chartData: [
      { name: 'Jan', value: 12000 },
      { name: 'Mar', value: 38000 },
      { name: 'May', value: 89000 },
      { name: 'Jul', value: 145000 }
    ]
  },
  {
    id: 'saas-web-app-redesign',
    slug: 'fintech-saas-conversion-redo',
    title: 'SaaS Platform Redesign Leads to 140% Demo Booking Surge',
    client: 'FlowPay Logistics Tech',
    industry: 'SaaS & Fintech',
    mergedFrom: 'Arvian',
    badge: 'Custom Next.js & UI/UX Redesign',
    summary: 'Arvian (now integrated into Sumit DigiTech) executed a modern Stripe/Linear-style UI redesign and Next.js frontend rebuild.',
    challenge: 'Outdated 2018 WordPress layout with 4.8s load times, confusing pricing table, and 1.2% visitor-to-demo conversion rate.',
    solution: 'Designed modern glassmorphic web portal, sub-second Next.js SSR architecture, interactive ROI pricing calculator, and Framer Motion micro-interactions.',
    results: [
      { label: 'Demo Conversions', value: '4.8%', growth: '+300%' },
      { label: 'Page Load Speed', value: '0.4s', growth: '10x Faster' },
      { label: 'Lighthouse Performance Score', value: '99/100', growth: 'Flawless' }
    ],
    testimonial: {
      quote: 'Our enterprise pitch deck and landing page look like a Silicon Valley billion-dollar startup now. Booked demo calls doubled in the first fortnight.',
      author: 'Rohan Mehta',
      role: 'Head of Growth',
      company: 'FlowPay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    chartData: [
      { name: 'Week 1', value: 1.2 },
      { name: 'Week 2', value: 2.8 },
      { name: 'Week 3', value: 4.1 },
      { name: 'Week 4', value: 4.8 }
    ]
  }
];
