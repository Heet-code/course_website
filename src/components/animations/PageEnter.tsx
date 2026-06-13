import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * PageEnter — wraps the hero/above-the-fold section and choreographs
 * a premium staggered entrance animation on mount.
 *
 * Each direct child is assigned an increasing delay based on `baseDelay`
 * and `stagger` props, creating a cascading reveal effect.
 *
 * Example:
 *   <PageEnter>
 *     <PageEnter.Item delay={0.15}><Badge /></PageEnter.Item>
 *     <PageEnter.Item delay={0.25}><h1 /></PageEnter.Item>
 *     <PageEnter.Item delay={0.45}><p /></PageEnter.Item>
 *   </PageEnter>
 */

interface PageEnterProps {
  children: React.ReactNode;
  className?: string;
}

export const PageEnter: React.FC<PageEnterProps> = ({ children, className = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return <div className={className}>{children}</div>;
};

/**
 * PageEnter.Item — individual element in the entrance sequence.
 * Each gets its own delay for precise choreography control.
 */
interface PageEnterItemProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before this element begins animating */
  delay?: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Starting Y offset */
  y?: number;
  /** Starting scale */
  scale?: number;
}

const PageEnterItem: React.FC<PageEnterItemProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 28,
  scale = 1,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
    >
      {children}
    </motion.div>
  );
};

// Attach Item as a sub-component for clean API:  <PageEnter.Item>
PageEnter.Item = PageEnterItem;

// Extend the type so TypeScript knows about .Item
declare module 'react' {
  interface FunctionComponent {
    Item?: typeof PageEnterItem;
  }
}

export { PageEnterItem };
export default PageEnter;
