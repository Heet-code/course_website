import React, { useEffect } from 'react';
import { usePresence } from '@playhtml/react';
import { Users } from 'lucide-react';
import { Card } from '../ui';

export const LiveLearnersCard: React.FC = () => {
  // Safe, anonymous global presence tracking for online visitors
  const { presences, setMyPresence, myIdentity } = usePresence('lms-global-presence');

  useEffect(() => {
    if (!myIdentity) return;
    // Notify the room of our active viewing state anonymously
    try {
      setMyPresence({ viewing: true, timestamp: Date.now() });
    } catch (err) {
      console.warn('PlayHTML Presence error:', err);
    }
  }, [setMyPresence, myIdentity]);

  // Fallback to local count if connection is offline
  const activeCount = presences && presences.size > 0 ? presences.size : 1;

  return (
    <Card 
      className="bg-surface border border-border text-left relative overflow-hidden flex flex-col justify-between h-full p-6"
    >
      <div 
        className="space-y-4"
        role="status" 
        aria-live="polite"
        aria-label={`${activeCount} learners active on platform`}
      >
        <div className="flex items-center justify-between">
          <div className="p-3 bg-secondary/10 text-secondary rounded-card" aria-hidden="true">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 border border-success/30 text-[10px] font-extrabold uppercase text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Live Presence
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
            Exploring Courses Now
          </span>
          <h4 className="text-2xl font-black text-text-main leading-none">
            {activeCount} {activeCount === 1 ? 'Learner' : 'Learners'} Active
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Collaborative learning is happening. Join other developers building projects in real-time.
          </p>
        </div>
      </div>
    </Card>
  );
};
