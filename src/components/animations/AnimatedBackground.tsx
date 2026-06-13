import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Interactive3DBackground } from './Interactive3DBackground';

export const AnimatedBackground: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // If prefers-reduced-motion is true, we render a static background layout without animation.
  const animateOrbs = !prefersReducedMotion;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 select-none">
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-text-main) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-text-main) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <Interactive3DBackground />

      {/* Floating Pastel Orb 1 (Peach) */}
      <motion.div
        className="absolute rounded-full filter blur-[100px] opacity-30 dark:opacity-20"
        style={{
          backgroundColor: '#FAD4C0',
          width: '400px',
          height: '400px',
          top: '10%',
          left: '5%',
        }}
        animate={animateOrbs ? {
          x: [0, 50, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        } : {}}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Pastel Orb 2 (Blue) */}
      <motion.div
        className="absolute rounded-full filter blur-[120px] opacity-35 dark:opacity-15"
        style={{
          backgroundColor: '#80A1C1',
          width: '500px',
          height: '500px',
          bottom: '15%',
          right: '8%',
        }}
        animate={animateOrbs ? {
          x: [0, -60, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.95, 1.1, 1],
        } : {}}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Pastel Orb 3 (Soft Green Accent) */}
      <motion.div
        className="absolute rounded-full filter blur-[90px] opacity-20 dark:opacity-10"
        style={{
          backgroundColor: '#16A34A',
          width: '300px',
          height: '300px',
          top: '45%',
          left: '50%',
        }}
        animate={animateOrbs ? {
          x: [0, 30, -50, 0],
          y: [0, 40, -30, 0],
        } : {}}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
