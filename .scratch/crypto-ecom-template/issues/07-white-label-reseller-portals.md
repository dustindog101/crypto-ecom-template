# 07: White-Label Reseller Portals & Wholesale Tier Engine

**What to build:** White-label custom domain and subpath storefronts (`/r/[resellerSlug]`), wholesale volume pricing tiers, dedicated reseller dashboard, and sub-order management.

**Blocked by:** 02: Dynamic Product Catalog, Custom Fields Schema & Cart System, 04: Frictionless Guest Checkout, Order Creation & Public Tracking, 06: Backoffice Admin Dashboard & Payments Hub

**Status:** closed

- [x] Middleware rewrite rules for `/r/[slug]` to load reseller branding and custom markup prices
- [x] Wholesale tier calculation engine for bulk volume discounts
- [x] Dedicated Reseller Portal (`/reseller`) for managing sub-orders and tracking revenue
- [x] Feature flag `ENABLE_RESELLER` to toggle the subsystem cleanly
