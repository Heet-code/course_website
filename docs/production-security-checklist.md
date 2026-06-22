# Production Security Checklist

Before launching Veloria Academy, strictly verify the following configurations across your hosting providers.

## 1. Render (Backend API)
Ensure your Render Web Service environment variables strictly match the following. **Do not commit these to source control.**

- [ ] `NODE_ENV=production`
- [ ] `CLIENT_URL=https://course-website-pages.kalthiyaheet.workers.dev`
- [ ] `MONGO_URI` (Production Atlas Connection String)
- [ ] `JWT_ACCESS_SECRET` (Min 32 characters, Cryptographically secure)
- [ ] `JWT_REFRESH_SECRET` (Min 32 characters, Cryptographically secure)
- [ ] `COOKIE_SECRET` (Min 32 characters)
- [ ] `RESEND_API_KEY` (Your Resend API Key)
- [ ] `CONTACT_RECEIVER_EMAIL` (Where contact forms should be delivered)
- [ ] `TURNSTILE_SECRET_KEY` (From Cloudflare Dashboard)
- [ ] `ANALYTICS_HASH_SALT` (Cryptographically secure random string used to anonymize IPs)
- [ ] `TURNSTILE_BYPASS` must be absent or explicitly `false`.

## 2. Cloudflare Pages (Frontend UI)
Ensure the Pages project environment variables are set. These are publicly visible to anyone who inspects the frontend bundle.

- [ ] `VITE_API_URL=https://<your-render-url>.onrender.com/api`
- [ ] `VITE_TURNSTILE_SITE_KEY` (Public Site Key)
- [ ] `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN`

## 3. Cloudflare Infrastructure
- [ ] **HTTPS:** Strictly enforced (Always Use HTTPS).
- [ ] **Turnstile Hostname:** Ensure `course-website-pages.kalthiyaheet.workers.dev` (and your future custom domain) are whitelisted inside the Turnstile widget settings.
- [ ] **Web Analytics:** Active and configured.

## 4. MongoDB Atlas (Database)
- [ ] **Network Access:** Restrict IP access to Render's outbound IPs if possible, or `0.0.0.0/0` if strictly necessary but ensure the password is cryptographically random.
- [ ] **Database User:** Create a specific application user (e.g. `tlc-app`). Do NOT use your root Atlas credentials in the `MONGO_URI`.
- [ ] **Backups:** Ensure automated daily backups are enabled in Atlas.
