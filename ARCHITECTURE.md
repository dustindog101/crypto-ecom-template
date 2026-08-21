# Architecture Overview

## Design Principles

1. **Non-Custodial**: Funds flow directly from buyer to merchant. There is no escrow and no intermediary processing account.
2. **Deterministic Amount Matching**: To avoid running a full HD wallet node that derives new addresses per order, we use a single deposit address per asset with a unique atomic unit suffix (1 to 9999 satoshis/wei/lamports).
3. **Zero Secrets in Source**: All cryptographic secrets, RPC endpoints, and merchant wallets are passed through environment variables or runtime database settings.

---

## System Components

### 1. Storefront (Next.js 16 App Router)
- Static catalog grid with dynamic product detail pages.
- Client-side Zustand cart with local storage persistence.
- Dynamic custom schema builder for products requiring custom buyer text or file uploads.
- Public tracking page (`/track/[code]`) allowing guests to check fulfillment and payment confirmations without logging in.

### 2. Crypto Payment Engine (`lib/payments/`)
- **Rate Engine**: Queries CoinGecko for live market prices with 60-second in-memory caching.
- **Amount Generator**: Computes the exact crypto decimal and atomic integer values, checking pending database intents to prevent collision on the same address.
- **Address Validators**: Regex and checksum validators for Bitcoin (legacy and Bech32), Litecoin, Solana, and EVM addresses.
- **Pay Sessions**: Signs and verifies HMAC tokens for anonymous order checkout.

### 3. Payment Watcher (`lambdas/payment_watcher/`)
- A decoupled Python 3.13 Lambda service.
- Supported adapters:
  - Esplora API for Bitcoin and Litecoin.
  - Etherscan V2 and Blockscout for EVM ERC-20 token transfers (Ethereum, Base, Polygon).
  - Solana JSON-RPC for native SOL and SPL USDC transfers.
- Can run locally via Next.js API polling or on AWS via EventBridge cron.

### 4. Admin Suite (`/admin`)
- Order fulfillment controls (tracking numbers, fulfillment status).
- Product and variant management.
- Coupon and discount engine.
- Payments Hub with live activity ledger and wallet configuration.

### 5. Resellers and Affiliates
- White-label storefront routing via `/r/[resellerSlug]`.
- Wholesale pricing calculation schedule based on order quantity.
- Referral link attribution via `?ref=CODE` with cookie persistence.

---

## Payment State Machine

```
[ PENDING ]
     │
     ├─► Blockchain transfer seen with < min confirmations
     ▼
[ DETECTED ]
     │
     ├─► Block confirmations >= threshold
     ▼
[ CONFIRMED ] ──► Order marked PAID ──► Triggers fulfillment / delivery
     │
     └─► Expiration window reached without payment
     ▼
[ EXPIRED ]
```
