import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from './Logo';

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader immediately so FCP/LCP performance is maximized
    setLoading(false);
  }, []);

  const petals = Array.from({ length: 12 });

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center select-none overflow-hidden"
        >
          {/* Centered Container with 12-Petal Radial Spinner & Centered Logo */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            
            {/* 12 Radial Oval Petals Spinner (Exactly like screenshot) */}
            <svg
              className="absolute inset-0 w-full h-full animate-[spin_1.2s_steps(12,end)_infinite]"
              viewBox="0 0 100 100"
            >
              {petals.map((_, i) => {
                const angle = i * 30;
                // Progressive fading opacity for authentic loading.io effect
                const opacity = 0.15 + ((i + 1) / 12) * 0.85;
                // Brand color accents
                const colors = ['#1352D0', '#D91212', '#F4B400', '#1352D0', '#D91212', '#F4B400'];
                const color = colors[i % colors.length];

                return (
                  <rect
                    key={i}
                    x="47"
                    y="5"
                    width="6"
                    height="14"
                    rx="3"
                    ry="3"
                    fill={color}
                    opacity={opacity}
                    transform={`rotate(${angle} 50 50)`}
                  />
                );
              })}
            </svg>

            {/* Logo Icon in Dead Center */}
            <div className="relative z-10 flex items-center justify-center">
              <LogoIcon size="md" className="w-11 h-11 sm:w-13 sm:h-13" />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
