import React from 'react';
import { motion } from 'framer-motion';

interface HoverBorderGradientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
}

export const HoverBorderGradient: React.FC<HoverBorderGradientProps> = ({
  children,
  containerClassName = '',
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div className={`relative p-[1px] overflow-hidden rounded-full group inline-block ${containerClassName}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-red-500 to-amber-400 rounded-full animate-border-spin opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundSize: '200% 200%' }}
      />
      <button
        onClick={onClick}
        className={`relative z-10 px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-full flex items-center justify-center space-x-2 group-hover:bg-slate-950 transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
