# Crypto E-Commerce Starter Template

A modern, production-ready, zero-secret cryptocurrency e-commerce starter template.

Built with **Next.js 16 (App Router)**, **TypeScript 5**, **Tailwind CSS v4**, **Prisma ORM**, and a decoupled **Python 3.13 Serverless Payment Watcher**.

---

## Key Features

- **Self-Custodial Multi-Chain Payments**: Direct-to-merchant wallet settlements for **Bitcoin (BTC)**, **Litecoin (LTC)**, **Solana (SOL)**, and **USDC** (on Ethereum, Base, Polygon, and Solana).
- **Atomic Collision Avoidance**: Guaranteed unique atomic amount offsets (Satoshis/Wei/Lamports) matching payments without separate wallet derivation.
- **Dynamic Product Schema & Custom Inputs**: Supports standard physical/digital items plus declarative JSON custom input schemas (custom text, selects, file upload slots).
- **Frictionless Guest Checkout**: Instant checkout with cryptographically secure public Tracking Codes (`/track/[code]`).
- **White-Label Reseller Portals**: Dedicated `/r/[slug]` storefronts with wholesale tier volume pricing schedules.
- **Affiliate Referral Engine**: Referral attribution (`?ref=CODE`), partner analytics dashboard, and automated commission tracking.
- **Comprehensive Backoffice Admin Suite**: Live revenue KPIs, order fulfillment & tracking manager, product CRUD, coupon manager, and Payments Hub.
- **Cloudflare R2 / S3 Storage Pipeline**: Direct presigned PUT upload component and authorized presigned GET retrieval for customer uploads.
- **Zero Secrets by Design**: Strict zero-secret architecture with an interactive CLI setup wizard (`npm run setup`).

---

## Quick Start

### 1. Run the Interactive Setup Wizard
```bash
npm run setup
# or: bun run setup
```

### 2. Initialize Database & Starter Catalog
```bash
npm run db:push
npm run db:seed
```

### 3. Launch Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin backoffice.

---

## Documentation

- [SETUP.md](SETUP.md): Step-by-step production deployment guide (Vercel, Neon Postgres, Cloudflare R2, AWS Lambda).
- [ARCHITECTURE.md](ARCHITECTURE.md): Deep-dive system architecture, state machines, and payment flow specifications.
- [CONTEXT.md](CONTEXT.md): Domain glossary and terminology standards.
