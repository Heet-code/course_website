type EventName = 
  | 'page_view_manual'
  | 'course_card_click'
  | 'course_detail_view'
  | 'enroll_click'
  | 'pricing_cta_click'
  | 'signup_click'
  | 'login_success'
  | 'login_role_selected'
  | 'contact_submit_success'
  | 'newsletter_submit_success'
  | 'certificate_generate_click';

interface TrackPayload {
  sourcePage?: string;
  courseSlug?: string;
  role?: string;
  metadata?: Record<string, any>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const trackEvent = (eventName: EventName, payload?: TrackPayload) => {
  // Fire-and-forget, non-blocking execution
  try {
    let anonymousId = localStorage.getItem('tlc_anon_id');
    if (!anonymousId) {
      anonymousId = crypto.randomUUID();
      localStorage.setItem('tlc_anon_id', anonymousId);
    }

    const body = {
      eventName,
      sourcePage: payload?.sourcePage || window.location.pathname,
      courseSlug: payload?.courseSlug,
      role: payload?.role,
      metadata: payload?.metadata,
      anonymousId
    };

    fetch(`${API_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    }).catch(err => {
      // Only warn in development, fail silently in production
      if (import.meta.env.DEV) {
        console.warn('[Analytics Failed]', err);
      }
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[Analytics Error]', err);
    }
  }
};

// Convenience Methods
export const trackCourseClick = (courseSlug: string) => trackEvent('course_card_click', { courseSlug });
export const trackCourseDetailView = (courseSlug: string) => trackEvent('course_detail_view', { courseSlug });
export const trackEnrollClick = (courseSlug: string) => trackEvent('enroll_click', { courseSlug });
export const trackPricingCtaClick = (planName: string) => trackEvent('pricing_cta_click', { metadata: { plan: planName } });
export const trackSignupClick = (role?: string) => trackEvent('signup_click', { role });
export const trackContactSuccess = () => trackEvent('contact_submit_success');
export const trackNewsletterSuccess = () => trackEvent('newsletter_submit_success');
export const trackLoginSuccess = (role: string) => trackEvent('login_success', { role });
export const trackRoleSelected = (role: string) => trackEvent('login_role_selected', { role });
export const trackCertificateGenerate = (courseSlug: string) => trackEvent('certificate_generate_click', { courseSlug });
