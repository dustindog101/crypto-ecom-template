# Setup and Deployment Guide

## 1. Local Development

### Requirements
- Node.js 20+ or Bun 1.1+
- Git

### Steps
1. Clone the repository and install packages:
   ```bash
   git clone https://github.com/dustindog101/crypto-ecom-template.git
   cd crypto-ecom-template
   npm install
   ```

2. Run the setup wizard to generate security keys:
   ```bash
   npm run setup
   ```

3. Create the SQLite database and seed initial test data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Log into the admin dashboard at `http://localhost:3000/admin`:
   - Email: `admin@cryptostore.local`
   - Password: `adminPassword123!`
   - Change your password in production.

---

## 2. Production Deployment (Vercel + Neon Postgres)

### Database Setup
1. Create a free serverless PostgreSQL database on [neon.tech](https://neon.tech).
2. Copy the pooled connection string (`postgres://...`).

### Environment Variables
Set the following environment variables in your Vercel project settings:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Postgres connection string | `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | 32-byte base64 secret for sessions | `openssl rand -base64 32` |
| `PAY_TOKEN_SECRET` | 32-byte hex secret for guest pay sessions | `openssl rand -hex 32` |
| `CRON_SECRET` | Secret token for background sync | `openssl rand -hex 24` |
| `CRYPTO_PAYMENTS_ENABLED` | Toggle crypto payment acceptance | `true` |
| `NEXT_PUBLIC_SITE_NAME` | Name displayed on the storefront | `My Crypto Store` |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain | `https://mycryptostore.com` |

### Deploy Application
1. Push your repository to GitHub.
2. Import the repository into Vercel.
3. In Vercel build settings, make sure the build command is:
   ```bash
   prisma generate && next build
   ```
4. Run the schema migration on the remote database:
   ```bash
   DATABASE_URL="postgres://..." npx prisma db push
   DATABASE_URL="postgres://..." npm run db:seed
   ```

---

## 3. Configuring Deposit Addresses

1. Log into your production admin backoffice at `/admin`.
2. Go to **Payments Hub** (`/admin/payments`).
3. Turn on each asset you want to accept (BTC, LTC, SOL, EVM USDC).
4. Enter your cold or hot wallet deposit address for each asset.
5. Click **Save Gateway Settings**.

---

## 4. Payment Watcher Lambda (Optional for AWS)

If you want background polling outside of client browser visits:
1. Package the watcher:
   ```bash
   ./scripts/deploy-lambdas.sh
   ```
2. Deploy using AWS SAM:
   ```bash
   cd infra
   sam build
   sam deploy --guided
   ```
This provisions a Python 3.13 Lambda function that runs every 2 minutes via EventBridge.
