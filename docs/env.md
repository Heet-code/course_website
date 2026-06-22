# Environment Variables Configuration Guide

Veloria Academy relies on strict segregation between public frontend variables and secret backend variables.

## Cloudflare Pages (Frontend)
These variables are baked into the static React bundle. They are **safe** to be public.

Go to **Cloudflare Dashboard -> Pages -> Settings -> Environment Variables**:
1. `VITE_API_URL` = `https://<your-render-app>.onrender.com/api` (Ensure no trailing slash)
2. `VITE_TURNSTILE_SITE_KEY` = `your_public_site_key` (Generated from Cloudflare Turnstile)
3. `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` = `your_analytics_token` (Optional)

## Render (Backend API)
These variables hold the cryptographic secrets and database credentials. **Never commit them.**

Go to **Render Dashboard -> Web Service -> Environment**:
1. `NODE_ENV` = `production`
2. `CLIENT_URL` = `https://course-website-pages.kalthiyaheet.workers.dev` (The public frontend URL)
3. `MONGO_URI` = `mongodb+srv://...` (Your MongoDB Atlas connection string)
4. `JWT_ACCESS_SECRET` = `random_secure_string_at_least_32_chars`
5. `JWT_REFRESH_SECRET` = `random_secure_string_at_least_32_chars`
6. `COOKIE_SECRET` = `random_secure_string_at_least_32_chars`
7. `JWT_ACCESS_EXPIRES_IN` = `15m`
8. `JWT_REFRESH_EXPIRES_IN` = `7d`
9. `RESEND_API_KEY` = `re_...`
10. `CONTACT_RECEIVER_EMAIL` = `your.email@example.com`
11. `TURNSTILE_SECRET_KEY` = `your_secret_turnstile_key`
12. `ANALYTICS_HASH_SALT` = `random_secure_string_at_least_32_chars`

**Important Note on TURNSTILE_BYPASS:**
If you define `TURNSTILE_BYPASS=true` inside Render, the backend will **crash on startup**. It is mathematically impossible to accidentally bypass Turnstile in production.

**Important Note on COOKIE_DOMAIN:**
Because you are using two different root domains (`.workers.dev` and `.onrender.com`), do **not** set a `COOKIE_DOMAIN`. The application uses cross-site cookies securely. Once you migrate to a custom domain, you can configure it.
