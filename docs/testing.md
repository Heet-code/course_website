# Testing Infrastructure

Veloria Academy uses a modern, CI-ready testing infrastructure ensuring application stability across units, components, and End-to-End user flows.

## 1. Running Unit Tests (Vitest)
Unit and Component tests run via Vitest, ensuring our baseline React components (Buttons, Inputs, Contexts, Sanitizers) render correctly and manage state as expected.

**Commands:**
- Run tests: `npm run test`
- Run in watch mode (ideal for development): `npm run test:watch`

## 2. Running E2E Tests (Playwright)
Playwright spins up real browser engines (Chromium, Firefox, WebKit) to test user flows from start to finish.

**Commands (Local Testing):**
- Install browser binaries (first time only): `npx playwright install`
- Run headless E2E tests: `npm run test:e2e`
- Run E2E tests with UI runner: `npm run test:e2e:ui`
- Run specific accessibility suite: `npm run test:accessibility`

### Testing Against Production
You can point Playwright at the deployed Cloudflare Pages URL by overriding the `E2E_BASE_URL` environment variable.

**Safe Production Test:**
```bash
E2E_BASE_URL=https://course-website-pages.kalthiyaheet.workers.dev npm run test:e2e
```

**Testing the Contact Form Submission on Production:**
By default, the contact test skips the final submission step against production to prevent spamming the receiver inbox. You can force the submission by supplying `E2E_ALLOW_CONTACT_SUBMIT`.
```bash
E2E_BASE_URL=https://course-website-pages.kalthiyaheet.workers.dev E2E_ALLOW_CONTACT_SUBMIT=true npm run test:e2e
```

## 3. Safety Rules and CI Protocols
- **No Private Data Logging:** Passwords, API Tokens, and JWTs are strictly omitted from `console.log` statements and test reporter traces.
- **Destructive Testing Mitigation:** E2E tests do not run destructive modifications (e.g. deleting users) against production databases.
- **Safe Test Payloads:** Real forms submitted during automated QA runs will use clearly identifiable payloads: *"Automated QA test message. Please ignore."*
- **Mock Overrides:** Analytics and non-critical trackers are either suppressed or fail gracefully during test runs.

## 4. Future Backend Testing Strategy
Currently, our backend Express controllers rely heavily on MongoDB connections, Resend API configurations, and Turnstile verifications. To test this thoroughly in a CI pipeline without exposing production data, we will implement the following in a future phase:

1. **Test Database Configuration:** Spin up a volatile MongoDB Memory Server or a dedicated test database before running `npm run test:backend`.
2. **Service Mocking:** 
   - Mock the `Resend` Node module so emails are asserted to be created (e.g., `expect(resend.emails.send).toHaveBeenCalled()`) without actually hitting the network.
   - Mock the `verifyTurnstile` HTTP request to always return `true` during CI runs.
3. **Endpoint Isolation Tests (Supertest):** Use the `supertest` library to assert the Express routing layers:
   - Validate Auth Middleware (asserting 401s on unauthenticated requests).
   - Validate Role Authorization (asserting 403s on mismatched roles).
   - Validate Contact API Schema parsing (asserting 400s on bad payload structures).
   - Validate Analytics Endpoint (ensuring generic 200 responses and proper Zod error silencing).
