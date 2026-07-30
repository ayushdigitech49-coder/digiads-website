import React, { useState, useEffect, useRef } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { MediaMarquee } from '../components/sections/MediaMarquee';
import { WhyChooseUsSection } from '../components/sections/WhyChooseUsSection';
import { FlagshipEcosystemSection } from '../components/sections/FlagshipEcosystemSection';
import { IndustriesSection } from '../components/sections/IndustriesSection';
import { GrowthCalculatorSection } from '../components/sections/GrowthCalculatorSection';
import { OffersSection } from '../components/sections/OffersSection';
import { VideoReelsTestimonials } from '../components/animations/VideoReelsTestimonials';
import { AnimatedStats } from '../components/animations/AnimatedStats';
import { AnimatedTestimonials } from '../components/animations/AnimatedTestimonials';
import { FaqSection } from '../components/sections/FaqSection';
import { FinalCtaSection } from '../components/sections/FinalCtaSection';
import { SeoAuditModal } from '../components/common/SeoAuditModal';
import { adminService, type SectionToggle } from '../services/admin.service';
import { subscribeCmsUpdate } from '../utils/broadcastSync';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const caseStudiesData = [
  {
    id: 'cs-1',
    title: 'Scaled D2C Apparel Brand to ₹1.8Cr/Mo with Meta CAPI & Reels Ads',
    client: 'UrbanVibe India',
    industry: 'E-Commerce',
    results: [
      { label: 'Monthly Revenue', value: '₹1.8 Crore' },
      { label: 'ROAS Multiplier', value: '4.8× Return' },
    ],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    summary: 'Deployed server-side conversion tracking (CAPI), high-velocity short Reels creatives, and catalog ads to scale revenue by 320% in 90 days.',
    badge: '4.8× ROAS'
  },
  {
    id: 'cs-2',
    title: 'Ranked Healthcare Clinic #1 on Google GMB for 180+ Local Searches',
    client: 'Apex Multispecialty Hospital',
    industry: 'Healthcare',
    results: [
      { label: 'Patient Leads', value: '+320% Monthly' },
      { label: 'Map Views', value: '140K/Month' },
    ],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    summary: 'Localized SEO optimization, patient review automation, and targeted search ads drove 420+ monthly qualified consultations.',
    badge: '+320% LEADS'
  },
  {
    id: 'cs-3',
    title: 'Closed ₹14.2Cr Property Sales via 3D Virtual Tour Meta Funnels',
    client: 'Greenwood Luxury Estates',
    industry: 'Real Estate',
    results: [
      { label: 'Property Sales', value: '₹14.2 Crore' },
      { label: 'Lead Cost (CPL)', value: '₹280 / Lead' },
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    summary: 'Built high-ticket lead qualification funnels with WhatsApp auto-booking to acquire NRI real estate investors.',
    badge: '₹14.2Cr CLOSED'
  },
  {
    id: 'cs-4',
    title: 'Scaled EdTech SaaS Platform to 180K Monthly Organic Student Visits',
    client: 'SkillForge Academy',
    industry: 'Education',
    results: [
      { label: 'Organic Visits', value: '180K/Month' },
      { label: 'Course Enrolments', value: '4.2× Growth' },
    ],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    summary: 'Programmatic SEO, DR60+ backlink acquisition, and course comparison landing pages achieved #1 rankings for key tech courses.',
    badge: '180K VISITS'
  }
];

export const defaultSectionsOrder: SectionToggle[] = [
  { id: 'sec_hero', name: 'Hero Section (Headline & Visual Data Mesh)', sectionKey: 'HeroSection', visible: true, requiredPermission: null },
  { id: 'sec_media', name: 'As Featured In Press Media Logos (Marquee)', sectionKey: 'MediaMarquee', visible: true, requiredPermission: null },
  { id: 'sec_why_choose', name: 'Why Choose Us (55/45 Split)', sectionKey: 'WhyChooseUsSection', visible: true, requiredPermission: null },
  { id: 'sec_flagship', name: 'Flagship Ecosystem (7 Growth Divisions)', sectionKey: 'FlagshipEcosystemSection', visible: true, requiredPermission: null },
  { id: 'sec_industries', name: 'Unified Industry Results Grid (12 Sectors)', sectionKey: 'IndustriesSection', visible: true, requiredPermission: null },
  { id: 'sec_calculator', name: 'Growth Potential ROI Calculator', sectionKey: 'GrowthCalculatorSection', visible: true, requiredPermission: null },
  { id: 'sec_offers', name: 'Limited-Time Special Offers & Deals', sectionKey: 'OffersSection', visible: true, requiredPermission: null },
  { id: 'sec_stats', name: 'Verified Revenue Results & Stats Bar', sectionKey: 'StatsSection', visible: true, requiredPermission: null },
  { id: 'sec_reels', name: 'Video Reels & Client Testimonials', sectionKey: 'VideoReelsTestimonials', visible: true, requiredPermission: null },
  { id: 'sec_case_studies', name: 'Verified Growth Stories (Bento Grid)', sectionKey: 'CaseStudiesSection', visible: true, requiredPermission: null },
  { id: 'sec_faq', name: 'Frequently Asked Questions (FAQ)', sectionKey: 'FaqSection', visible: true, requiredPermission: null },
  { id: 'sec_final_cta', name: 'Final Conversion CTA Banner', sectionKey: 'FinalCtaSection', visible: true, requiredPermission: null },
];

export const HomePage: React.FC = () => {
  const [sectionsList, setSectionsList] = useState<SectionToggle[]>(defaultSectionsOrder);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const caseStudiesScrollRef = useRef<HTMLDivElement>(null);

  const fetchSections = async () => {
    try {
      const res = await adminService.getSections();
      if (res && res.success && Array.isArray(res.sections) && res.sections.length > 0) {
        let items = [...res.sections];
        defaultSectionsOrder.forEach(def => {
          if (!items.some(it => it.id === def.id || it.sectionKey === def.sectionKey)) {
            items.push(def);
          }
        });
        setSectionsList(items);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchSections();

    const unsubscribe = subscribeCmsUpdate(() => {
      fetchSections();
    });
    return () => unsubscribe();
  }, []);

  // AUTO SCROLL TIMER FOR CASE STUDIES
  useEffect(() => {
    const csTimer = setInterval(() => {
      if (caseStudiesScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = caseStudiesScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          caseStudiesScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          caseStudiesScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4200);

    return () => clearInterval(csTimer);
  }, []);

  const handleCsScroll = (dir: 'left' | 'right') => {
    if (caseStudiesScrollRef.current) {
      const amount = dir === 'left' ? -350 : 350;
      caseStudiesScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleOpenIndustryAudit = (indName: string) => {
    setSelectedIndustry(indName);
    setAuditModalOpen(true);
  };

  const renderSectionComponent = (section: SectionToggle) => {
    if (section.visible === false) return null;

    const key = (section.id || section.sectionKey || '').toLowerCase();

    if (key.includes('hero')) {
      return <HeroSection key={section.id} />;
    }
    if (key.includes('media')) {
      return <MediaMarquee key={section.id} />;
    }
    if (key.includes('why_choose')) {
      return <WhyChooseUsSection key={section.id} />;
    }
    if (key.includes('flagship') || key.includes('ecosystem')) {
      return <FlagshipEcosystemSection key={section.id} />;
    }
    if (key.includes('industries')) {
      return <IndustriesSection key={section.id} onSelectIndustry={handleOpenIndustryAudit} />;
    }
    if (key.includes('calculator')) {
      return <GrowthCalculatorSection key={section.id} />;
    }
    if (key.includes('offers')) {
      return <OffersSection key={section.id} onClaimOffer={() => setAuditModalOpen(true)} />;
    }
    if (key.includes('stats')) {
      return (
        <section key={section.id} className="py-20 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Verified Revenue Results Across Divisions
              </h2>
              <p className="text-[#1352D0] font-black text-sm sm:text-base max-w-xl mx-auto">
                Real-time performance metrics tracking client traffic surges, ad ROAS efficiency, and system SLA uptime.
              </p>
            </div>
            <AnimatedStats
              stats={[
                { value: '+340%', label: 'Avg Organic Traffic', subtext: 'Google Rank Mastery' },
                { value: '4.8x', label: 'Average Ad ROAS', subtext: 'Meta & Google Ads Engine' },
                { value: '450+', label: 'Case Studies Completed', subtext: 'Proven Track Record' },
                { value: '99.8%', label: 'System SLA Uptime', subtext: 'Arvian Web Software' }
              ]}
            />
          </div>
        </section>
      );
    }
    if (key.includes('reels') || key.includes('testimonials')) {
      return (
        <React.Fragment key={section.id}>
          <VideoReelsTestimonials />
          <div className="bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white relative overflow-hidden">
            <AnimatedTestimonials />
          </div>
        </React.Fragment>
      );
    }
    if (key.includes('case_studies')) {
      return (
        <section key={section.id} className="py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] relative font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#1352D0] bg-white px-4 py-1.5 rounded-full border border-blue-200 shadow-sm inline-block">
                Proven Track Record
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Featured Growth Case Studies
              </h2>
            </div>
            <div className="relative group/carousel">
              <button
                onClick={() => handleCsScroll('left')}
                className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#1352D0] text-slate-800 hover:text-white border border-slate-200 shadow-xl backdrop-blur-md transition-all flex items-center justify-center cursor-pointer group/btn active:scale-90"
                aria-label="Previous Case Study"
              >
                <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => handleCsScroll('right')}
                className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#1352D0] text-slate-800 hover:text-white border border-slate-200 shadow-xl backdrop-blur-md transition-all flex items-center justify-center cursor-pointer group/btn active:scale-90"
                aria-label="Next Case Study"
              >
                <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <div
                ref={caseStudiesScrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 py-2 px-1 no-scrollbar scroll-smooth items-stretch"
              >
                {caseStudiesData.map((cs) => (
                  <div
                    key={cs.id}
                    className="shrink-0 w-[85vw] sm:w-[350px] snap-center bg-white rounded-3xl overflow-hidden border border-blue-200/90 shadow-[0_6px_25px_rgba(30,91,198,0.08)] hover:shadow-[0_14px_40px_rgba(30,91,198,0.15)] hover:border-[#1352D0] transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-[#1352D0] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                        {cs.badge}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">
                          {cs.client} • {cs.industry}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1352D0] transition-colors leading-snug">
                          {cs.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                          {cs.summary}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                        {cs.results.slice(0, 2).map((res, i) => (
                          <div key={i} className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100/90">
                            <span className="text-[10px] font-semibold text-slate-500 block">{res.label}</span>
                            <span className="text-sm font-black text-[#1352D0]">{res.value}</span>
                          </div>
                        ))}
                      </div>
                      <Link to="/case-studies" className="w-full py-3 text-center text-xs font-bold text-slate-900 bg-slate-100 hover:bg-[#1352D0] hover:text-white rounded-xl transition-colors block">
                        Read Detailed Breakdown
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }
    if (key.includes('faq')) {
      return <FaqSection key={section.id} />;
    }
    if (key.includes('cta') || key.includes('final_cta')) {
      return <FinalCtaSection key={section.id} />;
    }

    return null;
  };

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)] font-sans">
      
      {/* DYNAMICALLY ORDERED & TOGGLED SECTIONS */}
      {sectionsList.map(sec => renderSectionComponent(sec))}

      {/* GLOBAL SEO AUDIT MODAL */}
      <SeoAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        defaultIndustry={selectedIndustry}
      />
    </div>
  );
};
