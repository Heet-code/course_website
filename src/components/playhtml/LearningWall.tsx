import React, { useState, useEffect } from 'react';
import { usePageData } from '@playhtml/react';
import { Send, EyeOff, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, Button, Input } from '../ui';

interface Message {
  id: string;
  text: string;
  timestamp: number;
}

export const LearningWall: React.FC = () => {
  const channelKey = 'learning-wall-messages';

  const initialMessages: Message[] = [
    { id: 'msg-1', text: 'Consistency beats talent. 1% better every single day! 🚀', timestamp: Date.now() - 3600000 },
    { id: 'msg-2', text: 'Finally understood CSS Flexbox and Grid. Building layout cells now. 💻', timestamp: Date.now() - 1800000 },
    { id: 'msg-3', text: 'Solving algorithms and learning TypeScript patterns. Let\'s grow!', timestamp: Date.now() - 600000 }
  ];

  // Collaborative page data
  const [messages, setMessages] = usePageData<Message[]>(channelKey, initialMessages);

  // Fallback local state in case playhtml is offline
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  // Synchronize local state with playhtml synced messages
  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      setLocalMessages(messages);
    } else {
      const saved = localStorage.getItem('lms-local-wall-messages');
      if (saved) {
        try {
          setLocalMessages(JSON.parse(saved));
        } catch {
          setLocalMessages(initialMessages);
        }
      } else {
        setLocalMessages(initialMessages);
      }
    }
  }, [messages]);

  // Load hidden message IDs from localStorage on mount
  useEffect(() => {
    const savedHidden = localStorage.getItem('lms-hidden-messages');
    if (savedHidden) {
      try {
        setHiddenIds(JSON.parse(savedHidden));
      } catch {
        setHiddenIds([]);
      }
    }
  }, []);

  const handleHideMessage = (id: string) => {
    const updated = [...hiddenIds, id];
    setHiddenIds(updated);
    localStorage.setItem('lms-hidden-messages', JSON.stringify(updated));
  };

  const handleResetHidden = () => {
    setHiddenIds([]);
    localStorage.removeItem('lms-hidden-messages');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    
    if (!trimmed) {
      setError('Message cannot be empty.');
      return;
    }

    if (trimmed.length > 80) {
      setError('Message exceeds 80 characters.');
      return;
    }

    // Strip HTML/scripts to prevent XSS
    const sanitized = trimmed.replace(/<\/?[^>]+(>|$)/g, "");

    const newMsg: Message = {
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      text: sanitized,
      timestamp: Date.now()
    };

    const updated = [newMsg, ...localMessages].slice(0, 15); // Keep list lightweight (last 15 messages)
    setLocalMessages(updated);
    localStorage.setItem('lms-local-wall-messages', JSON.stringify(updated));
    setInputText('');
    setError('');

    try {
      setMessages(updated);
    } catch (err) {
      console.warn('PlayHTML message sync failed. Saved to localStorage fallback.', err);
    }
  };

  // Filter out messages hidden by the current user
  const visibleMessages = localMessages.filter((m) => !hiddenIds.includes(m.id));

  // Human-readable time helper
  const formatTime = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="space-y-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-primary/20 text-[#111827] dark:text-primary border-primary/40">
            Collaborative Wall
          </span>
          <h2 className="text-2xl font-black text-text-main tracking-tight">
            Learning Motivation Wall
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Share a short, anonymous motivation note with your fellow class peers.
          </p>
        </div>

        {hiddenIds.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetHidden}
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            aria-label="Restore all locally hidden messages"
          >
            Show Hidden Messages
          </Button>
        )}
      </div>

      {/* Form Submission */}
      <Card className="bg-surface border border-border p-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-grow w-full">
              <Input
                label="Your Motivation (Anonymous)"
                placeholder="E.g., Keep pushing! React Native is fun. 🚀"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value.length <= 80) setError('');
                }}
                maxLength={85} // Allow typing slightly over to show length error
                error={error}
                aria-describedby="wall-warning"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto h-[44px] flex-shrink-0"
              icon={<Send className="h-4 w-4" />}
            >
              Post Note
            </Button>
          </div>
          <div className="flex justify-between items-center text-[10px] text-text-subtle font-semibold">
            <span id="wall-warning" className="flex items-center gap-1 text-warning">
              <AlertTriangle className="h-3 w-3" />
              Public anonymous wall. Do not share private information.
            </span>
            <span className={inputText.length > 80 ? 'text-danger font-bold' : ''}>
              {inputText.length}/80 chars
            </span>
          </div>
        </form>
      </Card>

      {/* Message Grid */}
      {visibleMessages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-surface border border-border rounded-card p-4 flex flex-col justify-between hover:border-secondary/35 transition-all group relative"
            >
              <p className="text-xs text-text-muted leading-relaxed pr-6 font-medium break-words">
                "{msg.text}"
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/50 text-[10px] text-text-subtle font-semibold">
                <span>{formatTime(msg.timestamp)}</span>
                <button
                  onClick={() => handleHideMessage(msg.id)}
                  className="inline-flex items-center gap-1 p-1 rounded-ctrl hover:bg-surface-muted hover:text-text-main focus:outline-none transition-all outline-none focus-visible:ring-2 focus-visible:ring-secondary cursor-pointer"
                  aria-label={`Hide this message: "${msg.text.substring(0, 20)}..."`}
                  title="Hide this message locally"
                >
                  <EyeOff className="h-3 w-3" />
                  <span>Hide</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center border border-border bg-surface text-text-muted">
          {localMessages.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold">You have hidden all messages on the board.</p>
              <Button size="sm" variant="outline" onClick={handleResetHidden}>
                Restore Hidden Posts
              </Button>
            </div>
          ) : (
            <p className="text-xs font-semibold">No motivation posts yet. Be the first to share one!</p>
          )}
        </Card>
      )}
    </div>
  );
};
