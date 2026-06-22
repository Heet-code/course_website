# Veloria Academy Backend

Production-ready, secure, Express + TypeScript + MongoDB backend architecture for **Veloria Academy LMS**.

## Security Standard
- **No Client Secrets:** All private credentials, database URLs, and JWT secrets are kept entirely on the server.
- **Secure Cookie Auth:** Authentication is managed using signed, `httpOnly` secure cookies. No JWT tokens are saved in browser `localStorage`.
- **Role Validation:** Enforces strict role checks upon login (Student, Instructor, Admin) and during API requests.

## Deployment Setup

### 1. Cloudflare Pages (Frontend)
- Build command: `npm run build`
- Output directory: `dist`
- Environment Variables:
  - `VITE_API_URL=/api`

### 2. API Proxy Routing
Configure your Cloudflare routing rule to map `/api/*` to the server host (e.g. `http://your-server-domain/api/*`), keeping cookies locked to the same origin.

### 3. Production Environment Variables
Set the following secrets in your cloud provider environment settings:
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `COOKIE_DOMAIN=your-production-domain.com`

---

## Local Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Seed Demo Accounts
Make sure MongoDB is running locally, then execute:
```bash
npm run seed
```
This will insert the primary categories, mock courses, and the 3 required credentials:
- **Student:** `student@thelearningcollective.com` / `student123`
- **Instructor:** `instructor@thelearningcollective.com` / `instructor123`
- **Admin:** `admin@thelearningcollective.com` / `admin123`

### 3. Run Development Server
```bash
npm run dev
```
The API is available locally at `http://localhost:5000/api`.
