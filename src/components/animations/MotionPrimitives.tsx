import React, { useRef } from 'react';
import { motion, useInView, Variant } from 'framer-motion';

// ============================================================================
// 1. TEXT EFFECT Component (reveals letters or words)
// ============================================================================
interface TextEffectProps {
  children: string;
  per?: 'word' | 'char';
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fade-up' | 'blur-in' | 'scale-up';
}

export const TextEffect: React.FC<TextEffectProps> = ({
  children,
  per = 'char',
  as: Component = 'span',
  className = '',
  delay = 0,
  duration = 0.45,
  variant = 'fade-up',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  
  const items = per === 'word' ? children.split(' ') : children.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: per === 'word' ? 0.08 : 0.02,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Record<string, { hidden: Variant; visible: Variant }> = {
    'fade-up': {
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
    },
    'blur-in': {
      hidden: { opacity: 0, filter: 'blur(6px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration } },
    },
    'scale-up': {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration, ease: 'easeOut' } },
    },
  };

  const selectedVariants = itemVariants[variant] || itemVariants['fade-up'];

  return (
    <Component
      ref={ref}
      className={`inline-block ${className}`}
      aria-label={children}
    >
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="inline-flex flex-wrap"
      >
        {items.map((item, idx) => (
          <motion.span
            key={idx}
            variants={selectedVariants}
            className="inline-block whitespace-pre"
          >
            {item}
            {per === 'word' && idx < items.length - 1 && ' '}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};

// ============================================================================
// 2. INFINITE SLIDER Component (marquee of logos or badges)
// ============================================================================
interface InfiniteSliderProps {
  children: React.ReactNode[];
  direction?: 'left' | 'right';
  speed?: number; // duration in seconds for one full loop
  className?: string;
  gap?: number; // gap in pixels
}

export const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  children,
  direction = 'left',
  speed = 25,
  className = '',
  gap = 24,
}) => {
  const isLeft = direction === 'left';
  
  return (
    <div 
      className={`relative w-full overflow-hidden flex select-none pointer-events-none ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
      }}
    >
      <motion.div
        animate={{
          x: isLeft ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          ease: 'linear',
          duration: speed,
          repeat: Infinity,
        }}
        className="flex shrink-0"
        style={{ gap: `${gap}px` }}
      >
        {/* Render child elements twice to enable infinite looping wrapper */}
        {React.Children.map(children, (child, idx) => (
          <div key={`slider-1-${idx}`} className="flex items-center justify-center shrink-0">
            {child}
          </div>
        ))}
        {React.Children.map(children, (child, idx) => (
          <div key={`slider-2-${idx}`} className="flex items-center justify-center shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================================================
// 3. ORBITING CIRCLES Component (elements rotating around central content)
// ============================================================================
interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  innerRadius?: number;
  outerRadius?: number;
  speedMultiplier?: number;
}

export const OrbitingCircles: React.FC<OrbitingCirclesProps> = ({
  className = '',
  children,
  innerRadius = 80,
  outerRadius = 140,
  speedMultiplier = 1,
}) => {
  const childrenArray = React.Children.toArray(children);
  const innerItems = childrenArray.slice(0, Math.ceil(childrenArray.length / 2));
  const outerItems = childrenArray.slice(Math.ceil(childrenArray.length / 2));

  return (
    <div className={`relative flex h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] items-center justify-center rounded-full border border-dashed border-border-strong/15 bg-transparent ${className}`}>
      
      {/* Central Core (Branding or Highlight) */}
      <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted border border-secondary shadow-md watermelon-card-glow-green">
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse" />
      </div>

      {/* Inner Track (Rotating Counter-Clockwise) */}
      <div 
        className="absolute rounded-full border border-dashed border-border-strong/10"
        style={{ width: `${innerRadius * 2}px`, height: `${innerRadius * 2}px` }}
      />
      {innerItems.map((child, index) => {
        const angle = (360 / innerItems.length) * index;
        return (
          <div
            key={`inner-${index}`}
            className="absolute flex items-center justify-center"
            style={{
              // Set custom CSS variables to handle the circular trajectory cleanly
              transformOrigin: 'center',
              animation: `orbit-ccw ${15 / speedMultiplier}s linear infinite`,
              animationDelay: `-${(15 / innerItems.length) * index}s`,
              left: `calc(50% - 16px)`,
              top: `calc(50% - 16px)`,
              '--orbit-radius': `${innerRadius}px`,
            } as React.CSSProperties}
          >
            {child}
          </div>
        );
      })}

      {/* Outer Track (Rotating Clockwise) */}
      <div 
        className="absolute rounded-full border border-dashed border-border-strong/10"
        style={{ width: `${outerRadius * 2}px`, height: `${outerRadius * 2}px` }}
      />
      {outerItems.map((child, index) => {
        const angle = (360 / outerItems.length) * index;
        return (
          <div
            key={`outer-${index}`}
            className="absolute flex items-center justify-center"
            style={{
              transformOrigin: 'center',
              animation: `orbit-cw ${22 / speedMultiplier}s linear infinite`,
              animationDelay: `-${(22 / outerItems.length) * index}s`,
              left: `calc(50% - 16px)`,
              top: `calc(50% - 16px)`,
              '--orbit-radius': `${outerRadius}px`,
            } as React.CSSProperties}
          >
            {child}
          </div>
        );
      })}

      {/* Embedded inline keyframes for the Orbiting animations */}
      <style>{`
        @keyframes orbit-cw {
          0% {
            transform: rotate(0deg) translateY(calc(-1 * var(--orbit-radius))) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateY(calc(-1 * var(--orbit-radius))) rotate(-360deg);
          }
        }
        @keyframes orbit-ccw {
          0% {
            transform: rotate(360deg) translateY(calc(-1 * var(--orbit-radius))) rotate(-360deg);
          }
          100% {
            transform: rotate(0deg) translateY(calc(-1 * var(--orbit-radius))) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};
