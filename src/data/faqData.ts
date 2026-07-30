export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

export interface FaqConfigData {
  sectionTag: string;
  sectionTitle: string;
  sectionSubtitle: string;
  items: FaqItem[];
}

export const defaultFaqData: FaqConfigData = {
  sectionTag: 'Got Questions? We Have Answers',
  sectionTitle: 'Frequently Asked Questions',
  sectionSubtitle: 'Everything you need to know about our unified digital growth platform and agency merger.',
  items: [
    {
      id: 'faq-1',
      question: 'How does Sumit DigiTech consolidate 5 specialized agencies under one platform?',
      answer: 'Sumit DigiTech serves as the master brand combining the dedicated expertise of SEO Company Jaipur (Organic Search), PerformanceMarketing4U (Meta/Google Ads), Arvian (Web Software Engineering), Digimagnate (Social Reels & Creative), and Quick-Commerce Onboarding. You get a single point of contact and unified dashboard instead of managing separate vendors.',
      category: 'Ecosystem & Merger',
    },
    {
      id: 'faq-2',
      question: 'What marketplaces do you onboard and manage seller accounts for?',
      answer: 'We provide complete account management, listing optimization, and advertising for Amazon, Flipkart, Meesho, Myntra, Blinkit, Swiggy Instamart, Zepto, Ajio, Tata Cliq, and Nykaa.',
      category: 'Marketplace Growth',
    },
    {
      id: 'faq-3',
      question: 'How quickly can we see results for Performance Marketing and SEO campaigns?',
      answer: 'For Performance Marketing (Meta & Google Ads), initial conversion scaling and ROAS optimization typically take 7–14 days. For SEO & AI Search Dominance, key ranking boosts and organic traffic surges start taking effect within 45–90 days.',
      category: 'Performance & Timeline',
    },
    {
      id: 'faq-4',
      question: 'What web development technologies do you use for custom e-commerce stores?',
      answer: 'Our Web Engineering squad (Arvian) builds high-speed custom React and Next.js web applications, headless Shopify Liquid stores, custom WooCommerce setups, and high-converting landing pages with sub-second page load speeds (98+ Core Web Vitals score).',
      category: 'Web Engineering',
    },
    {
      id: 'faq-5',
      question: 'Do you offer custom pricing packages or fixed monthly retainers?',
      answer: 'Yes! We offer flexible monthly packages starting from Basic Starter Growth to Enterprise Dominance plans with no hidden fees or locked contracts. Custom enterprise plans can also be tailored to your specific SKU catalog size and ad spend.',
      category: 'Pricing & Retainer',
    },
  ],
};
