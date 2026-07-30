import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Building2, Target, ShieldCheck, Zap, Brain, Users, Star, Layers
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { useModal } from '../context/ModalContext';
import { adminService, type AboutConfigData, type AboutBrandItem, type AboutValueItem, type AboutTeamMember } from '../services/admin.service';
import { defaultAboutData } from '../data/aboutData';
import { subscribeCmsUpdate } from '../utils/broadcastSync';

export const AboutPage: React.FC = () => {
  const { openConsultationModal } = useModal();

  const [config, setConfig] = useState<AboutConfigData>(() => {
    const saved = localStorage.getItem('sumit_about_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultAboutData;
  });

  const loadAboutConfig = async () => {
    try {
      const res = await adminService.getAboutConfig();
      if (res && res.success && res.aboutConfig) {
        setConfig(res.aboutConfig);
        localStorage.setItem('sumit_about_config', JSON.stringify(res.aboutConfig));
        return;
      }
    } catch {}

    const saved = localStorage.getItem('sumit_about_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch {}
    }
  };

  useEffect(() => {
    loadAboutConfig();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'about' || type === 'all') {
        loadAboutConfig();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (config) {
      if (config.metaTitle) document.title = config.metaTitle;
      
      if (config.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', config.metaDescription);
      }
    }
  }, [config]);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Target': return <Target className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Brain': return <Brain className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="relative font-sans overflow-hidden">
      {/* Custom Script */}
      {config?.customScript && (
        <div dangerouslySetInnerHTML={{ __html: config.customScript }} />
      )}

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[88vh] bg-[#061329] text-white overflow-hidden flex items-center pt-28 pb-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[#F4B400] text-xs font-black shadow-md backdrop-blur-md"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1352D0]" />
            <span className="uppercase tracking-widest">{config.heroBadge}</span>
          </motion.div>

          <div className="max-w-5xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white space-y-2"
            >
              <div>{config.heroTitleLine1}</div>
              <div>
                <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">
                  {config.heroTitleHighlight}
                </span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed pt-6"
            >
              {config.heroDescription}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => openConsultationModal('About — Meet the Team Consultation')}
              className="w-full sm:w-auto px-8 py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm sm:text-base rounded-full border border-[#1352D0] shadow-xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 group cursor-pointer"
            >
              <span>Book a Call With the Team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: MERGED BRANDS SHOWCASE */}
      <section id="our-story" className="relative py-24 sm:py-28 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {config.section2TitleLine1 || 'The Specialized Agencies'} <br className="hidden sm:block" />
              <span className="text-[#1352D0]">{config.section2TitleHighlight || 'Merged Into Sumit DigiTech'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {(config.mergedBrands || []).map((brand: AboutBrandItem, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`group rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-400 p-7 sm:p-8 overflow-hidden ${brand.accent || 'border-l-4 border-l-[#1352D0]'} relative`}
              >
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${brand.tagColor || 'bg-blue-50 text-[#1352D0] border-blue-200'}`}>
                    {brand.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{brand.stat}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">{brand.statLabel}</span>
                  </div>
                </div>

                <div className="space-y-3 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#1352D0] transition-colors">
                    {brand.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{brand.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: LEADERSHIP TEAM */}
      {(config.leadershipTeam || []).length > 0 && (
        <section className="relative py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Meet Our <span className="text-[#1352D0]">Leadership Squad</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.leadershipTeam.map((member: AboutTeamMember, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all p-5 text-center space-y-4"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto border-4 border-white shadow-md">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{member.name}</h3>
                    <p className="text-xs font-bold text-[#1352D0] mt-0.5">{member.role}</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider mt-2">
                      {member.division}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: CORE VALUES */}
      <section className="relative py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Our <span className="text-[#D91212]">Core Values</span> Define Every Engagement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {(config.coreValues || []).map((val: AboutValueItem, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group rounded-3xl bg-white border border-slate-200 hover:border-[#1352D0]/40 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-400 p-7 sm:p-8 relative overflow-hidden"
              >
                <div className={`p-4 rounded-2xl w-fit mb-5 transition-all duration-300 shadow-sm ${val.color || 'bg-blue-50 text-[#1352D0]'} relative z-10`}>
                  {renderIcon(val.iconName)}
                </div>
                <div className="space-y-3 relative z-10">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#1352D0] transition-colors">{val.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Ready to Work With the <br className="hidden sm:block" />
            <span className="text-[#F4B400] drop-shadow-[0_0_25px_rgba(244,180,0,0.5)]">Unified #1 Squad in Jaipur?</span>
          </motion.h2>

          <button
            onClick={() => openConsultationModal('About Final CTA — Strategy Call')}
            className="px-10 py-5 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#1352D0] shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Book My 30-Min Strategy Call
          </button>
        </div>
      </section>

    </div>
  );
};
