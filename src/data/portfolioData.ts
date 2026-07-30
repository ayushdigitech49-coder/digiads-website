import type { PortfolioItem } from '../types';

export interface PortfolioStatItem {
  id: string;
  value: string;
  label: string;
}

export interface PortfolioClientItem {
  id: string;
  name: string;
  style?: string;
  font?: string;
}

export const defaultPortfolioStats: PortfolioStatItem[] = [
  { id: 'stat-1', value: '25+', label: 'Countries We Serve' },
  { id: 'stat-2', value: '8+', label: 'Work Experience' },
  { id: 'stat-3', value: '500+', label: 'Happy Clients' },
  { id: 'stat-4', value: '780+', label: 'Project Completed' }
];

export const defaultPortfolioClients: PortfolioClientItem[] = [
  { id: 'client-1', name: 'MAJESTIC DECOR', style: 'bg-black text-white border-slate-900', font: 'tracking-[0.18em] font-serif text-xs font-bold' },
  { id: 'client-2', name: 'middle earth hr', style: 'bg-white text-slate-900 border-slate-200', font: 'font-sans font-black text-sm' },
  { id: 'client-3', name: 'PRISM MULTIMEDIA', style: 'bg-black text-white border-slate-900', font: 'tracking-wider text-xs font-black' },
  { id: 'client-4', name: 'PRIVÉE PARIS', style: 'bg-black text-white border-slate-900', font: 'tracking-[0.22em] font-serif text-sm font-bold' },
  { id: 'client-5', name: 'RIGHT CLUB', style: 'bg-white text-slate-900 border-slate-200', font: 'tracking-widest font-black text-xs' },
  { id: 'client-6', name: 'SQUID TRAVEL', style: 'bg-white text-slate-900 border-slate-200', font: 'tracking-wider font-black text-xs' }
];

export const portfolioData: PortfolioItem[] = [
  {
    id: 'portfolio-1',
    title: 'Fintech SaaS Growth Engine',
    category: 'Web Development & Performance',
    client: 'PayPulse Global',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js', 'Framer Motion', 'Tailwind', 'Meta Ads'],
    stats: { label: 'Conversion Lift', value: '+140%' },
    link: '#'
  },
  {
    id: 'portfolio-2',
    title: 'Jaipur E-Commerce Fashion Dominance',
    category: 'SEO & Brand Marketing',
    client: 'Ananya Studio',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    tags: ['Technical SEO', 'Shopify Dev', 'Reels Funnel'],
    stats: { label: 'Organic Traffic', value: '180K/mo' },
    link: '#'
  },
  {
    id: 'portfolio-3',
    title: 'Luxury Real Estate Villa Campaign',
    category: 'Performance Marketing',
    client: 'Skyline Developers',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    tags: ['Google Ads', 'WhatsApp Bot', 'Lead Gen'],
    stats: { label: 'Closed Revenue', value: '₹14.2 Cr' },
    link: '#'
  },
  {
    id: 'portfolio-4',
    title: 'Healthcare & Hospital Chain SEO',
    category: 'Local & Enterprise SEO',
    client: 'Apex Medicare',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    tags: ['Local SEO', 'GMB Ranking', 'Content Matrix'],
    stats: { label: 'Patient Inquiries', value: '+260%' },
    link: '#'
  },
  {
    id: 'portfolio-5',
    title: 'D2C Skincare Brand Rebranding',
    category: 'Branding & Social Media',
    client: 'GlowOrganics India',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    tags: ['Logo Design', 'Brand Identity', 'Influencers'],
    stats: { label: 'ROAS', value: '5.2x' },
    link: '#'
  },
  {
    id: 'portfolio-6',
    title: 'AI Conversational Support Portal',
    category: 'AI Marketing',
    client: 'EduTech India',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    tags: ['AI Agent', 'CRM Automation', 'WhatsApp API'],
    stats: { label: 'Hours Saved', value: '180 hrs/mo' },
    link: '#'
  },
  {
    id: 'portfolio-7',
    title: 'Restaurant Chain Local Domination',
    category: 'Local & Enterprise SEO',
    client: 'SpiceRoute India',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    tags: ['Local SEO', 'GMB', 'Google Maps'],
    stats: { label: 'Foot Traffic', value: '+310%' },
    link: '#'
  },
  {
    id: 'portfolio-8',
    title: 'B2B SaaS Lead Gen Machine',
    category: 'Performance Marketing',
    client: 'CloudStack Pro',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    tags: ['LinkedIn Ads', 'HubSpot', 'Cold Email'],
    stats: { label: 'SQL Pipeline', value: '₹8.5 Cr' },
    link: '#'
  },
  {
    id: 'portfolio-9',
    title: 'Next.js Headless Commerce Platform',
    category: 'Web Development & Performance',
    client: 'UrbanKicks India',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js', 'Shopify Headless', 'Stripe'],
    stats: { label: 'Page Speed', value: '98/100' },
    link: '#'
  },
  {
    id: 'portfolio-10',
    title: 'Instagram Reels Viral Campaign',
    category: 'Branding & Social Media',
    client: 'FitFuel Snacks',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    tags: ['Reels', 'UGC Campaign', 'Influencer'],
    stats: { label: 'Reach', value: '12.4M' },
    link: '#'
  },
  {
    id: 'portfolio-11',
    title: 'Automotive Dealership SEO Blitz',
    category: 'SEO & Brand Marketing',
    client: 'DriveZone Auto',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop&q=80',
    tags: ['Auto SEO', 'Schema Markup', 'Crawl Budget'],
    stats: { label: 'Test Drives', value: '+195%' },
    link: '#'
  },
  {
    id: 'portfolio-12',
    title: 'AI Recruiting Copilot System',
    category: 'AI Marketing',
    client: 'TalentHire.ai',
    image: 'https://images.unsplash.com/photo-1678453015801-57692d331528?w=800&auto=format&fit=crop&q=80',
    tags: ['GPT-4', 'Zapier', 'ATS Integration'],
    stats: { label: 'Hire Speed', value: '-65% time' },
    link: '#'
  }
];
