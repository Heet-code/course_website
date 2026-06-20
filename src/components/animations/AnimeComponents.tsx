import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

// ============================================================================
// 1. ORGANIC SVG PATH MORPH Component
// ============================================================================
interface AnimeBlobMorphProps {
  className?: string;
  fill?: string;
  duration?: number;
}

export const AnimeBlobMorph: React.FC<AnimeBlobMorphProps> = ({
  className = '',
  fill = 'url(#watermelon-gradient)',
  duration = 8000
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  // Four coordinate-matched vector configurations (identical node syntax for smooth morphing)
  const path1 = "M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z";
  const path2 = "M50,16 C76,12 86,24 96,44 C106,64 78,82 54,88 C30,94 14,76 8,56 C2,36 24,20 50,16 Z";
  const path3 = "M50,8 C64,22 96,16 91,48 C86,80 74,78 47,90 C20,102 14,74 17,48 C20,22 36,-6 50,8 Z";
  const path4 = "M50,12 C82,6 78,32 90,54 C102,76 68,84 46,86 C24,88 6,76 10,48 C14,20 18,18 50,12 Z";

  useEffect(() => {
    if (!pathRef.current) return;

    const animation = animate(pathRef.current, {
      d: [
        { value: path2, duration: duration / 4 },
        { value: path3, duration: duration / 4 },
        { value: path4, duration: duration / 4 },
        { value: path1, duration: duration / 4 }
      ],
      ease: 'inOutSine',
      loop: true,
      alternate: true,
      autoplay: true
    });

    return () => animation.pause();
  }, [duration]);

  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`w-full h-full select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="watermelon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-secondary)" />
        </linearGradient>
      </defs>
      <path ref={pathRef} d={path1} fill={fill} />
    </svg>
  );
};

// ============================================================================
// 2. GRID STAGGER REVEAL Component (staggers elements from grid center on viewport entry)
// ============================================================================
interface AnimeStaggerGridProps {
  children: React.ReactNode[];
  columns?: number; // Estimated grid columns for stagger direction calculations
  className?: string;
  delay?: number;
}

export const AnimeStaggerGrid: React.FC<AnimeStaggerGridProps> = ({
  children,
  columns = 3,
  className = '',
  delay = 100
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Run entry stagger animation using Anime.js v4 animate
    const animation = animate(containerRef.current.querySelectorAll('.stagger-item'), {
      opacity: [0, 1],
      scale: [0.93, 1],
      translateY: [24, 0],
      delay: stagger(80, { 
        start: delay 
      }),
      duration: 800,
      ease: 'outQuart'
    });

    return () => animation.pause();
  }, [delay, children.length]);

  return (
    <div 
      ref={containerRef} 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}
    >
      {React.Children.map(children, (child, idx) => (
        <div key={idx} className="stagger-item opacity-0 transform-gpu">
          {child}
        </div>
      ))}
    </div>
  );
};
