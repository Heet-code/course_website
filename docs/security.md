# Security Architecture

## Authentication & Sessions
The Learning Collective utilizes a stateless backend utilizing JWT tokens stored securely inside `httpOnly` HTTP cookies. 
No session secrets, database credentials, or API keys are ever stored in frontend logic or `localStorage`.

### Cookie SameSite Limitation
Currently, the frontend is deployed on Cloudflare Pages (`.workers.dev`) and the backend API is deployed on Render (`.onrender.com`). Because these are different root domains, they are treated as **Cross-Site**.
Therefore, production cookies must be set to `sameSite: "none"` and `secure: true`.

**Future Recommendation:** Once a custom domain is configured (e.g. `www.thelearningcollective.com` and `api.thelearningcollective.com`), update the cookie settings in `token.service.ts` to `sameSite: "lax"`.

## Cross-Origin Resource Sharing (CORS)
CORS is strictly locked down. The backend only accepts API requests from:
1. `https://course-website-pages.kalthiyaheet.workers.dev`
2. `https://www.thelearningcollective.com` (Future placeholder)
3. `http://localhost:5173` (Development only)

Wildcard origins `*` with credentials are explicitly forbidden.

## Environment Variables
The application strictly enforces separation of concerns through `zod` validation on boot.

**Frontend Only (Public):**
- `VITE_API_URL`
- `VITE_TURNSTILE_SITE_KEY`
- `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN`

**Backend Only (Secret):**
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `ANALYTICS_HASH_SALT`

## Rate Limiting
To prevent abuse, denial-of-service, and enumeration attacks, strict rate limits apply:
- **Login/Register:** 10 attempts per 15 minutes per IP.
- **Forgot Password:** 3 attempts per hour per IP.
- **Contact Form:** 5 attempts per hour per IP.
- **Analytics:** 100 requests per 5 minutes per IP.

## Cloudflare Turnstile
CAPTCHA is required for Authentication and Contact submission routes.
- **Production:** A valid Turnstile Token is strictly required. Without it, the backend will reject the request.
- **Development:** Turnstile can be bypassed safely by setting `TURNSTILE_BYPASS=true`. If this is accidentally set in production, the server will immediately crash on boot to prevent vulnerability.

## Content Security Policy (CSP)
A minimal, safe CSP has been configured using Helmet. It restricts `script-src` and `frame-src` strictly to internal origins and Cloudflare's verified endpoints.

## Secret Scanning
A full automated scan was performed ensuring no hardcoded strings, API keys, or JWT tokens exist in the Git tree, `.env.production`, or frontend bundles.
