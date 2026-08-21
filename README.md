<div align="center">

# Crypto E-Commerce Template

### Self-custodial, open-source e-commerce platform with native cryptocurrency payments.

Zero payment processor fees. Direct to your own wallet. Stays within free hosting tiers for 30,000+ monthly orders.

```
git clone https://github.com/dustindog101/crypto-ecom-template.git
cd crypto-ecom-template && npm install && npm run setup
```

<br />

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-23272f?style=flat-square&logo=react&logoColor=58c4dc)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2d3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

<br />

[Quickstart](#quickstart) • [Why This Exists](#why-this-exists) • [BIP84 Derivation](#bip84-address-derivation) • [Free Tier Scale](#how-this-scales-for-free) • [Features](#features) • [Deployment](#production-deployment)

</div>

---

## Why This Exists

Most e-commerce platforms force merchants into custodial payment gateways with 3% fees, chargeback fraud, rolling reserves, and invasive customer identity checks.

This template is built for developers and merchants who want a sovereign alternative:

1. **Direct to your wallet**: Customer payments go straight to your own address. Funds never touch a third-party custodial account.
2. **BIP84 / zpub address derivation**: Supply your extended public key (`zpub` for Bitcoin Native SegWit or `xpub` for Litecoin/EVM). The engine automatically derives a fresh, dedicated `bc1q...` address for each new order on the fly.
3. **Private and frictionless**: Customers can buy as guests with just a contact handle or email. Every order gets a public tracking code (`/track/[code]`).
4. **Zero secrets in source**: No API keys, database credentials, or deposit addresses are hardcoded. Everything is configurable through `.env` and an interactive terminal wizard.

---

## Supported Assets

| Coin / Token | Network | Derivation / Address Format | Min Confirmations |
| :--- | :--- | :--- | :--- |
| **Bitcoin (BTC)** | Bitcoin Mainnet | BIP84 `zpub` -> Native SegWit (`bc1q...`) | 1 block |
| **Litecoin (LTC)** | Litecoin Mainnet | `xpub` / `Ltub` -> Native SegWit (`ltc1...`) | 2 blocks |
| **Solana (SOL)** | Solana Mainnet | Direct merchant address | Finalized (32 confs) |
| **USDC (Ethereum)** | Ethereum ERC-20 | `xpub` or direct merchant address (`0x...`) | 12 blocks |
| **USDC (Base)** | Base EVM | `xpub` or direct merchant address (`0x...`) | 10 blocks |
| **USDC (Polygon)** | Polygon PoS | `xpub` or direct merchant address (`0x...`) | 30 blocks |
| **USDC (Solana)** | Solana SPL | Direct merchant address | Finalized (32 confs) |

All networks can be enabled or disabled individually in the admin settings at `/admin/payments`.

---

## How This Scales for Free

This template is architected specifically so that a store processing **tens of thousands of monthly orders and thousands of customers runs 100% within free tiers**:

```
┌─────────────────────────┬──────────────────────────┬──────────────────────────┬────────────────────────┐
│ Service                 │ Free Tier Allowance      │ Usage at 30,000 Orders   │ Headroom               │
├─────────────────────────┼──────────────────────────┼──────────────────────────┼────────────────────────┤
│ Vercel (Web Hosting)    │ 100 GB band, 1M edge req │ ~60k API hits (cached)   │ > 90% free capacity    │
│ Neon (Serverless Postgres)│ 0.5 GB storage, autoscaling│ ~30 MB total DB size     │ Fits ~500k orders      │
│ Cloudflare R2 (Storage) │ 10 GB, 10M reads, 0 egress│ ~2 GB uploaded assets    │ 100% within free tier  │
│ Blockchain Explorers    │ Unmetered / 5 req/sec    │ Active orders only       │ Free public endpoints  │
│ AWS Lambda (Optional)   │ 1,000,000 invocations/mo │ 21,600 runs (2m cron)    │ < 3% of free tier      │
└─────────────────────────┴──────────────────────────┴──────────────────────────┴────────────────────────┘
```

### Architectural Decisions That Keep Costs at Zero:
- **Zero Session Bloat**: Cart state lives in the customer's browser via Zustand (`localStorage`). Browsing visitors generate zero database writes.
- **In-Memory Address Derivation**: Deriving `bc1q...` addresses from a `zpub` takes under 1 millisecond of CPU time. You do not need to run an expensive full node or wallet daemon.
- **Client-Side Live Polling**: During checkout, the customer's browser polls `/api/payments/poll` for 15 minutes. The server is not running persistent WebSocket servers or background daemons for idle carts.
- **Direct-to-R2 Uploads**: Product images and customer attachments stream directly from the browser to Cloudflare R2 via presigned URLs. Your Next.js server never proxies heavy media or incurs bandwidth costs.

---

## BIP84 Address Derivation

Instead of reusing a single static address or relying on sub-cent amount matching, you can enter your wallet's extended public key:

```
Merchant Wallet (Electrum / Trezor / Ledger)
                      │
           Export BIP84 zpub
                      │
                      ▼
         Crypto E-Commerce Engine
                      │
   ┌──────────────────┼──────────────────┐
   │ m/0/0            │ m/0/1            │ m/0/2
   ▼                  ▼                  ▼
Order #101         Order #102         Order #103
(bc1q9x...)        (bc1q4a...)        (bc1q8f...)
```

- Each customer receives their own dedicated address.
- When payment arrives at that address on-chain, the order is confirmed automatically.
- Funds go directly into your hardware or software wallet.

---

## Quickstart

### Prerequisites
- Node.js 20 or newer (or Bun 1.1+)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/dustindog101/crypto-ecom-template.git
cd crypto-ecom-template
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the setup wizard
The wizard prompts for your store name and generates 256-bit cryptographically secure keys for your `.env.local` file:
```bash
npm run setup
```

### 4. Initialize database and seed starter products
```bash
npm run db:push
npm run db:seed
```

### 5. Start the local server
```bash
npm run dev
```

Visit the running store:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Order Tracking**: [http://localhost:3000/track](http://localhost:3000/track)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Default Email: `admin@cryptostore.local`
  - Default Password: `adminPassword123!`
- **Reseller Portal Demo**: [http://localhost:3000/r/apex-store](http://localhost:3000/r/apex-store)

---

## Features

### Storefront
- Clean dark theme with responsive glass card styling.
- Dynamic variant selection with real-time price updates.
- Custom field schema support: products can define required text fields, select dropdowns, or file upload slots via JSON.
- Persistent slide-out cart drawer with promo code calculation.
- Frictionless guest checkout with automatic order tracking code generation.

### Admin Dashboard (`/admin`)
- Real-time revenue, total order count, and payment conversion KPIs.
- Order management with fulfillment status, carrier selection, and tracking numbers.
- Product and variant manager with custom input schema builder.
- Coupon manager with percentage and fixed discounts, minimum cart values, and expiration dates.
- Payments Hub to configure merchant `zpub` / `xpub` keys, set required block confirmations, and inspect the live transaction ledger.

### White-Label Resellers (`/r/[slug]`)
- Custom partner storefront URLs (`/r/apex-store`).
- Dedicated reseller portal (`/reseller`) showing wholesale volume tiers.
- Automatic wholesale discount calculation based on ordered quantity.

### Affiliate Referral Hub (`/affiliate`)
- Custom referral links (`/?ref=VIP2026`) with cookie attribution.
- Partner dashboard displaying total clicks, conversions, pending earnings, and payout balance.

### File Storage Pipeline
- Direct browser-to-bucket presigned PUT uploads for customer design files and documents.
- Compatible with Cloudflare R2 and AWS S3.
- Authenticated presigned GET downloads for digital product fulfillment.

---

## Configuration Reference

Key variables in `.env` or `.env.local`:

| Key | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | SQLite path (`file:./dev.db`) or PostgreSQL connection string |
| `AUTH_SECRET` | Yes | 32-byte base64 secret for user session tokens |
| `PAY_TOKEN_SECRET` | Yes | 32-byte hex secret for signing guest invoice sessions |
| `CRON_SECRET` | Yes | Random secret protecting background reconciliation endpoints |
| `CRYPTO_PAYMENTS_ENABLED` | Yes | Set to `true` to enable crypto checkout |
| `NEXT_PUBLIC_SITE_NAME` | No | Store title displayed in the header |
| `COINGECKO_API_KEY` | No | Optional CoinGecko Pro API key for higher rate limits |
| `ETHERSCAN_API_KEY` | No | Optional Etherscan API key for EVM transaction indexing |
| `SOLANA_RPC_URL` | No | Custom Solana RPC endpoint (defaults to public mainnet) |
| `R2_ACCOUNT_ID` | No | Cloudflare R2 Account ID for file uploads |
| `R2_ACCESS_KEY_ID` | No | Cloudflare R2 Access Key ID |
| `R2_SECRET_ACCESS_KEY` | No | Cloudflare R2 Secret Access Key |
| `RESEND_API_KEY` | No | Resend API key for transactional emails |

---

## Production Deployment

### 1. Database (Neon Postgres)
Create a free serverless PostgreSQL instance on [neon.tech](https://neon.tech) and copy the connection string.

### 2. Web Application (Vercel)
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the required environment variables from the table above.
4. Set the build command to:
   ```bash
   prisma generate && next build
   ```
5. Run the remote database migration:
   ```bash
   DATABASE_URL="postgres://..." npx prisma db push
   DATABASE_URL="postgres://..." npm run db:seed
   ```

### 3. Serverless Payment Watcher (AWS Lambda)
To run continuous background reconciliation outside of client visits:
```bash
./scripts/deploy-lambdas.sh
cd infra && sam build && sam deploy --guided
```

---

## Running Tests

Run the automated test suite covering BIP84 derivation, address validation, and pay session signing:

```bash
npm test
```

Scan the codebase to verify that no keys or addresses have been accidentally committed:

```bash
npx tsx scripts/audit-secrets.ts
```

---

## License

Released under the [MIT License](LICENSE). Built for the open-source self-custodial commerce ecosystem.
