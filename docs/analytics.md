# Privacy-Friendly Analytics Architecture

Veloria Academy implements a custom, privacy-first analytics solution combining Cloudflare Web Analytics (for page views and web vitals) with a custom backend event tracking system for LMS-specific conversion and engagement events.

## Cloudflare Web Analytics
A privacy-first, cookie-free web analytics service provided by Cloudflare. 
- **Setup:** A simple script injected in the React root `main.tsx`.
- **Purpose:** Tracks broad page views, visitors, and performance metrics (Core Web Vitals).
- **Token:** Provided via `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` environment variable.

## Custom Backend Event Tracking
For deeper product analytics (e.g. "Who clicked sign up?", "Which course is most viewed?"), we use a custom solution backed by MongoDB, ensuring no third-party services get our LMS data.

### 1. The `AnalyticsEvent` Model
Defined in `server/src/models/AnalyticsEvent.model.ts`. 
Stores the following schema:
- `eventName`: Must be one of our predefined strings (e.g., `course_card_click`, `login_success`, `signup_click`).
- `anonymousId`: A random unique ID assigned on the frontend (stored in memory/session Storage) to track user flow pre-login without cookies.
- `userId`: (Optional) Bound to the authenticated user ID on the backend if the JWT is present.
- `ipHash`: A strictly hashed version of the IP address (using `ANALYTICS_HASH_SALT` inside the backend only).
- `url`, `userAgent`, `referrer`: Standard request metrics.
- `courseSlug`, `role`: Custom context for specific events.

### 2. Privacy & Security Guarantees
- **No PII:** The frontend utility (`lib/analytics.ts`) is explicitly designed to NEVER accept passwords, emails, contact form message bodies, JWT tokens, etc.
- **Zod Validation:** The backend endpoint strictly validates the event payload using Zod. Any unknown fields are stripped, and unexpected event types are rejected.
- **Fail-Safe Frontend:** All tracking calls use a non-blocking wrapper that catches network errors and fails silently. If the analytics backend goes down or the user uses an ad-blocker, the UI (e.g. Contact Form, Login Form, Course pages) will continue to work perfectly.
- **Rate Limiting:** The backend endpoint is protected by a strict rate limiter (e.g., 30 events per 10 minutes per IP).

### 3. Tracked UI Events
The following events are actively instrumented in the frontend:
- `course_card_click`: When a user clicks a course card on the Courses or Landing pages.
- `enroll_click`: When a user attempts to enroll in a course.
- `signup_click`: Fired on successful registration.
- `login_success`: Fired on successful login.
- `role_selected`: When a user toggles between Student/Instructor on Auth pages.
- `contact_submit_success`: When a user successfully sends a contact form message.
- `certificate_generated`: When a user clicks to view/print their certificate.
- `primary_cta_click`, `secondary_cta_click`: Hero CTA actions.
- `pricing_cta_click`: Tracked on "Join Free", "Upgrade Pro", and "Contact Enterprise" buttons.

### 4. Admin Analytics Dashboard
Admins have access to an aggregated summary endpoint: `GET /api/dashboard/admin/analytics-summary`. This endpoint returns safe aggregated counts (e.g. `totalEvents`, `enrollClicks`) and top viewed courses without exposing individual PII or raw IP addresses.
