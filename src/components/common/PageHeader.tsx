import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  parentPath?: string;
  parentLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  parentPath = '/',
  parentLabel = 'Home',
}) => {
  return (
    <header className="relative bg-[#1D2B53] text-white pt-32 sm:pt-36 pb-12 sm:pb-14 overflow-hidden shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {title}
        </h1>
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-300 flex-wrap pt-1">
          <Link to={parentPath} className="hover:text-white transition-colors underline-offset-4 hover:underline">
            {parentLabel}
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-100 font-extrabold">
            {title}
          </span>
        </nav>
        {subtitle && (
          <p className="text-slate-300 text-xs sm:text-sm font-medium pt-1">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};
