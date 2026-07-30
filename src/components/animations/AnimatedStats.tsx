import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatProps {
  value: string;
  label: string;
  subtext?: string;
}

export const AnimatedStats: React.FC<{ stats: StatProps[] }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} stat={stat} index={idx} />
      ))}
    </div>
  );
};

const StatCard: React.FC<{ stat: StatProps; index: number }> = ({ stat, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    
    const numericMatch = stat.value.match(/\d+/);
    if (!numericMatch) {
      setDisplayValue(stat.value);
      return;
    }

    const targetNum = parseInt(numericMatch[0], 10);
    const prefix = stat.value.substring(0, numericMatch.index);
    const suffix = stat.value.substring((numericMatch.index || 0) + numericMatch[0].length);

    let start = 0;
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = targetNum / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNum) {
        setDisplayValue(`${prefix}${targetNum}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplayValue(`${prefix}${Math.floor(start)}${suffix}`);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  // Color mapping based on index to rotate through brand palette
  const textColor = index % 3 === 0 ? 'text-[#1352D0]' : index % 3 === 1 ? 'text-[#D91212]' : 'text-[#F4B400]';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md text-center relative overflow-hidden group hover:border-[#1352D0] hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1352D0] via-[#D91212] to-[#F4B400]" />
      <div className={`text-3xl md:text-4xl font-black mb-1 tracking-tight ${textColor}`}>
        {displayValue}
      </div>
      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">{stat.label}</div>
      {stat.subtext && <div className="text-[11px] text-slate-500 mt-1">{stat.subtext}</div>}
    </motion.div>
  );
};
