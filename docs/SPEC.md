# Technical Specification: Generic Crypto E-Commerce Platform Template

## Problem Statement

Entrepreneurs, developers, and privacy-centric merchants who want to launch a full-featured cryptocurrency e-commerce store currently face fragmented options. Existing off-the-shelf solutions (Shopify, WooCommerce) rely heavily on custodial payment processors with high fees, chargeback risks, KYC restrictions, and strict platform lock-in. Meanwhile, custom self-custodial e-commerce platforms (like ID Pirate and Phase Research) contain deeply hardcoded domain logic, proprietary branding, hardcoded product attributes, or hardcoded secrets. 

There is no modern, zero-secret, production-ready e-commerce starter template that unifies:
1. Frictionless guest crypto checkout with atomic collision prevention and non-custodial multi-chain settlement.
2. A declarative dynamic product catalog schema supporting both standard and custom products (with file uploads).
3. Built-in white-label reseller portals (`/r/[slug]`) with wholesale tiers.
4. Multi-tier affiliate referral tracking and commissions.
5. A comprehensive backoffice Admin Dashboard (Orders, Products CRUD, Coupons, Payments Ledger, User Management).
6. 100% parameterizable configuration with an automated terminal setup CLI and zero secret leaks.

## Solution

A modular, enterprise-grade Next.js 16 (App Router) + TypeScript + Serverless Python Lambda template with Prisma ORM (SQLite for local zero-cloud dev, PostgreSQL/Neon for production), Cloudflare R2 / S3 storage integration, and an EventBridge-driven multi-chain blockchain payment watcher.

The template ships with complete clean abstractions, zero hardcoded branding, full theme customizability via Tailwind CSS v4 design tokens, and an interactive `npm run setup` wizard that generates cryptographic secrets and configures initial store parameters.

---

## User Stories

### Customer & Storefront
1. As a Customer, I want to browse products in a clean catalog with category filters and search, so that I can quickly find what I want to buy.
2. As a Customer, I want to select product variants (e.g. sizes, package quantities, options) and see the price update immediately, so that I understand what I am purchasing.
3. As a Customer, I want to fill in custom product input fields (text, selections, file/image uploads) for bespoke products, so that my customized order details are securely attached.
4. As a Customer, I want to add multiple items to a slide-out cart drawer, modify quantities, and enter promo codes, so that I can review my final total before checkout.
5. As a Customer, I want to check out as a guest without creating an account or providing invasive personal data, so that my purchase remains private and fast.
6. As a Customer, I want to choose my preferred cryptocurrency payment rail (BTC, LTC, SOL, ETH, USDC on Ethereum/Base/Polygon/Solana) and view an exact locked exchange rate and unique deposit amount.
7. As a Customer, I want to scan a QR code or copy the deposit address and exact atomic amount into my crypto wallet, so that I can send payment accurately.
8. As a Customer, I want to see real-time payment confirmation status with an animated progress countdown without having to refresh the page, so that I know when my payment is detected and confirmed on-chain.
9. As a Customer, I want to track my order status anytime using a secure public Tracking Code (`/track/[trackingCode]`), so that I can monitor fulfillment and delivery progress.
10. As a Customer, I want to optionally create/claim an account after checkout with 1-click, so that I can save my address and view order history for future purchases.

### Reseller (White-Label)
11. As a Reseller, I want a dedicated white-label storefront (`/r/[my-brand-slug]`) with my own logo and custom markup pricing, so that I can sell products directly to my client base.
12. As a Reseller, I want access to wholesale volume discount tiers based on order volume, so that my profit margin scales with sales.
13. As a Reseller, I want a dedicated Reseller Portal to view sub-orders, customer fulfillment statuses, and payment states, so that I can support my clients effectively.
14. As a Reseller, I want ephemeral reseller upload sessions, so that my clients can upload custom design assets securely without exposing my reseller API credentials.

### Affiliate & Marketing
15. As an Affiliate, I want to generate custom referral tracking links (`?ref=CODE`), so that traffic I direct to the store is attributed to my account.
16. As an Affiliate, I want to view my referral visits, conversions, pending commissions, and paid balance in a partner dashboard, so that I can track my marketing ROI.
17. As an Affiliate, I want to request commission payouts to my cryptocurrency wallet address, so that I can withdraw my earnings.
18. As a Marketing Manager, I want to create percentage or fixed discount promo codes with expiration dates, minimum order values, and maximum usage caps, so that I can run promotional campaigns.

### Merchant & Store Administrator
19. As an Admin, I want a secure Admin Dashboard displaying store KPI metrics (Gross Revenue, Total Orders, Conversion Rate, Crypto Volume by Asset), so that I have immediate operational visibility.
20. As an Admin, I want to create, edit, archive, and delete products, manage variants, and define custom field schemas through an intuitive UI, so that I don't have to edit code to update inventory.
21. As an Admin, I want to view all customer orders, filter by payment and fulfillment status, update shipping tracking numbers, and add internal notes, so that I can fulfill orders efficiently.
22. As an Admin, I want to manage cryptocurrency payment gateways, toggle enabled assets, update merchant deposit wallet addresses, and adjust required block confirmations, so that I have total control over my crypto treasury.
23. As an Admin, I want a real-time Payment Activity Ledger showing all generated payment intents, detected on-chain tx hashes, atomic amounts, and explorer deep links, so that I can audit incoming funds.
24. As an Admin, I want to manage users, assign roles (Customer, Admin, Reseller, Affiliate), and approve affiliate payout requests.
25. As an Admin, I want a unified activity and email dispatch log, so that I can audit system events, login attempts, and transactional email deliveries.

### Developer & Store Owner (Setup & Deployment)
26. As a Store Owner, I want to run `npm run setup` in my terminal to interactively configure my store name, currency, admin password, and auto-generate cryptographic secrets, so that setup is completely foolproof.
27. As a Store Owner, I want all sensitive keys, RPC URLs, and deposit addresses to be strictly isolated in environment variables, so that I can publish or open-source my repository without leaking secrets.
28. As a Developer, I want to develop locally with zero cloud dependencies using local SQLite database and mock adapters, so that I can iterate rapidly.
29. As a Developer, I want automated deployment scripts and AWS SAM infrastructure templates, so that deploying to Vercel and AWS takes minutes.

---

## Implementation Decisions

### 1. Architectural Seams & Monorepo Structure
- **Frontend / Full-Stack Web**: Next.js 16 with App Router in TypeScript at project root (`app/`, `components/`, `lib/`).
- **Database & Data Layer**: Prisma ORM with dual-mode support (`prisma/schema.prisma`): SQLite for local zero-config development (`DATABASE_URL="file:./dev.db"`), PostgreSQL (Neon/Supabase/RDS) for production.
- **Serverless Payment Watcher**: Python 3.13 Lambda function (`lambdas/payment_watcher/`) triggered by EventBridge cron (or local scheduler) for background blockchain polling and state transitions.
- **Shared Payment Engine**: Core crypto intent math, atomic amount generation with collision avoidance, address validation, and explorer adapters (`lambdas/shared/payment/` & `lib/payments/`).
- **Asset Storage Pipeline**: Presigned upload client and server handlers supporting Cloudflare R2 and AWS S3 (`lib/storage/` & `app/api/uploads/`).

### 2. Crypto Payment Intent & Unique Atomic Amount Math
- Exchange rates fetched from CoinGecko API with fallback caching.
- Unique atomic amount calculation (`compute_unique_amount`): computes base atomic units + deterministic 4-digit pseudorandom nonce (1-9999).
- Strict atomic collision prevention: queries active pending intents on the same deposit address and shifts the nonce if a collision is detected.
- Status transition graph: `pending` → `detected` (unconfirmed tx found on-chain) → `confirmed` (min confirmations reached) → triggers order update to `paid` and automated digital fulfillment / email notifications.

### 3. Modular Reseller & Affiliate Subsystems
- Feature flags: `ENABLE_RESELLER=true|false`, `ENABLE_AFFILIATES=true|false`, `ENABLE_MARKETING=true|false`.
- Reseller white-label middleware rewriting (`/r/[slug]`) to load merchant customization metadata.
- Reseller wholesale tiered pricing engine (`lib/pricing/`).
- Affiliate referral attribution cookie (`ref_code`) with configurable attribution window (default 30 days).

### 4. Interactive Setup CLI Wizard
- `scripts/setup-wizard.ts` (executable via `npm run setup`):
  - Generates secure random 256-bit secrets for `AUTH_SECRET`, `PAY_TOKEN_SECRET`, `CRON_SECRET`.
  - Prompts for Store Name, Currency Symbol, Support Email.
  - Automatically writes `.env.local` without overwriting existing keys unless confirmed.
  - Executes `prisma db push` and `prisma db seed` with starter catalog and admin account.

---

## Testing Decisions

### Seam Testing Strategy
- **Payment Engine Seam**: Test atomic collision generation, exchange rate calculations, and address checksum validation using Vitest / pytest.
- **Order State Machine Seam**: Test state transitions (`pending` → `detected` → `confirmed` → `processing` → `shipped`) and idempotent payment processing.
- **API Seam**: End-to-end testing of public endpoints (`/api/orders`, `/api/payments/intent`, `/api/payments/poll`, `/api/track`) and authenticated admin routes (`/api/admin/*`).
- **Catalog Schema Seam**: Validate custom field dynamic validation (required fields, regex patterns, upload constraints).

---

## Out of Scope
- Direct custodial credit card processing (Stripe / PayPal): this template is strictly non-custodial cryptocurrency.
- Complex multi-warehouse inventory physical shipping logistics (can be integrated via external webhooks).
- Native iOS / Android mobile applications (storefront is fully responsive mobile-first PWA).

---

## Further Notes
- Clean adherence to dark/light theme tokens via Tailwind CSS v4 variables.
- All pricing formatted consistently with dedicated price utility classes (`text-price`).
- Ready for immediate tracer-bullet ticket breakdown via `/to-tickets`.
