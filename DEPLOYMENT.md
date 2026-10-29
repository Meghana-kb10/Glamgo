# Glamgo Haute Beauté - Production Deployment Guide

This guide details all production deployment targets for Glamgo, from 1-click cloud platforms to full-stack containerized deployments.

---

## Architecture Overview

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Vite (Compiled into `dist/`)
- **Backend Core API**: Node.js, Express, PostgreSQL with PostGIS, Redis distributed locks, SSE event streaming
- **Database**: PostgreSQL 16+ (or Supabase / Neon / AWS RDS)
- **Cache & Locks**: Redis 7+ (or Upstash / Redis Cloud)

---

## 1. Option A: Vercel (Fastest Frontend Deployment)

### Method 1: Using the Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New Project"** and import `Meghana-kb10/Glamgo`.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add Environment Variables:
   - `VITE_API_BASE_URL`: URL of your deployed Express backend (or `/api/v1` if using a proxy rewrite).
5. Click **Deploy**. Vercel will automatically build and publish your site with global edge caching and instant SSL.

### Method 2: Deploying via Vercel CLI
```bash
# Login to Vercel
npx vercel login

# Link and deploy to production
npx vercel --prod
```

---

## 2. Option B: Render (Full-Stack Blueprint with Postgres & Redis)

Glamgo includes a complete Infrastructure-as-Code `render.yaml` blueprint.

1. Go to [render.com](https://render.com) and connect your GitHub repository `Meghana-kb10/Glamgo`.
2. Click **"New +"** → **"Blueprint"**.
3. Point to `render.yaml`. Render will automatically provision:
   - **`glamgo-web`**: Node.js web service running the Express API and serving the React frontend
   - **`glamgo-postgres`**: Managed PostgreSQL database
   - **`glamgo-redis`**: Managed Redis cache and slot lock manager
4. Click **Apply**. Render will automatically build the client and start the server at `https://glamgo-web.onrender.com`.

---

## 3. Option C: Railway (Full-Stack 1-Click)

1. Go to [railway.app](https://railway.app).
2. Click **"New Project"** → **"Deploy from GitHub repo"** → Select `Meghana-kb10/Glamgo`.
3. Add a **PostgreSQL** service and a **Redis** service from the Railway dashboard.
4. Set the following variables in Railway for the Glamgo service:
   - `PORT`: `4000`
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `REDIS_URL`: `${{Redis.REDIS_URL}}`
   - `JWT_SECRET`: Random 64-character secret
5. Railway reads `railway.json` and `Procfile`, builds the Vite frontend, and runs the backend automatically.

---

## 4. Option D: Docker & Docker Compose (Self-Hosted VPS / AWS EC2 / DigitalOcean)

Glamgo includes a multi-stage production Dockerfile and a production Compose file (`docker-compose.prod.yml`).

### Steps:
1. Clone the repository on your server:
   ```bash
   git clone https://github.com/Meghana-kb10/Glamgo.git
   cd Glamgo
   ```
2. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   # Edit with your production secrets
   nano .env
   ```
3. Build and launch all containers:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
4. Verify container status:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   docker compose -f docker-compose.prod.yml logs -f glamgo_app
   ```
5. Test the healthcheck endpoint:
   ```bash
   curl http://localhost:4000/api/v1/health
   ```

---

## 5. Environment Variables Reference

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment mode | `production` |
| `PORT` | Server listening port | `4000` (or assigned by host) |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://default:pass@host:6379` |
| `JWT_SECRET` | Secret key for customer/pro authentication | Random 64-char string |
| `VITE_API_BASE_URL` | Frontend API endpoint path | `/api/v1` or `https://api.glamgo.in/api/v1` |
| `CORS_ORIGIN` | Allowed domains for API access | `https://glamgo.in,https://glamgo.vercel.app` |

---

## 6. GitHub Actions CI/CD Pipeline

The included `.github/workflows/deploy.yml` automatically triggers on every push to `master`. It checks out your code, installs dependencies, verifies TypeScript types, runs a production build, and archives the distribution bundle.
