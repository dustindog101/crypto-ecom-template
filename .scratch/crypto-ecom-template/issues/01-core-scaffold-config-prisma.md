# 01: Core Repository Scaffold, Config Tokens & Prisma Database Engine

**What to build:** A clean, zero-secret Next.js 16 App Router starter repository with Tailwind CSS v4 design tokens, Prisma ORM configured for SQLite (development) and PostgreSQL (production), dynamic DB seed data, fully parameterizable `.env.example`, and an interactive `npm run setup` terminal wizard.

**Blocked by:** None (can start immediately)

**Status:** closed

- [x] Next.js 16 + React 19 + TypeScript 5 initialized with clean directory structure
- [x] Tailwind CSS v4 configured with dark/light variables and `text-price` utilities
- [x] Prisma schema defined with User, Product, ProductVariant, Cart, Order, OrderItem, PaymentIntent, PaymentSettings, Coupon, and Log models
- [x] Database seed script (`scripts/seed.ts`) populating default products, categories, demo coupons, and payment settings
- [x] Zero-secret `.env.example` created with comprehensive documentation
- [x] Interactive terminal setup wizard (`scripts/setup-wizard.ts`) generating cryptographically secure secrets
