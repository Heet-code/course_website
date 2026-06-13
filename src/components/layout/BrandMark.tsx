import React from 'react';
import logoImg from '../../assets/logo.png';

interface BrandMarkProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const BrandMark: React.FC<BrandMarkProps> = ({ 
  variant = 'light', 
  compact = false,
  layout = 'horizontal'
}) => {
  const isDark = variant === 'dark';
  const isVertical = layout === 'vertical';
  
  return (
    <div className={`flex items-center gap-[14px] ${isVertical ? 'flex-col text-center' : ''}`}>
      {/* Original Logo Image */}
      <img 
        src={logoImg} 
        alt="The Learning Collective logo" 
        className={`${
          isVertical 
            ? 'h-[72px] sm:h-[96px]' 
            : 'h-[38px] md:h-[48px]'
        } w-auto object-contain flex-shrink-0 select-none`}
      />
      
      {/* Brand Text */}
      {!compact && (
        <span 
          className={`font-[800] text-[20px] md:text-[24px] tracking-[-0.03em] leading-none select-none transition-colors opacity-100 ${
            isDark ? 'text-[#F8FAFC]' : 'text-[#111827]'
          } ${isVertical ? 'block text-center mt-2' : ''}`}
          style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            opacity: 1,
            color: isDark ? '#F8FAFC' : '#111827'
          }}
        >
          {isVertical ? (
            <span>The Learning Collective</span>
          ) : (
            <>
              <span className="hidden min-[380px]:inline">The Learning Collective</span>
              <span className="inline min-[380px]:hidden">TLC</span>
            </>
          )}
        </span>
      )}
    </div>
  );
};
