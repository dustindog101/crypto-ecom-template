# Modular Affiliate, Reseller White-Labeling, and Marketing with Feature Flags

We decided to include first-class Affiliate tracking (`?ref=CODE`), Reseller white-label storefronts (`/r/[slug]`), wholesale volume pricing tiers, and promotional discount engines as modular subsystems controlled by configuration flags (`ENABLE_RESELLER`, `ENABLE_AFFILIATES`, `ENABLE_MARKETING`). This allows store owners to enable only the revenue channels relevant to their business model without dead code or architectural overhead.
