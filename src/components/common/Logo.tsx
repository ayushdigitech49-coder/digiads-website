import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
}

export const LogoIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ size = 'md', className = '' }) => {
  const hClass = size === 'sm' ? 'h-8 sm:h-9' : size === 'lg' ? 'h-12 sm:h-14' : size === 'xl' ? 'h-14 sm:h-16' : 'h-10 sm:h-11';
  return (
    <svg
      className={`w-auto object-contain shrink-0 ${hClass} ${className}`}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="digiGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#0072FF" />
        </linearGradient>
        <linearGradient id="digiGradSub" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#00A3FF" />
        </linearGradient>
      </defs>
      {/* Outer/Top Chevron */}
      <path
        d="M50 5L92 50H70L50 28L30 50H8L50 5Z"
        fill="url(#digiGradMain)"
      />
      {/* Inner/Lower Chevron */}
      <path
        d="M50 32L76 60H60L50 49L40 60H24L50 32Z"
        fill="url(#digiGradSub)"
      />
      {/* Center triangle accent */}
      <path
        d="M50 56L59 66H41L50 56Z"
        fill="#00E5FF"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'light', showText = true }) => {
  const textSizeClass = size === 'sm' 
    ? 'text-xl tracking-tight' 
    : size === 'lg' 
    ? 'text-2xl sm:text-3xl tracking-tight' 
    : size === 'xl' 
    ? 'text-3xl sm:text-4xl tracking-tight' 
    : 'text-xl sm:text-2xl tracking-tight';

  // variant="dark" means Logo is ON a dark background -> DIGI must be WHITE
  // variant="light" means Logo is ON a light background -> DIGI is DARK SLATE
  const digiColor = variant === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`inline-flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}>
      <LogoIcon size={size} />
      {showText && (
        <div className={`font-black uppercase flex items-center leading-none ${textSizeClass}`}>
          <span className={`${digiColor} transition-colors duration-200`}>DIGI</span>
          <span className="text-[#00A3FF] ml-0.5">ADS</span>
        </div>
      )}
    </div>
  );
};

