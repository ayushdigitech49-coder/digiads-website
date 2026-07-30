export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  metrics: { label: string; value: string }[];
  deliverables: string[];
  faqs: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaSlug?: string;
  customScript?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  mergedFrom: 'SEO Company Jaipur' | 'PerformanceMarketing4U' | 'Arvian' | 'Digimagnate' | 'Sumit DigiTech';
  badge: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string; growth: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar: string;
  };
  image: string;
  chartData: { name: string; value: number }[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  image: string;
  tags: string[];
  stats: { label: string; value: string };
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  resultsAchieved: string;
  brandAssociated?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  image: string;
  tags: string[];
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaSlug?: string;
  customScript?: string;
  charts?: {
    type: string;
    title: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  }[];
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  highlight: string;
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  serviceRequired: string;
  monthlyBudget?: string;
  message?: string;
  contactMethod?: string;
}
