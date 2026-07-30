import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { theme } from '../../config/theme';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" variant="dark" />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The unified digital growth platform consolidating Jaipur's premier agency brands: 
              <span className="text-white font-semibold"> Sumit DigiTech, SEO Company Jaipur, PerformanceMarketing4U, Arvian, and Digimagnate.</span>
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#1352D0] shrink-0" />
                <span>{theme.branding.contact.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{theme.branding.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D91212] shrink-0" />
                <span>{theme.branding.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Consolidated Divisions */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Growth Divisions
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
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

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Platform & Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Agency Merger</Link></li>
              <li><Link to="/case-studies" className="hover:text-white transition-colors">Client Case Studies</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Work Showcase</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Growth Plans & Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">SEO & Ads Blog</Link></li>
              <li><Link to="/free-audit" className="hover:text-white transition-colors">Free Website Audit Tool</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Merger Badge */}
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
