import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, ArrowRight, User, Mail, Phone, BarChart2, ShieldCheck, Clock, FileText, Star } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { contactService } from '../../services/contact.service';
import { adminService } from '../../services/admin.service';

export const BookConsultationModal: React.FC = () => {
  const { isConsultationModalOpen, closeConsultationModal, selectedService } = useModal();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(selectedService || 'All Unified Services');
  const [budget, setBudget] = useState('₹50,000 - ₹1,00,000');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');

  if (!isConsultationModalOpen) return null;

  // STRICT 10-DIGIT PHONE HANDLER
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setPhoneError('Please enter exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setPhoneError('Valid 10-digit mobile number required');
      return;
    }

    setLoading(true);
    setPhoneError('');

    try {
      const res = await contactService.submitLead({
        fullName,
        email,
        phone,
        serviceRequired: service,
        monthlyBudget: budget,
        message,
      });
      // Also post directly to Express backend
      try {
        await adminService.createLead({
          fullName,
          email,
          phone,
          serviceRequired: service,
          monthlyBudget: budget,
          message,
          source: 'Book Strategy Call Modal',
        });
      } catch (err) {
        console.log('Backend sync:', err);
      }
      setSuccessMsg(res.message);
    } catch {
      setSuccessMsg('Consultation request received! Our senior strategist will call you within 24 hours.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessMsg('');
    setPhoneError('');
    closeConsultationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#091122] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800/90 relative text-white my-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!successMsg ? (
          <div className="flex flex-col lg:flex-row">
            
            {/* DESKTOP-ONLY LEFT FEATURE SIDEBAR PANEL */}
            <div className="hidden lg:flex w-5/12 bg-[#0D182E] p-8 border-r border-slate-800/80 flex-col justify-between space-y-6 shrink-0">
              <div className="space-y-6">
                
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-[#3B82F6] text-xs font-black">
                  <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="uppercase tracking-wider">GROWTH STRATEGY CALL</span>
                </div>

                {/* Left Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                    Let's Build Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                      10x Growth Blueprint
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal leading-relaxed">
                    Connect with our senior growth architects to map your ROI scaling strategy and unlock predictable growth.
                  </p>
                </div>

                {/* 4 Feature Value Props */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Data-Driven Strategy</h4>
                      <p className="text-[11px] text-slate-400 font-normal">Custom roadmap based on your business goals</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Expert Growth Architects</h4>
                      <p className="text-[11px] text-slate-400 font-normal">1:1 session with senior growth strategists</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">60-Minute Session</h4>
                      <p className="text-[11px] text-slate-400 font-normal">Deep dive into your growth opportunities</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Actionable Roadmap</h4>
                      <p className="text-[11px] text-slate-400 font-normal">Clear plan with next steps & recommendations</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Social Proof Avatar Box */}
              <div className="pt-6 border-t border-slate-800/80">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3">
                  <div className="flex -space-x-2 overflow-hidden shrink-0">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0D182E]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0D182E]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0D182E]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-white">500+ Brands Trust Our Process</h5>
                    <div className="flex items-center space-x-1 text-[#F4B400] text-[11px] font-bold">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#F4B400]" />
                        ))}
                      </div>
                      <span className="ml-1 text-slate-300 font-extrabold">4.9/5 Rating</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* FORM AREA (RESPONSIVE FOR ALL SCREEN SIZES) */}
            <div className="w-full lg:w-7/12 p-5 sm:p-8 space-y-5">
              
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Book a Strategy Consultation
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                  Fill in your details and our team will get in touch within 24 hours to schedule your call.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="consult-fullname" className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />
                    <input
                      id="consult-fullname"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B172D] border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white font-medium placeholder-slate-500 selection:bg-[#1352D0] selection:text-white"
                    />
                  </div>
                </div>

                {/* Email & Phone (Side by Side on sm+, Stacked on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="consult-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />
                      <input
                        id="consult-email"
                        type="email"
                        required
                        placeholder="your@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B172D] border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white font-medium placeholder-slate-500 selection:bg-[#1352D0] selection:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="consult-phone" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Phone / WhatsApp *</span>
                      <span className="text-[10px] text-blue-400 font-semibold">{phone.length}/10 digits</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />
                      <input
                        id="consult-phone"
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={handlePhoneChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B172D] border text-sm text-white font-medium placeholder-slate-500 focus:outline-none selection:bg-[#1352D0] selection:text-white ${
                          phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-700/80 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <span className="text-[11px] font-bold text-red-400 mt-1 block">{phoneError}</span>
                    )}
                  </div>
                </div>

                {/* Division & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="consult-service" className="block text-xs font-bold text-slate-300 mb-1.5">
                      Required Division *
                    </label>
                    <select
                      id="consult-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B172D] border border-slate-700/80 focus:outline-none focus:border-blue-500 text-sm text-white font-medium selection:bg-[#1352D0] selection:text-white"
                    >
                      <option value="All Unified Services">All Unified Services</option>
                      <option value="SEO Services">SEO & Organic Search</option>
                      <option value="Performance Marketing">Performance Ads (Google/Meta)</option>
                      <option value="Web Development">Web & App Engineering</option>
                      <option value="Social Media Marketing">Social Media & Reels</option>
                      <option value="Marketplace Management">Marketplace Onboarding (Amazon/Blinkit)</option>
                      <option value="Branding and Design">Branding & Creative Studio</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="consult-budget" className="block text-xs font-bold text-slate-300 mb-1.5">
                      Monthly Budget *
                    </label>
                    <select
                      id="consult-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B172D] border border-slate-700/80 focus:outline-none focus:border-blue-500 text-sm text-white font-medium selection:bg-[#1352D0] selection:text-white"
                    >
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                      <option value="₹2,50,000+ Enterprise">₹2,50,000+ Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Growth Goals / Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="consult-message" className="block text-xs font-bold text-slate-300">
                      Growth Goals / Message
                    </label>
                    <span className="text-[10px] text-slate-500">{message.length}/500</span>
                  </div>
                  <textarea
                    id="consult-message"
                    rows={2}
                    maxLength={500}
                    placeholder="Tell us about your target revenue and business goals..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#0B172D] border border-slate-700/80 focus:outline-none focus:border-blue-500 text-sm text-white font-medium placeholder-slate-500 selection:bg-[#1352D0] selection:text-white"
                  />
                </div>

                {/* Disclaimer line */}
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Your information is secure and will never be shared.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <span>Scheduling Consultation...</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm Consultation Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 pt-0.5">
                  🛡️ No spam. Zero automated calls. Just real strategy.
                </p>

              </form>
            </div>

          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div className="p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">
                Consultation Booking Confirmed!
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                {successMsg}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-extrabold hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
