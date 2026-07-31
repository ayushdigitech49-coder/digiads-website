import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight, Clock, MessageCircle, Search, TrendingUp, Code2, Palette, Cpu, Award, Star, ShieldCheck, Sparkles, Users, Globe, Zap, Camera, BarChart3, Headphones, Send } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { theme } from '../config/theme';
import { contactService } from '../services/contact.service';
import { useModal } from '../context/ModalContext';
import { adminService } from '../services/admin.service';
import { defaultContactData, type ContactConfigData } from '../data/contactData';
import { subscribeCmsUpdate } from '../utils/broadcastSync';

const WhatsappIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.14 4.162 4.183-1.095z"/>
  </svg>
);

export const ContactPage: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [service, setService] = useState('All Services');
  const [budget, setBudget] = useState('Not Sure Yet');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [config, setConfig] = useState<ContactConfigData>(() => {
    const saved = localStorage.getItem('sumit_contact_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultContactData;
  });

  const loadContactConfig = async () => {
    try {
      const res = await adminService.getContactConfig();
      if (res && res.success && res.contactConfig) {
        setConfig(res.contactConfig);
        localStorage.setItem('sumit_contact_config', JSON.stringify(res.contactConfig));
        return;
      }
    } catch {}

    const saved = localStorage.getItem('sumit_contact_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch {}
    }
  };

  useEffect(() => {
    loadContactConfig();

    const unsubscribe = subscribeCmsUpdate((type) => {
      if (type === 'contact' || type === 'all') {
        loadContactConfig();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number (e.g. 9829012345).');
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.submitLead({
        fullName,
        email,
        phone: cleanPhone,
        websiteUrl,
        serviceRequired: service,
        monthlyBudget: budget,
        message,
      });
      setStatus(res.message);
      setFullName(''); setEmail(''); setPhone(''); setWebsiteUrl(''); setMessage('');
    } catch (err: any) {
      setStatus(err?.response?.data?.message || 'Failed to submit form. Please try again or WhatsApp us.');
    } finally {
      setLoading(false);
    }
  };

  const contactChannels = [
    { icon: <Phone className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Direct Growth Hotline', primary: config.phone || theme.branding.contact.phone, secondary: config.phoneHours || 'Mon-Sat • 9AM-8PM IST', ringColor: 'ring-emerald-400' },
    { icon: <WhatsappIcon className="w-5 h-5" />, color: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20', title: 'WhatsApp VIP Desk', primary: config.whatsapp || theme.branding.contact.whatsapp, secondary: config.whatsappResponseTime || 'Average reply in 12 minutes', ringColor: 'ring-[#25D366]' },
    { icon: <Mail className="w-5 h-5" />, color: 'bg-blue-50 text-[#1352D0] border-blue-100', title: 'Official Email', primary: config.email || theme.branding.contact.email, secondary: config.emailSla || '24hr SLA response guarantee', ringColor: 'ring-[#1352D0]' },
    { icon: <MapPin className="w-5 h-5" />, color: 'bg-[#D91212]/10 text-[#D91212] border-[#D91212]/20', title: 'Jaipur HQ Office', primary: config.officeAddressLine1 || 'Tonk Road, Malviya Nagar', secondary: config.officeAddressLine2 || 'Rajasthan, India • 302017', ringColor: 'ring-[#D91212]' },
  ];

  const faqs = config.faqs || defaultContactData.faqs;

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative font-sans overflow-hidden">

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[88vh] bg-[#061329] text-white overflow-hidden flex items-center pt-38 pb-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(217,18,18,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(244,180,0,0.18),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
     

          <div className="max-w-5xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white space-y-2"
            >
              <div>Stop Losing Leads.</div>
              <div>
                <span className="text-[#D91212] drop-shadow-[0_0_25px_rgba(217,18,18,0.7)]">Talk to a Growth</span>
                <span className="text-white"> Expert </span>
                <span className="text-[#F4B400] drop-shadow-[0_0_18px_rgba(244,180,0,0.5)]">Today.</span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed pt-6"
            >
              No generic sales pitches. Book a direct line with our senior strategists who have generated ₹450+ Cr in measurable revenue for 450+ brands across India and 12+ countries.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="pt-8 border-t border-slate-800/80 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left"
          >
            {[
              { icon: <Zap className="w-4 h-4 text-[#F4B400]" />, value: '< 2 Hours', label: 'Avg Response Time' },
              { icon: <Users className="w-4 h-4 text-emerald-400" />, value: '12,400+', label: 'Leads Closed This Year' },
              { icon: <Globe className="w-4 h-4 text-[#1352D0]" />, value: '12+', label: 'Countries Served' },
              { icon: <Star className="w-4 h-4 fill-[#F4B400] text-[#F4B400]" />, value: '4.9/5', label: 'Client Rating' },
            ].map((stat, i) => (
              <div key={i} className="px-4 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center space-x-2 mb-1.5">
                  {stat.icon}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">{stat.value}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => { document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="w-full sm:w-auto px-10 py-5 bg-[#D91212] hover:bg-red-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#D91212] shadow-2xl shadow-red-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 group"
            >
              <Send className="w-5 h-5" />
              <span>Send Strategy Request</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={`https://wa.me/${theme.branding.contact.whatsapp.replace(/\s|\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-[#25D366] hover:bg-[#20b358] text-white font-extrabold text-base sm:text-lg rounded-full border border-[#25D366] shadow-2xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
            >
              <WhatsappIcon className="w-5 h-5" />
              <span>WhatsApp Us Instantly</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 2: CONTACT CHANNELS + FORM BENTO (5/7 split)  */}
      {/* ===================================================== */}
      <section className="relative py-24 bg-[linear-gradient(180deg,#F1F5F9_0%,#FFFFFF_50%,#F8FAFC_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-14 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#1352D0] text-[11px] font-black shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">MULTIPLE CHANNELS • PICK YOUR FAVORITE</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
            >
              Direct Lines to Our <span className="text-[#D91212]">Specialists</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Contact channels (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {contactChannels.map((ch, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex items-start space-x-5 cursor-pointer"
                >
                  <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${ch.color} border-2 group-hover:ring-4 ${ch.ringColor}/20 transition-all`}>
                    {ch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ch.title}</span>
                    <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 truncate">{ch.primary}</div>
                    <div className="text-xs sm:text-sm text-slate-500 font-bold mt-1">{ch.secondary}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#D91212] group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl p-7 bg-gradient-to-br from-slate-900 via-[#0A1F47] to-slate-900 text-white border border-slate-800 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(244,180,0,0.2),transparent_70%)]" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[radial-gradient(circle,rgba(217,18,18,0.25),transparent_70%)]" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#F4B400]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F4B400]">Working Hours & VIP Support</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Regular Desk</div>
                      <div className="text-sm font-black text-white mt-1">Mon — Sat</div>
                      <div className="text-xs text-slate-300 font-bold">9:00 AM — 8:00 PM IST</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#F4B400] font-bold">Enterprise VIP</div>
                      <div className="text-sm font-black text-white mt-1">24 / 7 / 365</div>
                      <div className="text-xs text-slate-300 font-bold">Priority Ad Ops Support</div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
                      ].map((src, i) => (
                        <img key={i} src={src} alt={`Senior Strategist ${i + 1}`} className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" />
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-400">3 Senior Strategists Online <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" /></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Form (7 cols) */}
            <div id="contact-form-section" className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-[#0A1F47] via-[#0D2158] to-[#0A1F47] text-white px-8 py-6 border-b border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-52 h-52 bg-[radial-gradient(circle,rgba(217,18,18,0.25),transparent_70%)]" />
                  <div className="relative z-10 flex items-start justify-between space-x-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#F4B400] mb-1.5">Fill this out • Takes ~2 minutes</div>
                      <h3 className="text-2xl sm:text-3xl font-black">Send a Strategy Request</h3>
                      <p className="text-slate-400 text-sm font-bold mt-1">Get a FREE 90-day growth blueprint worth ₹15,000 on your first call.</p>
                    </div>
                    <div className="shrink-0 hidden sm:flex items-center space-x-1 text-[#F4B400]">
                      {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-[#F4B400]" />))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {status ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 sm:p-12 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl space-y-5 text-center"
                    >
                      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center ring-8 ring-emerald-50">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Request Received! 🎉</h3>
                        <p className="text-sm sm:text-base text-slate-600 font-bold max-w-lg mx-auto">{status}</p>
                      </div>
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          onClick={() => setStatus(null)}
                          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-full transition-all"
                        >
                          Send Another Message
                        </button>
                        <a
                          href={`https://wa.me/${theme.branding.contact.whatsapp.replace(/\s|\+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-3.5 bg-[#25D366] hover:bg-[#20b358] text-white text-sm font-black rounded-full transition-all flex items-center space-x-2"
                        >
                          <WhatsappIcon className="w-4 h-4" />
                          <span>Chat on WhatsApp Now</span>
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label htmlFor="contact-fullname" className="block text-xs font-black text-slate-700 mb-1.5">Full Name <span className="text-[#D91212]">*</span></label>
                          <input
                            id="contact-fullname"
                            type="text" required placeholder="e.g. Sumit Sharma"
                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="block text-xs font-black text-slate-700 mb-1.5">Phone / WhatsApp <span className="text-[#D91212]">*</span></label>
                          <input
                            id="contact-phone"
                            type="tel" required placeholder="10-digit mobile number"
                            maxLength={10}
                            value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label htmlFor="contact-email" className="block text-xs font-black text-slate-700 mb-1.5">Email Address <span className="text-[#D91212]">*</span></label>
                          <input
                            id="contact-email"
                            type="email" required placeholder="you@company.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-website" className="block text-xs font-black text-slate-700 mb-1.5">Website URL (Optional)</label>
                          <input
                            id="contact-website"
                            type="url" placeholder="https://yourcompany.com"
                            value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label htmlFor="contact-service" className="block text-xs font-black text-slate-700 mb-1.5">Service Division</label>
                          <select
                            id="contact-service"
                            value={service} onChange={(e) => setService(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none bg-white transition-all"
                          >
                            <option>All Unified Growth Services</option>
                            <option>SEO & Local Search (SEO Company Jaipur)</option>
                            <option>Performance Marketing (PerformanceMarketing4U)</option>
                            <option>Web & App Engineering (Arvian)</option>
                            <option>Social Media & Video (Digimagnate)</option>
                            <option>Branding & Logo Design</option>
                            <option>AI Marketing & Automation</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="contact-budget" className="block text-xs font-black text-slate-700 mb-1.5">Monthly Budget</label>
                          <select
                            id="contact-budget"
                            value={budget} onChange={(e) => setBudget(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none bg-white transition-all"
                          >
                            <option>Not Sure Yet (Advise Me)</option>
                            <option>₹25K — ₹50K / Month</option>
                            <option>₹50K — ₹1 Lakh / Month</option>
                            <option>₹1 Lakh — ₹3 Lakhs / Month</option>
                            <option>₹3 Lakhs — ₹10 Lakhs / Month</option>
                            <option>₹10 Lakhs+ / Month (Enterprise)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-xs font-black text-slate-700 mb-1.5">Project Details / Growth Goals</label>
                        <textarea
                          id="contact-message"
                          rows={5} placeholder="Describe your target revenue goals, current marketing bottlenecks, or any specific challenges you want us to solve. The more detail, the better our strategy blueprint!"
                          value={message} onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-[#D91212]/10 focus:border-[#D91212] text-sm font-bold focus:outline-none resize-none transition-all"
                        />
                      </div>

                      <div className="flex items-start space-x-3 pt-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">
                          Your details are 100% private and protected. We never share or sell contact data. We'll only reach out regarding your growth strategy inquiry.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-[#D91212] via-red-600 to-[#D91212] hover:brightness-110 text-white font-black text-base rounded-full shadow-2xl shadow-red-600/30 transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending Your Request...</span></>
                        ) : (
                          <><Sparkles className="w-5 h-5" /><span>Send Strategy Request & Get Free Audit</span><ArrowRight className="w-5 h-5" /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 3: FAQ ACCORDION                              */}
      {/* ===================================================== */}
      <section className="relative py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-14 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[#1352D0] text-[11px] font-black shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">FREQUENTLY ASKED QUESTIONS</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
            >
              Everything You Need to <span className="text-[#1352D0]">Know</span>
            </motion.h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === i
                    ? 'bg-gradient-to-br from-white via-blue-50/30 to-white border-[#1352D0]/30 shadow-xl shadow-[#1352D0]/5'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 sm:px-7 py-5 sm:py-6 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                      openFaq === i ? 'bg-[#1352D0] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug pr-4">{faq.q}</h3>
                  </div>
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    openFaq === i ? 'bg-[#1352D0] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ArrowRight className="w-4 h-4 -rotate-90" />
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pl-20 sm:pl-24 -mt-1">
                    <p className="text-sm sm:text-base text-slate-600 font-bold leading-relaxed">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 4: 7 DIVISIONS CAPABILITY STRIP               */}
      {/* ===================================================== */}
      <section className="relative py-20 bg-[#F8FAFC] border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
              END-TO-END CAPABILITIES UNDER ONE ROOF
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              7 Specialized Divisions. <span className="text-[#1352D0]">One Accountability.</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { icon: <Search className="w-7 h-7" />, name: 'SEO Division', color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-600 hover:text-white hover:border-blue-600' },
              { icon: <TrendingUp className="w-7 h-7" />, name: 'Performance Ads', color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' },
              { icon: <Code2 className="w-7 h-7" />, name: 'Web Engineering', color: 'text-indigo-600', bg: 'bg-indigo-50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600' },
              { icon: <Camera className="w-7 h-7" />, name: 'Social Media', color: 'text-pink-600', bg: 'bg-pink-50 hover:bg-pink-600 hover:text-white hover:border-pink-600' },
              { icon: <Palette className="w-7 h-7" />, name: 'Brand Studio', color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-600 hover:text-white hover:border-amber-600' },
              { icon: <Cpu className="w-7 h-7" />, name: 'AI Automation', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-600 hover:text-white hover:border-purple-600' },
              { icon: <BarChart3 className="w-7 h-7" />, name: 'Content Lab', color: 'text-rose-600', bg: 'bg-rose-50 hover:bg-rose-600 hover:text-white hover:border-rose-600' },
            ].map((div, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col items-center justify-center space-y-3 text-center cursor-pointer transition-all duration-300 ${div.bg}`}
              >
                <div className={`${div.color} transition-colors duration-300`}>
                  {div.icon}
                </div>
                <span className="text-xs sm:text-sm font-black leading-tight">{div.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 5: FINAL CTA                                  */}
      {/* ===================================================== */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white overflow-hidden">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(217,18,18,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,18,18,0.12)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(217,18,18,0.28),transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-white text-xs font-black shadow-md backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
            <span className="uppercase tracking-widest">3 Senior Strategists Online Right Now</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
          >
            Still Scrolling? <br className="hidden sm:block" />
            <span className="text-[#D91212] drop-shadow-[0_0_25px_rgba(217,18,18,0.6)]">Your Competitors Are Already Scaling.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Book a 30-minute strategy call. We'll audit your stack, show 3 comparable case studies from our 450+ wins, and deliver a 90-day blueprint — no commitment required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm font-bold text-slate-300"
          >
            <div className="flex items-center space-x-2"><div className="flex text-[#F4B400]">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-[#F4B400]" />))}</div><span className="text-white font-black">4.9/5 Google Rating</span></div>
            <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>No Long Locked Contracts</span></div>
            <div className="flex items-center space-x-2"><Award className="w-4 h-4 text-[#1352D0]" /><span>ISO 9001 Certified Agency</span></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
          >
            <button
              onClick={() => openConsultationModal('Contact Final CTA — Urgent Growth Call')}
              className="w-full sm:w-auto px-10 py-5 bg-[#D91212] hover:bg-red-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#D91212] shadow-2xl shadow-red-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 group"
            >
              <Phone className="w-5 h-5" />
              <span>Book My 30-Min Strategy Call</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={`https://wa.me/${theme.branding.contact.whatsapp.replace(/\s|\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-[#25D366] hover:bg-[#20b358] text-white font-extrabold text-base sm:text-lg rounded-full border border-[#25D366] shadow-2xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
            >
              <WhatsappIcon className="w-5 h-5" />
              <span>WhatsApp Me Right Now</span>
            </a>
          </motion.div>

        </div>
      </section>

    </div>
  );
};
