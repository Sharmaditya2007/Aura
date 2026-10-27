import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, ready, done

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onFinish();
      return;
    }

    // Smooth progress simulation over ~2.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('ready');
          setTimeout(() => {
            setPhase('done');
            setTimeout(onFinish, 600);
          }, 300);
          return 100;
        }
        const increment = Math.max(1, Math.floor((100 - prev) / 6) + Math.floor(Math.random() * 4));
        return Math.min(100, prev + increment);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onFinish]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-white select-none"
      >
        <div className="relative flex flex-col items-center max-w-sm px-6 w-full">
          {/* Minimalist Geometric Monogram Logo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-20 h-20 mb-8 flex items-center justify-center"
          >
            {/* Outer Subtle Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute inset-0 border border-white/20 rounded-2xl"
            />
            {/* Inner Glowing Box */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-12 h-12 bg-[#111111] border border-white/60 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.12)]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Project Title with Refined Typography */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold tracking-[0.25em] uppercase text-white font-sans">
              AURA
            </h1>
            <p className="text-xs uppercase tracking-[0.35em] text-[#A3A3A3] mt-1 font-mono">
              Personal Finance Manager
            </p>
          </motion.div>

          {/* Minimalist Progress Line */}
          <div className="w-48 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Numeric Counter */}
          <div className="mt-3 flex items-center justify-between w-48 text-[11px] font-mono text-[#666666]">
            <span>INITIALIZING</span>
            <span>{progress}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
