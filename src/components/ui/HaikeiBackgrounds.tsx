import React from 'react';

/**
 * Technical dotted grid pattern overlay (like Haikei's grids/dot coordinates)
 */
export const HaikeiGridPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] ${className}`} aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="haikei-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#haikei-grid)" />
      </svg>
    </div>
  );
};

/**
 * Multi-layered fluid waves used as transitions between landing page sections
 */
export const HaikeiWaves: React.FC<{ 
  variant?: 'top' | 'bottom'; 
  className?: string 
}> = ({ variant = 'bottom', className = '' }) => {
  const isTop = variant === 'top';
  
  return (
    <div className={`w-full relative pointer-events-none ${isTop ? '-mb-px' : '-mt-px'} ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto ${isTop ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
            <stop offset="50%" stopColor="var(--color-secondary)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {/* Layer 1 */}
        <path
          d="M0,96 C240,128 480,32 720,80 C960,128 1200,64 1440,112 L1440,200 L0,200 Z"
          fill="url(#wave-gradient-1)"
        />
        {/* Layer 2 (Slightly offset and higher opacity) */}
        <path
          d="M0,128 C360,64 720,160 1080,96 C1260,64 1350,128 1440,144 L1440,200 L0,200 Z"
          fill="url(#wave-gradient-2)"
        />
      </svg>
    </div>
  );
};

/**
 * Organic glowing mesh blobs positioned in the background to create high-premium lighting effects (Watermelon theme glows)
 */
export const HaikeiBlobGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-20 ${className}`} aria-hidden="true">
      {/* Glow Pink Blob */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-primary/10 blur-[100px] sm:blur-[130px] animate-pulse duration-6000" />
      
      {/* Glow Green Blob */}
      <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-secondary/8 blur-[100px] sm:blur-[130px] animate-pulse duration-[8000ms]" />
      
      {/* Decorative Blob Outline Shape */}
      <svg 
        className="absolute top-[20%] right-[10%] w-[200px] sm:w-[350px] h-auto opacity-10 text-primary dark:text-primary/20 animate-spin-slow" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M25,-30 C45,-25 55,-10 60,10 C65,30 55,45 35,55 C15,65,-5,60,-20,50 C-35,40,-45,25,-48,5 C-51,-15,-40,-35,-25,-40 C-10,-45,5,-35,25,-30 Z" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          transform="translate(50,50)" 
        />
      </svg>
      
      {/* Another Blob Outline */}
      <svg 
        className="absolute bottom-[10%] left-[10%] w-[180px] sm:w-[280px] h-auto opacity-10 text-secondary dark:text-secondary/20 animate-bounce-slow" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M38,-28 C45,-18 43,1 36,19 C29,37,17,55,-1,56 C-19,57,-39,41,-47,22 C-55,3,-51,-19,-41,-31 C-31,-43,-16,-45,1,-44 C18,-43,31,-38,38,-28 Z" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          transform="translate(50,50)" 
        />
      </svg>
    </div>
  );
};
