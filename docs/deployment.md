# Production Deployment Guide

This guide details the final manual steps required to deploy and verify **The Learning Collective** on Cloudflare Pages, Render, and MongoDB Atlas.

## 1. MongoDB Atlas Setup
- Create an organization and deploy a free-tier cluster.
- **Network Access:** Allow access from anywhere (`0.0.0.0/0`) since Render's IPs can change dynamically, but ensure your password is cryptographically strong.
- **Database Access:** Create a new user specifically for this app (e.g., `tlc-app`). **Do not use the admin user**.
- Copy the connection string. Replace `<username>` and `<password>` with your specific app user.

## 2. Render Setup (Backend API)
- Create a new **Web Service**.
- Connect your GitHub repository.
- **Root Directory:** `server`
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`
- Inject the environment variables documented in `docs/env.md`.

## 3. Cloudflare Pages Setup (Frontend UI)
- Go to Cloudflare -> Pages -> Create a Project.
- Connect your GitHub repository.
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- Inject the environment variables documented in `docs/env.md`.

## 4. Third-Party Integrations
- **Resend:** Ensure `RESEND_API_KEY` is placed in Render. Note that if your domain is unverified in Resend, emails will only send to your explicitly verified test email address (or a generic sender address). Add a TODO to verify a custom domain later.
- **Turnstile:** Ensure your frontend URL (`course-website-pages.kalthiyaheet.workers.dev`) is whitelisted in the Cloudflare Turnstile dashboard.

## 5. Security & Cross-Site Considerations
- Because the backend is on `.onrender.com` and frontend is on `.workers.dev`, the application issues cross-site cookies.
- Production cookies are forcefully set to `sameSite: "none"` and `secure: true`.
- **CORS** explicitly allows your Cloudflare Pages domain and rejects wildcards.

---

## 6. Live Smoke Testing Checklist
Once deployed, manually verify the following against the **Live Production URLs**.

### Public Pages
- [ ] `/` homepage loads
- [ ] `/courses` loads
- [ ] `/pricing` loads
- [ ] `/about` loads
- [ ] `/contact` loads
- [ ] `/faq` loads
- [ ] `/login` loads
- [ ] `/signup` loads

### Authentication
- [ ] Student login works
- [ ] Instructor login works
- [ ] Admin login works
- [ ] Logout clears session successfully
- [ ] Forgot password requests succeed
- [ ] Reset password executes via link successfully

### LMS Capabilities
- [ ] Course details open
- [ ] Enroll button works
- [ ] Dashboard loads user's enrolled courses
- [ ] Progress tracking saves appropriately
- [ ] Certificate route works

### Forms & Notifications
- [ ] Contact form invalid emails are blocked
- [ ] Contact form valid submission succeeds
- [ ] MongoDB `ContactMessage` is saved
- [ ] Notification email arrives from Resend

### SEO & Web Vitals
- [ ] `/robots.txt` is accessible
- [ ] `/sitemap.xml` is accessible
- [ ] Route titles correctly update via `react-helmet-async`

### Analytics
- [ ] Clicking a course triggers an analytics capture
- [ ] Admin dashboard analytics summary loads
- [ ] No Personally Identifiable Information (PII) is visible in the raw database analytics payload

### Security Guardrails
- [ ] A student account cannot access `/api/admin/*`
- [ ] Requests originating from a fake origin are rejected by CORS
- [ ] No `.env` secrets exist inside the browser DevTools bundle
- [ ] Intentionally triggering a 500 error does NOT output a backend stack trace

---

## 7. Audit & Validation Commands
Before pushing any code, run these safe validation commands locally.

### Frontend
```bash
npm run build
npm run test
```

### End-to-End Tests (Safe Production)
```bash
npx cross-env E2E_BASE_URL=https://course-website-pages.kalthiyaheet.workers.dev npm run test:e2e
```

### Backend
```bash
cd server
npm run build
```

### Dependency Audit
```bash
npm audit
cd server && npm audit
```
