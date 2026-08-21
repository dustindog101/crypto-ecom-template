# 04: Frictionless Guest Checkout, Order Creation & Public Tracking

**What to build:** End-to-end checkout flow supporting both anonymous guests and registered users, cryptographically secure Tracking Code generation, public order tracking (`/track/[code]`), and post-checkout 1-click account claiming.

**Blocked by:** 02: Dynamic Product Catalog, Custom Fields Schema & Cart System, 03: Multi-Chain Crypto Payment Engine & Non-Custodial Watcher

**Status:** closed

- [x] Frictionless guest checkout page collecting shipping details and payment rail selection
- [x] Order creation API with atomic snapshot of products, variants, customizations, and pricing
- [x] Payment invoice route (`/checkout/pay/[orderId]`) rendering payment intent and polling state
- [x] Public order tracking page (`/track/[trackingCode]`) displaying real-time fulfillment and payment status
- [x] Post-checkout 1-click account creation to link guest orders to a new user account
