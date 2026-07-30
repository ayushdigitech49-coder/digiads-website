import type { PricingPlan } from '../types';

export interface PricingFaq {
  question: string;
  answer: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter-seo',
    name: 'Starter Package',
    priceMonthly: 5000,
    priceAnnual: 4000,
    description: 'On-Page + Off-Page SEO booster designed for WordPress & HTML websites.',
    features: [
      'On-Page + Off-Page SEO',
      '5–15 Location Keywords',
      '200 High-Quality Backlinks (30+ DA)',
      '10 Do-Follow Guest Posts',
      '4 Blog Posts',
      'For WordPress & HTML Websites'
    ],
    ctaText: 'Choose Starter Package',
    highlight: 'Best for Local Businesses & Small Sites'
  },
  {
    id: 'growth-seo',
    name: 'Growth Package',
    priceMonthly: 8000,
    priceAnnual: 6400,
    popular: true,
    description: 'Complete On-Page + Off-Page + Technical SEO with guaranteed indexing.',
    features: [
      'On-Page + Off-Page + Technical SEO',
      '10–20 Keywords',
      '300 Backlinks (30+ DA) (30-40% Indexing) Guaranteed',
      '20 Guest Posts',
      '20 Competitor Backlinks',
      '4 Blog Posts'
    ],
    ctaText: 'Choose Growth Package',
    highlight: 'Most Popular — Guaranteed Indexing'
  },
  {
    id: 'advanced-seo',
    name: 'Advanced SEO Package',
    priceMonthly: 10000,
    priceAnnual: 8000,
    description: 'Full technical SEO, website speed optimization, content creation & 400 backlinks.',
    features: [
      'On-Page + Off-Page + Technical SEO',
      'Website Maintenance & Page Speed',
      '15–30 Keywords',
      '400 Backlinks (30-40% Indexing) Guaranteed',
      '40 Guest Posts',
      '8 Blog Posts On Website',
      '6 Webpage Content',
      'From 2nd month only ₹10,000/Month'
    ],
    ctaText: 'Choose Advanced Package',
    highlight: 'Enterprise Scaling & Full Web Support'
  },
  {
    id: 'scale-accelerator',
    name: 'Scale Accelerator',
    priceMonthly: 59999,
    priceAnnual: 47999,
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
    highlight: 'Full-Stack Performance Ads & Web Engineering'
  }
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: 'Are there any hidden costs or long-term locked contracts?',
    answer: 'No hidden fees whatsoever! All our growth plans run on flexible monthly SLA agreements. You can upgrade, downgrade, or pause with 30 days notice.'
  },
  {
    question: 'How does guaranteed indexing for backlinks work?',
    answer: 'Our Growth and Advanced packages use premium indexing services ensuring 30-40% guaranteed indexing on Google Search Console within 30 days.'
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
