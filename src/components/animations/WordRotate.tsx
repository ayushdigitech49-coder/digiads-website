import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const WordRotate: React.FC<{ words: string[]; className?: string }> = ({
  words,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <span className={`inline-block relative overflow-hidden h-[1.2em] vertical-align-middle ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="inline-block gradient-text-growth font-extrabold"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
