import React from 'react';
import { usePageData } from '@playhtml/react';
import { Card } from '../ui';

interface CoursePulseProps {
  courseId: string;
}

export const CoursePulse: React.FC<CoursePulseProps> = ({ courseId }) => {
  const channelKey = `class-pulse-${courseId}`;
  
  // Default values to show on first load/offline
  const defaultPulse = {
    fire: 12,
    idea: 8,
    rocket: 15,
    check: 24
  };

  const [pulse, setPulse] = usePageData<Record<string, number>>(channelKey, defaultPulse);

  const handlePulseClick = (emojiKey: string) => {
    try {
      setPulse((prev) => {
        const current = prev || defaultPulse;
        return {
          ...current,
          [emojiKey]: (current[emojiKey] || 0) + 1
        };
      });
    } catch (err) {
      console.warn('PlayHTML Pulse error:', err);
    }
  };

  const counts = {
    fire: pulse?.fire ?? defaultPulse.fire,
    idea: pulse?.idea ?? defaultPulse.idea,
    rocket: pulse?.rocket ?? defaultPulse.rocket,
    check: pulse?.check ?? defaultPulse.check
  };

  const reactionButtons = [
    { key: 'fire', emoji: '🔥', label: 'Curriculum is hot (fire)', count: counts.fire },
    { key: 'idea', emoji: '💡', label: 'Provides great ideas (lightbulb)', count: counts.idea },
    { key: 'rocket', emoji: '🚀', label: 'Fast-paced and career boosting (rocket)', count: counts.rocket },
    { key: 'check', emoji: '✅', label: 'Clear syllabus matches expectations (checkmark)', count: counts.check }
  ];

  return (
    <Card className="bg-surface border border-border p-5 text-left space-y-4">
      <div>
        <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">
          Class Pulse
        </h4>
        <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
          How do other students feel about this course? React anonymously to share your vibe.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-2">
        {reactionButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handlePulseClick(btn.key)}
            className="flex items-center justify-between p-2.5 rounded-ctrl bg-surface-muted border border-border text-xs font-semibold hover:border-secondary hover:bg-[#222631] dark:hover:bg-[#222631] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary outline-none"
            aria-label={`${btn.label}. Current reaction count is ${btn.count}`}
          >
            <span className="text-base" aria-hidden="true">{btn.emoji}</span>
            <span className="text-text-main font-bold">{btn.count}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};
