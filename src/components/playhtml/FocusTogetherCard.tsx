import React, { useEffect, useState } from 'react';
import { usePresence } from '@playhtml/react';
import { BookOpen } from 'lucide-react';
import { Card } from '../ui';

interface FocusTogetherCardProps {
  courseId: string;
}

interface FocusState {
  status: string;
  emoji: string;
}

export const FocusTogetherCard: React.FC<FocusTogetherCardProps> = ({ courseId }) => {
  const channelKey = `focus-room-${courseId}`;
  
  const { presences, setMyPresence, myIdentity } = usePresence<FocusState>(channelKey);

  const focusOptions: FocusState[] = [
    { status: 'Focusing', emoji: '🧘' },
    { status: 'Reading', emoji: '📚' },
    { status: 'Coding', emoji: '💻' },
    { status: 'Reviewing', emoji: '✍️' }
  ];

  const [activeFocus, setActiveFocus] = useState<FocusState>(focusOptions[0]);

  // Set default presence on mount or when activeFocus changes
  useEffect(() => {
    if (!myIdentity) return;
    try {
      setMyPresence(activeFocus);
    } catch (err) {
      console.warn('PlayHTML Presence error:', err);
    }
  }, [activeFocus, setMyPresence, myIdentity]);

  // Count other learners in the same room
  const otherFocusing: FocusState[] = [];
  if (presences) {
    presences.forEach((view, pid) => {
      // Exclude self based on player identity pid
      if (myIdentity && pid === myIdentity.pid) return;
      if (view.presence && view.presence.status) {
        otherFocusing.push(view.presence);
      }
    });
  }

  const otherCount = otherFocusing.length;

  return (
    <Card className="bg-surface border border-border p-5 text-left space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-secondary" />
          Focus Together
        </h4>
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/15 border border-secondary/30 text-[9px] font-extrabold uppercase text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
          {otherCount + 1} online
        </span>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Set your focus activity to let others know you're studying in this room.
        </p>

        {/* Current User Status Selector */}
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Select focus status">
          {focusOptions.map((opt) => {
            const isSelected = activeFocus.status === opt.status;
            return (
              <button
                key={opt.status}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setActiveFocus(opt)}
                className={`px-3 py-1.5 rounded-ctrl text-xs font-bold transition-all border outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary ${
                  isSelected
                    ? 'bg-secondary text-[#111827] border-secondary'
                    : 'bg-surface-muted text-text-muted border-border hover:text-text-main hover:border-secondary'
                }`}
              >
                <span className="mr-1" aria-hidden="true">{opt.emoji}</span>
                {opt.status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Learners List */}
      <div className="pt-3 border-t border-border/50 space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
          Study Partners Focus
        </span>
        {otherCount > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto no-scrollbar pr-1">
            {otherFocusing.map((learner, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-ctrl bg-surface-muted border border-border text-[10px] font-bold text-text-muted"
                title={`Another student is ${learner.status}`}
              >
                <span className="text-sm" aria-hidden="true">{learner.emoji}</span>
                <span>{learner.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-text-subtle italic">
            You are currently focusing alone in this room. Keep going!
          </p>
        )}
      </div>
    </Card>
  );
};
