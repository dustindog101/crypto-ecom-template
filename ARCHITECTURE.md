# Architecture & Free Tier Scaling Blueprint

## Core Architectural Principles

1. **Non-Custodial**: Funds flow directly from the customer to the merchant. There is no middleman escrow or intermediary processing account.
2. **BIP84 / Extended Key Derivation**: Supply an extended public key (`zpub` for Bitcoin Native SegWit or `xpub` for Litecoin/EVM). The engine derives a fresh, dedicated address for every order at index `m/0/index` in CPU memory.
3. **Zero Secrets in Source**: All cryptographic secrets, RPC endpoints, and merchant wallets are configured via environment variables or runtime database settings.

---

## Free-Tier Scaling Blueprint (30,000+ Monthly Orders)

The platform is designed from the ground up to stay completely within free cloud tiers at scale:

### 1. Vercel Edge & Serverless Tier
- **Strategy**: Next.js App Router utilizes Incremental Static Regeneration (ISR) and static page caching for all catalog and product pages.
- **Result**: Only active checkout, order creation, and payment status polling hit serverless functions. 30,000 orders generate ~60k dynamic edge executions per month, well below Vercel's 1,000,000 request allowance.

### 2. Neon Serverless Postgres Tier
- **Strategy**: Each Order record with snapshot line items and payment intent metadata consumes ~1 KB of indexed storage.
- **Result**: 30,000 orders consume ~30 MB of database storage per month. Neon's free 0.5 GB storage tier accommodates over 500,000 total historical orders without upgrading.

### 3. Cloudflare R2 Zero-Egress Storage
- **Strategy**: Direct browser-to-bucket presigned PUT uploads bypass the Next.js server entirely.
- **Result**: Cloudflare R2 provides 10 GB storage and 10 million free Class B reads per month with zero egress fees, eliminating bandwidth bills.

### 4. Client-Driven Real-Time Polling
- **Strategy**: Instead of maintaining continuous background websocket connections or heavy polling loops for abandoned carts, the customer's browser polls `/api/payments/poll` every 15 seconds only during active checkout.
- **Result**: Reduces idle server load to zero.

---

## System Components

```
                       CUSTOMER BROWSER
                              │
             ┌────────────────┴────────────────┐
             │ 1. Browse catalog & variants    │
             │ 2. Fill optional custom fields  │
             │ 3. Pick crypto rail (BTC, SOL)  │
             └────────────────┬────────────────┘
                              ▼
                     NEXT.JS API LAYER
                              │
             ┌────────────────┴────────────────┐
             │ 4. Fetch live exchange rate     │
             │ 5. Derive unique bc1q... addr   │
             │ 6. Issue signed HMAC invoice    │
             └────────────────┬────────────────┘
                              ▼
                     PRISMA DATABASE
                     (SQLite / Postgres)
                              ▲
                              │ 7. Query active intents
                              │    and update confirmations
                              │
                 PAYMENT WATCHER WORKER
                 (Python 3.13 / Cron)
                              │
                              ▼
                    BLOCKCHAIN NETWORKS
               (Esplora, Etherscan, Solana)
```

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
