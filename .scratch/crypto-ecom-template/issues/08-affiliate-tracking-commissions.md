# 08: Multi-Tier Affiliate Tracking & Commission System

**What to build:** Referral link tracking (`?ref=CODE`), attribution cookie management, affiliate partner dashboard with analytics, automated commission calculations upon order payment, and payout request ledger.

**Blocked by:** 04: Frictionless Guest Checkout, Order Creation & Public Tracking, 06: Backoffice Admin Dashboard & Payments Hub

**Status:** closed

- [x] Referral attribution middleware and cookie capture (`?ref=CODE`)
- [x] Affiliate partner dashboard (`/affiliate`) showing clicks, conversions, pending and approved commissions
- [x] Automated commission credit triggers when orders transition to `PAID` status
- [x] Affiliate payout request submission and admin approval ledger
- [x] Feature flag `ENABLE_AFFILIATES` to toggle the subsystem cleanly
