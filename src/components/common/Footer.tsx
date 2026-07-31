import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Building2, ShieldCheck, MessageCircle } from 'lucide-react';
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
      if (type === 'contact' || type === 'all' || type === 'cms_updated') {
        fetchContactConfig();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info & Dynamic Growth Taglines */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" variant="dark" />
            </Link>

            <div className="space-y-2.5 text-xs font-bold text-slate-300 pt-1">
              {(contactConfig?.footerTaglines && contactConfig.footerTaglines.length > 0
                ? contactConfig.footerTaglines
                : defaultContactData.footerTaglines || []
              ).map((tagline, idx) => {
                const bulletColors = ['bg-[#1352D0]', 'bg-emerald-400', 'bg-indigo-400', 'bg-amber-400', 'bg-purple-400'];
                const colorClass = bulletColors[idx % bulletColors.length];
                return (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${colorClass} shrink-0`} />
                    <span>{tagline}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 2: Growth Divisions */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              {contactConfig?.growthDivisionsHeading || defaultContactData.growthDivisionsHeading}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {(contactConfig?.growthDivisionsLinks && contactConfig.growthDivisionsLinks.length > 0
                ? contactConfig.growthDivisionsLinks
                : defaultContactData.growthDivisionsLinks || []
              ).map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Platform & Company */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              {contactConfig?.platformCompanyHeading || defaultContactData.platformCompanyHeading}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              {(contactConfig?.platformCompanyLinks && contactConfig.platformCompanyLinks.length > 0
                ? contactConfig.platformCompanyLinks
                : defaultContactData.platformCompanyLinks || []
              ).map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Service Cities Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              {contactConfig?.serviceCitiesHeading || defaultContactData.serviceCitiesHeading}
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

          {/* Col 5: Legacy Brand Equity Cards */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              {contactConfig?.legacyBrandHeading || defaultContactData.legacyBrandHeading}
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              {(contactConfig?.legacyBrandCards && contactConfig.legacyBrandCards.length > 0
                ? contactConfig.legacyBrandCards
                : defaultContactData.legacyBrandCards || []
              ).map((card, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white block">{card.title}</span>
                  <span className="text-[11px] text-slate-400">{card.stat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {contactConfig?.copyrightText || defaultContactData.copyrightText}</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>{contactConfig?.securityText || defaultContactData.securityText}</span>
            </span>
            <span className="text-slate-600">|</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
