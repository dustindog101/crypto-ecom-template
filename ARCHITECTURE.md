# System Architecture

## Overview

The Crypto E-Commerce Template combines a Next.js 16 App Router full-stack web application with a decoupled serverless Python background payment watcher.

```
[ Customer Browser ]
       │ (1) Checkout Order & Select Crypto Rail
       ▼
[ Next.js API Routes (/api/payments/intent) ]
       │ (2) Rate Math + Atomic Nonce Generation
       ▼
[ Prisma ORM / Database (SQLite | Postgres) ]
       ▲
       │ (3) Periodic Polling & Confirmation
[ Python Payment Watcher (EventBridge Cron) ]
       │ (4) Checks On-Chain Transactions
       ▼
[ Blockchain Explorers (Esplora / Etherscan / Solana RPC) ]
```

## Payment State Transitions

- `PENDING`: Payment intent created; awaiting buyer transaction.
- `DETECTED`: Transaction broadcasted to network; accumulating block confirmations.
- `CONFIRMED`: Required confirmations reached; Order automatically updated to `PAID`.
- `EXPIRED`: Payment window elapsed without detected funds.
