# Crypto E-Commerce Template

A modern, zero-secret, self-custodial cryptocurrency e-commerce template featuring a Next.js 16 storefront, Prisma ORM (SQLite for instant zero-config dev, PostgreSQL / Neon for production), modular Python/Node background payment watchers, dynamic product custom schemas, multi-tier affiliates, white-label resellers, and automated multi-chain on-chain payment settlement.

## Language

### Ordering & Fulfillment

**Order**:
A customer's confirmed commitment to purchase one or more product items, containing shipping details, line items, and fulfillment status.
_Avoid_: Purchase, Transaction, Deal

**Order Item**:
A single line item in an Order representing a specific Product Variant, quantity, calculated unit price, and any custom user-submitted attributes or assets.
_Avoid_: Line Item, Product Entry

**Tracking Code**:
A cryptographically secure public lookup identifier (e.g. `ORD-8F92K`) that allows customers (including guests) to track order status and payment confirmations without logging in.
_Avoid_: Order PIN, Secret Key, Token

### Catalog & Products

**Product**:
A sellable good or service with customizable attributes, dynamic form input schemas, file upload requirements, and associated variants.
_Avoid_: Item, Listing, Article

**Product Variant**:
A distinct purchasable SKU of a Product representing a specific combination of attributes (e.g., size, dosage, color, kit vs single) with its own base price.
_Avoid_: Sub-item, Option

**Custom Field Schema**:
A declarative JSON schema attached to a Product defining required customer inputs (e.g., text, selection, file/image upload) collected during checkout.
_Avoid_: Form Template, Form Spec

### Billing & Crypto Payments

**Payment Intent**:
A time-bounded agreement to accept cryptocurrency payment for an Order with unique-amount matching at a locked exchange rate to a merchant deposit address.
_Avoid_: Charge, Invoice, Crypto Request

**Crypto Rail**:
A supported blockchain network and asset pair (e.g., BTC on Bitcoin, LTC on Litecoin, SOL on Solana, USDC on Ethereum/Base/Polygon) used to settle payment intents.
_Avoid_: Network Provider, Chain Method

**Payment Watcher**:
An automated background worker (cron or Lambda) that polls blockchain nodes/explorers to detect on-chain transactions and mark Payment Intents as detected or confirmed.
_Avoid_: Cron Scraper, Crypto Daemon

**Settlement**:
The verified confirmation of funds reaching the merchant's deposit address with required network block confirmations.
_Avoid_: Clearing, Deposit Finalization

### Identity & Access

**Customer**:
An end-user who browses products, places orders, and tracks fulfillment, either anonymously as a guest or with a registered account.
_Avoid_: Client, Buyer, Account

**Admin**:
A privileged operator with full access to the backoffice dashboard, order management, payment activity, activity logs, and store settings.
_Avoid_: Superuser, Staff, Owner

**Reseller**:
A trusted B2B partner operating white-label storefronts (`/r/[slug]`) with wholesale discounted pricing tiers and dedicated sub-order management.
_Avoid_: Distributor, Vendor

**Affiliate**:
A promoter who refers Customers via tracking links (`?ref=CODE`) and earns commission credits on completed orders.
_Avoid_: Influencer, Referrer, Partner

### Promotion & Marketing

**Promo Code**:
A merchant-defined coupon string granting percentage or fixed monetary discounts across eligible products or cart totals.
_Avoid_: Coupon, Voucher, Discount Token
