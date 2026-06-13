import React, { useState, useEffect } from 'react';
import { usePageData } from '@playhtml/react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseReactionProps {
  courseId: string;
}

export const CourseReaction: React.FC<CourseReactionProps> = ({ courseId }) => {
  const channelKey = `course-interested-${courseId}`;
  
  // Collaborative state sync
  const [interestCount, setInterestCount] = usePageData<number>(channelKey, 0);
  
  // Local state for tracking toggle status of current user
  const [hasReacted, setHasReacted] = useState<boolean>(false);

  useEffect(() => {
    const reactedState = localStorage.getItem(`lms-reacted-${courseId}`) === 'true';
    setHasReacted(reactedState);
  }, [courseId]);

  const handleReactionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card navigation trigger
    e.preventDefault();

    const nextReacted = !hasReacted;
    setHasReacted(nextReacted);
    localStorage.setItem(`lms-reacted-${courseId}`, String(nextReacted));

    try {
      if (nextReacted) {
        setInterestCount((prev: number) => (prev || 0) + 1);
      } else {
        setInterestCount((prev: number) => Math.max(0, (prev || 0) - 1));
      }
    } catch (err) {
      console.warn('PlayHTML Reaction error:', err);
    }
  };

  // Safe fallback count
  const displayCount = typeof interestCount === 'number' ? interestCount : 0;

  return (
    <button
      onClick={handleReactionClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-ctrl text-xs font-bold transition-all border outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary ${
        hasReacted
          ? 'bg-danger/10 text-danger border-danger/30 font-extrabold scale-[1.03]'
          : 'bg-surface-muted text-text-muted border-border hover:text-text-main hover:border-secondary'
      }`}
      aria-label={`${displayCount} interested. ${hasReacted ? 'Remove interest' : 'Mark as interested'}`}
      title={hasReacted ? 'Remove interest' : 'Mark as interested'}
    >
      <motion.div
        animate={hasReacted ? { scale: [1, 1.45, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        <Heart 
          className={`h-3.5 w-3.5 ${hasReacted ? 'fill-danger stroke-danger' : 'stroke-current'}`} 
          aria-hidden="true"
        />
      </motion.div>
      <span>{displayCount}</span>
    </button>
  );
};
