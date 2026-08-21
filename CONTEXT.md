# Domain Context

Domain glossary and terms for the crypto e-commerce template.

## Language

### Ordering and Fulfillment

**Order**:
A customer's purchase record containing shipping details, line items, and fulfillment status.
_Avoid_: Purchase, Transaction, Deal

**Order Item**:
A single line item in an Order representing a specific Product Variant, quantity, calculated unit price, and any custom user-submitted attributes or assets.
_Avoid_: Line Item, Product Entry

**Tracking Code**:
A public alphanumeric lookup identifier that allows customers to track order status and payment confirmations without logging in.
_Avoid_: Order PIN, Secret Key, Token

### Catalog and Products

**Product**:
A sellable good or service with customizable attributes, dynamic form input schemas, file upload requirements, and associated variants.
_Avoid_: Item, Listing, Article

**Product Variant**:
A distinct SKU of a Product representing a specific combination of attributes with its own base price.
_Avoid_: Sub-item, Option

**Custom Field Schema**:
A declarative JSON schema attached to a Product defining customer inputs (text, selection, file upload) collected during checkout.
_Avoid_: Form Template, Form Spec

### Billing and Crypto Payments

**Payment Intent**:
A time-bounded agreement to accept cryptocurrency payment for an Order at a locked exchange rate to a specific deposit address.
_Avoid_: Charge, Invoice, Crypto Request

**Crypto Rail**:
A supported blockchain network and asset pair (BTC on Bitcoin, LTC on Litecoin, SOL on Solana, USDC on Ethereum/Base/Polygon) used to settle payment intents.
_Avoid_: Network Provider, Chain Method

**Payment Watcher**:
An automated worker that polls blockchain nodes or explorers to detect on-chain transactions and mark Payment Intents as detected or confirmed.
_Avoid_: Cron Scraper, Crypto Daemon

**Settlement**:
The verified confirmation of funds reaching the merchant deposit address with required network block confirmations.
_Avoid_: Clearing, Deposit Finalization

### Identity and Access

**Customer**:
An end user who browses products, places orders, and tracks fulfillment, either as a guest or with an account.
_Avoid_: Client, Buyer, Account

**Admin**:
A store operator with full access to the backoffice dashboard, orders, payment activity, and settings.
_Avoid_: Superuser, Staff, Owner

**Reseller**:
A partner operating white-label storefronts (`/r/[slug]`) with wholesale discounted pricing tiers.
_Avoid_: Distributor, Vendor

**Affiliate**:
A promoter who refers customers via tracking links (`?ref=CODE`) and earns commission credits on completed orders.
_Avoid_: Influencer, Referrer, Partner

### Promotion

**Promo Code**:
A merchant-defined discount code granting percentage or fixed discounts on eligible orders.
_Avoid_: Coupon, Voucher, Discount Token
