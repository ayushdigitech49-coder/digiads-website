import React from 'react';

export const BackgroundBeams: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,91,198,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,91,198,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#1352D0]/10 via-[#F4B400]/10 to-[#D91212]/10 blur-[130px] rounded-full pointer-events-none" />
    </div>
  );
};
