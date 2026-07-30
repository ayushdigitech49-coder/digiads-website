import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import type { ServiceItem } from '../types';
import { useModal } from '../context/ModalContext';
import { serviceService } from '../services/service.service';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openConsultationModal, openAuditModal } = useModal();

  const [service, setService] = useState<ServiceItem>(() => {
    return servicesData.find((s) => s.slug === slug || s.id === slug) || servicesData[0];
  });

  useEffect(() => {
    if (!slug) return;
    serviceService.getServiceBySlug(slug).then((res) => {
      if (res) setService(res);
    });
  }, [slug]);

  useEffect(() => {
    if (service) {
      if (service.metaTitle) document.title = service.metaTitle;
      
      if (service.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', service.metaDescription);
      }
    }
  }, [service]);

  return (
    <div className="relative font-sans overflow-hidden">
      {/* Custom Script Injection */}
      {service?.customScript && (
        <div dangerouslySetInnerHTML={{ __html: service.customScript }} />
      )}

      {/* Hero Header */}
      <section className="relative min-h-[70vh] bg-[#061329] text-white overflow-hidden flex items-center pt-28 pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,91,198,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,91,198,0.12)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_80%,transparent_100%)] opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[#F4B400] text-xs font-black shadow-md backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1352D0]" />
            <span className="uppercase tracking-widest">{service.category} DIVISION • SUMIT DIGITECH</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-white"
          >
            {service.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium"
          >
            {service.shortDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <button
              onClick={() => openConsultationModal(service.title)}
              className="px-8 py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm rounded-full shadow-xl shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Book {service.category} Strategy Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={openAuditModal}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-full transition-all border border-slate-800 cursor-pointer"
            >
              Get Free Technical Audit
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 sm:py-20 bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-8 space-y-10">
              {/* Overview & Capabilities (TinyMCE HTML Support) */}
              <div className="space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 border-b border-slate-100 pb-4">Overview & Capabilities</h2>
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg space-y-4 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#1352D0] prose-a:font-bold"
                  dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                />
              </div>

              {/* Key Deliverables */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
                  <h3 className="text-xl font-black text-slate-900">Key Deliverables Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <CheckCircle2 className="w-5 h-5 text-[#1352D0] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-extrabold text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Benchmarks & CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-7 bg-slate-950 text-white rounded-3xl shadow-xl space-y-6 border border-slate-800 lg:sticky lg:top-32">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#F4B400]">
                    Division Benchmarks
                  </h3>
                  <Award className="w-4 h-4 text-[#F4B400]" />
                </div>
                
                {service.metrics && service.metrics.length > 0 && (
                  <div className="space-y-4">
                    {service.metrics.map((m, idx) => (
                      <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">{m.label}</span>
                        <span className="text-2xl font-black text-[#1352D0]">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => openConsultationModal(service.title)}
                  className="w-full py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Request Custom Strategy Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
