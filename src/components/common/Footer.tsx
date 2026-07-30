import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Building2, ShieldCheck } from 'lucide-react';
import { theme } from '../../config/theme';
import { Logo } from './Logo';
import { adminService } from '../../services/admin.service';
import { defaultContactData, type ContactConfigData } from '../../data/contactData';
import { subscribeCmsUpdate } from '../../utils/broadcastSync';

export const Footer: React.FC = () => {
  const [contactConfig, setContactConfig] = useState<ContactConfigData>(() => {
    const saved = localStorage.getItem('sumit_contact_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultContactData;
  });

  useEffect(() => {
    const fetchContactConfig = async () => {
      try {
        const res = await adminService.getContactConfig();
        if (res && res.success && res.contactConfig) {
          setContactConfig(res.contactConfig);
          localStorage.setItem('sumit_contact_config', JSON.stringify(res.contactConfig));
          return;
        }
      } catch {}

      const saved = localStorage.getItem('sumit_contact_config');
      if (saved) {
        try { setContactConfig(JSON.parse(saved)); } catch {}
      }
    };

    fetchContactConfig();
    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'contact' || type === 'all') {
        fetchContactConfig();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info & Growth Taglines */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" variant="dark" />
            </Link>

            <div className="space-y-2.5 text-xs font-bold text-slate-300 pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1352D0] shrink-0" />
                <span>AI-Powered Search & Revenue Growth Engine</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>High-ROAS Performance Ads & Scalable SEO</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Full-Stack Digital Growth Engineering Squad</span>
              </div>
            </div>
          </div>

          {/* Col 2: Growth Divisions */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Growth Divisions
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/services/seo-services" className="hover:text-blue-400 transition-colors">
                  SEO & Organic Search (SEO Company Jaipur)
                </Link>
              </li>
              <li>
                <Link to="/services/performance-marketing" className="hover:text-blue-400 transition-colors">
                  Performance Ads (PerformanceMarketing4U)
                </Link>
              </li>
              <li>
                <Link to="/services/web-development" className="hover:text-blue-400 transition-colors">
                  Web & App Engineering (Arvian Stack)
                </Link>
              </li>
              <li>
                <Link to="/services/social-media-marketing" className="hover:text-blue-400 transition-colors">
                  Social Media & Reels (Digimagnate)
                </Link>
              </li>
              <li>
                <Link to="/services/branding-and-design" className="hover:text-blue-400 transition-colors">
                  Branding & Identity Design
                </Link>
              </li>
              <li>
                <Link to="/services/ai-marketing-solutions" className="hover:text-blue-400 transition-colors">
                  AI Marketing & Voice Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform & Company */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Platform & Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Agency Merger</Link></li>
              <li><Link to="/case-studies" className="hover:text-white transition-colors">Client Case Studies</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Work Showcase</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Growth Plans & Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">SEO & Ads Blog</Link></li>
              <li><Link to="/free-audit" className="hover:text-white transition-colors">Free Website Audit Tool</Link></li>
            </ul>
          </div>

          {/* Col 4: Service Cities Column (Matching Growth Divisions Font & Layout) */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Service Cities
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {[
                contactConfig?.city,
                ...(contactConfig?.availableCities || 'Jaipur, Delhi NCR, Mumbai, Bangalore, Pune, Ahmedabad, Hyderabad')
                  .split(',')
                  .map(c => c.trim())
              ]
                .filter((item, index, self) => item && self.indexOf(item) === index)
                .map((city, idx) => (
                  <li key={idx} className="hover:text-white transition-colors cursor-default">
                    {city}
                  </li>
                ))}
            </ul>
          </div>

          {/* Col 5: Trust & Merger Badge */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Legacy Brand Equity
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block">SEO Company Jaipur</span>
                <span className="text-[11px] text-slate-400">12k+ Organic Rankings</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block">PerformanceMarketing4U</span>
                <span className="text-[11px] text-slate-400">$5M+ Ad Spend Managed</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block">Arvian + Digimagnate</span>
                <span className="text-[11px] text-slate-400">Full-Stack Tech & Social</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sumit DigiTech Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Enterprise Grade Security</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
