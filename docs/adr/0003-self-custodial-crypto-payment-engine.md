# Non-Custodial Multi-Rail Crypto Payment Gateway with Watcher Engine (ID Pirate Architecture)

We decided to adopt the battle-tested ID Pirate crypto payment gateway architecture. This features:
1. Direct non-custodial on-chain deposit monitoring (BTC, LTC, SOL, ETH, USDC on EVM/Solana) via a decoupled EventBridge/cron-triggered payment watcher Lambda and client-side real-time polling.
2. Guaranteed atomic amount collision avoidance so simultaneous orders on the same deposit address never collide.
3. Secure HMAC pay session tokens for guest checkout and white-label reseller customer invoice tracking.
4. An Admin Payments Hub with live transaction ledger, address validation, confirmation threshold controls, and explorer deep-linking.
All deposit addresses, RPC URLs, and explorer API keys are fully parameterized via environment variables and runtime settings.
