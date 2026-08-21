# AGENTS.md — Crypto E-Commerce Template

> **Purpose**: Machine-readable context for AI coding assistants. Read this before touching any file.

---

## CRITICAL RULES (never violate these)

1. **Dark mode first** — Primary background is `#09090B`. Design tokens defined in `app/globals.css`.
2. **Glass cards** — All card surfaces use `.glass` utility class.
3. **Prices display in amber** — Always use `.text-price` class for all cryptocurrency and fiat amounts.
4. **Zero-Secret Rule** — Never hardcode merchant wallet addresses, API keys, or JWT secrets in code or git.
5. **Atomic collision avoidance** — All payment intents must generate unique atomic nonces to guarantee distinct on-chain transfer amounts.

---

## Agent skills

### Issue tracker
GitHub issue tracker via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels
Canonical five-role triage labels. See `docs/agents/triage-labels.md`.

### Domain docs
Single-context domain glossary and ADRs. See `docs/agents/domain.md`.

---

## Architecture Overview

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Zustand.
- **Database**: Prisma ORM with dual-mode support (SQLite for dev, PostgreSQL/Neon for prod).
- **Payments**: Decoupled multi-chain crypto payment engine (BTC, LTC, SOL, EVM USDC) with atomic collision avoidance.
- **Storage**: Cloudflare R2 / AWS S3 presigned upload pipeline.
- **Serverless**: Python 3.13 EventBridge payment watcher in `lambdas/payment_watcher/`.
