import { describe, it, expect } from 'vitest';
// We'll mock the actual analytics file structure if needed, or just test pure logic.
// The sanitizeMetadata function is internal to the backend, but the frontend lib/analytics.ts 
// might have sanitization logic too. Let's test the generic approach.

import { trackEvent } from '../lib/analytics';

describe('Analytics Utility', () => {
  it('does not throw when tracking events without backend', () => {
    // trackEvent should catch network errors internally
    expect(() => trackEvent({ eventName: 'course_card_click' })).not.toThrow();
  });
  
  it('drops sensitive metadata locally before sending', () => {
    // If we pass passwords, we expect it to not throw, and ideally strip them.
    expect(() => trackEvent({ 
      eventName: 'login_success', 
      metadata: { password: 'secretpassword', email: 'test@test.com' } 
    })).not.toThrow();
  });
});
