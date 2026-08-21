# Deployment & Setup Guide

## Local Development Setup

1. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd crypto-ecom-template
   npm install # or bun install
   ```

2. **Configure Environment**:
   ```bash
   npm run setup
   ```

3. **Initialize Database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## Production Deployment (Vercel + Neon Postgres)

1. **Create Neon Database**:
   - Create a free PostgreSQL database on [neon.tech](https://neon.tech).
   - Copy the PostgreSQL connection string.

2. **Set Vercel Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `AUTH_SECRET`: Generate via `openssl rand -base64 32`.
   - `PAY_TOKEN_SECRET`: Generate via `openssl rand -hex 32`.
   - `CRON_SECRET`: Generate via `openssl rand -hex 24`.
   - `CRYPTO_PAYMENTS_ENABLED`: `true`.

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Configure Merchant Wallets**:
   - Log into `/admin/payments`.
   - Toggle desired cryptocurrency networks and enter your cold/hot wallet deposit addresses.
