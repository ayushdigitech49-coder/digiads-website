import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

export const BentoGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard: React.FC<{
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  badge?: string;
  onClick?: () => void;
}> = ({ title, description, header, icon, className, badge, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      onClick={onClick}
      className={cn(
        'row-span-1 rounded-3xl p-8 bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#1352D0] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer',
        className
      )}
    >
      {/* Soft Background Accent Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#1352D0]/5 via-[#D91212]/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
      
      <div>
        {header && <div className="mb-4 overflow-hidden rounded-2xl">{header}</div>}
        
        <div className="flex items-center justify-between mb-4">
          {icon && (
            <div className="p-3.5 bg-blue-50 text-[#1352D0] rounded-2xl group-hover:bg-[#1352D0] group-hover:text-white transition-colors duration-300 shadow-sm">
              {icon}
            </div>
          )}
          {badge && (
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-[#1352D0] group-hover:bg-[#D91212] group-hover:text-white transition-colors uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-[#1352D0] transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-8 flex items-center text-xs font-bold text-[#1352D0] group-hover:text-[#D91212] group-hover:translate-x-1.5 transition-all">
        <span>Explore Division Capabilities</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </div>
    </motion.div>
  );
};
