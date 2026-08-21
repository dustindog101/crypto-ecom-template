# 03: Multi-Chain Crypto Payment Engine & Non-Custodial Watcher

**What to build:** Complete ID Pirate payment gateway architecture: CoinGecko exchange rate caching, atomic amount generation with collision avoidance, payment intent creation, interactive QR code invoice modal with real-time polling, and decoupled Python Lambda blockchain watcher.

**Blocked by:** 01: Core Repository Scaffold, Config Tokens & Prisma Database Engine

**Status:** closed

- [x] CoinGecko rate fetcher with stale rate protection and fallback caching
- [x] Unique atomic amount generator with collision avoidance on active intents
- [x] Multi-chain address validators (BTC, LTC, SOL, EVM USDC/USDT)
- [x] Client-side invoice payment modal with QR code, copy buttons, live countdown, and polling
- [x] Python 3.13 blockchain watcher Lambda (`lambdas/payment_watcher/`) polling Esplora, Etherscan V2, and Solana RPC
- [x] HMAC pay session token minting and verification for secure guest/reseller access
