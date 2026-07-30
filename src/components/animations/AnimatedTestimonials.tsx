import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonialsData } from '../../data/testimonialsData';

export const AnimatedTestimonials: React.FC = () => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const item = testimonialsData[active];

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        
        {/* Glow Orbs */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#1352D0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#D91212]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6 relative z-10">
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-[#F4B400] bg-slate-800 px-3.5 py-1 rounded-full border border-slate-700">
              Verified Client Growth Stories
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white">What Founders & CMOs Say</h3>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrev}
              className="p-3 bg-slate-800 hover:bg-[#1352D0] rounded-full text-white transition-colors duration-200 shadow-md"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-slate-800 hover:bg-[#1352D0] rounded-full text-white transition-colors duration-200 shadow-md"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
          >
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center space-x-1 text-[#F4B400]">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
                ))}
              </div>

              <Quote className="w-12 h-12 text-[#1352D0]/50" />

              <p className="text-lg md:text-xl font-semibold text-slate-100 leading-relaxed italic">
                "{item.content}"
              </p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role}, {item.company}</p>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-400 block">Verified Result</span>
                  <span className="text-sm font-extrabold text-emerald-400">{item.resultsAchieved}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-2 border-[#1352D0] shadow-2xl">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#1352D0] to-[#D91212] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                  {item.brandAssociated}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
