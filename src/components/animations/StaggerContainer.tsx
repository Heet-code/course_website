import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * StaggerContainer — animates direct children one by one with staggered delays.
 *
 * Usage:
 *   <StaggerContainer stagger={0.1} delay={0.2}>
 *     <StaggerItem><div>First</div></StaggerItem>
 *     <StaggerItem><div>Second</div></StaggerItem>
 *   </StaggerContainer>
 */

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between each child animation in seconds */
  stagger?: number;
  /** Initial delay before the first child starts */
  delay?: number;
  /** Tag to render as (default: div) */
  as?: keyof React.JSX.IntrinsicElements;
}

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  stagger = 0.1,
  delay = 0,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem — child of StaggerContainer that fades/slides in.
 */
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  /** Override y offset (default 20px) */
  y?: number;
  /** Override duration (default 0.65s) */
  duration?: number;
}

const itemVariants = (y: number, duration: number) => ({
  hidden: {
    opacity: 0,
    y,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo — premium feel
    },
  },
});

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  y = 20,
  duration = 0.65,
}) => {
  return (
    <motion.div className={className} variants={itemVariants(y, duration)}>
      {children}
    </motion.div>
  );
};

export default StaggerContainer;
