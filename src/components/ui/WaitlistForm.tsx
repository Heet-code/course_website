import React, { useState } from 'react';
import { Input, Button } from '.';
import { safeRequest } from '../../lib/apiClient';

interface WaitlistFormProps {
  sourcePage?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ sourcePage }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await safeRequest<any>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email, sourcePage }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-success/10 border border-success/20 p-4 rounded-ctrl text-center">
        <p className="text-sm font-bold text-success">Thanks! We’ll notify you when live classes start.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      {error && (
        <div className="p-2 bg-danger/10 border border-danger/20 rounded-ctrl text-xs text-text-main">
          {error}
        </div>
      )}
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Joining...' : 'Join Waitlist'}
      </Button>
    </form>
  );
};
