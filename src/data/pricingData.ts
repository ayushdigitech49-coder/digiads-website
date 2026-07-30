import type { PricingPlan } from '../types';

export interface PricingFaq {
  question: string;
  answer: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'micro-launch',
    name: 'Micro Launch',
    priceMonthly: 14999,
    priceAnnual: 11999,
    description: 'Bootstrap-friendly package for solopreneurs, local shops, and personal brands validating their digital presence.',
    features: [
      'Basic SEO Setup & 8 Target Keywords',
      'Google My Business Optimization & Posts',
      'Meta Ad Management (up to ₹30K ad spend)',
      'Website Performance Audit & Quick Fixes',
      '4 Monthly Custom Social Media Posts',
      'Bi-Weekly Check-ins & Monthly Report'
    ],
    ctaText: 'Start Micro Launch',
    highlight: 'Perfect for Solopreneurs & Local Shops'
  },
  {
    id: 'starter-growth',
    name: 'Starter Growth',
    priceMonthly: 29999,
    priceAnnual: 23999,
    description: 'Ideal for local businesses and early-stage startups seeking consistent leads and top search rankings.',
    features: [
      'Core SEO Setup & 15 Target Keywords',
      'Google My Business Local Domination',
      'Meta (FB/IG) Ad Management (up to ₹1L spend)',
      'Basic Website Performance Audit & Speed Fixes',
      '8 Monthly Custom Social Media Posts',
      '2 Short Video Reels with Basic Editing',
      'Monthly ROI & Growth Report',
      'Dedicated Account Manager'
    ],
    ctaText: 'Start Growing',
    highlight: 'Ideal for Local & Regional Brands'
  },
  {
    id: 'scale-accelerator',
    name: 'Scale Accelerator',
    priceMonthly: 59999,
    priceAnnual: 47999,
    popular: true,
    description: 'Our flagship unified growth package combining SEO, high-ROAS Performance Ads, and custom landing page optimization.',
    features: [
      'Advanced Technical & E-Commerce SEO (50 Keywords)',
      'Multi-Channel Ad Spend Management (Google + Meta)',
      'Custom React/Next.js High-Converting Landing Page',
      'DR 60+ High-Authority Editorial Link Building (5/mo)',
      '15 Reels/Short Video Scripts + Motion Editing',
      'Server-Side Conversion API & CRM Automation',
      'WhatsApp Qualification Bot Setup',
      'Dedicated Senior Account Manager & Slack Channel',
      'Weekly Growth Sprints & Reports'
    ],
    ctaText: 'Scale My Business',
    highlight: 'Most Popular Choice for Scaling Brands'
  },
  {
    id: 'enterprise-orbit',
    name: 'Enterprise Orbit',
    priceMonthly: 119999,
    priceAnnual: 95999,
    description: 'Custom full-stack digital marketing squad, headless web app build, AI chatbot integration, and aggressive market conquest.',
    features: [
      'Unlimited Enterprise SEO & National Rank Conquest',
      'Performance Marketing Squad (Google, Meta, YouTube, LinkedIn)',
      'Full Custom Website/App Rebuild (React/Next.js/Shopify)',
      'Custom AI Voice/WhatsApp Chatbot & CRM Integration',
      'Dedicated Creative Studio (Shoots, Motion FX, 3D Assets)',
      'Bi-Weekly Executive Strategy & CRO Sprints',
      'Unlimited Landing Pages & A/B Experiments',
      'DR 80+ PR & Media Feature Placements',
      '24/7 Priority VIP Growth Support'
    ],
    ctaText: 'Book Enterprise Consultation',
    highlight: 'Full-Stack Dedicated Agency Squad'
  }
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: 'Are there any hidden costs or long-term locked contracts?',
    answer: 'No hidden fees whatsoever! All our growth plans run on flexible monthly SLA agreements. You can upgrade, downgrade, or pause with 30 days notice.'
  },
  {
    question: 'How does the ad spend management work?',
    answer: 'Ad spend is billed directly to your Meta or Google billing profile for 100% transparency. Our monthly fee covers full funnel creative design, copywriting, tracking, and campaign optimization.'
  },
  {
    question: 'Can we customize a package for our unique business requirements?',
    answer: 'Yes! While our packages cover 90% of business growth needs, we frequently tailor custom hybrid retainers for enterprise brands and fast-scaling D2C stores.'
  },
  {
    question: 'What is your onboarding timeline after signing up?',
    answer: 'Onboarding starts within 24 hours. We set up your dedicated Slack channel, run the initial 120-point technical audit, and launch your first sprint in Week 1.'
  }
];
