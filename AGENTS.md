# AGENTS.md

Context and rules for AI coding assistants working in this repository.

---

## Critical Rules

1. Dark mode only. The main background color is `#09090B`. Design variables are in `app/globals.css`.
2. Glass surfaces. Use the `.glass` utility class for card surfaces.
3. Prices in amber. Always use the `.text-price` class for prices and dollar figures.
4. No hardcoded secrets. Do not commit API keys, private keys, or wallet addresses.
5. Prevent collisions. Unique atomic amounts must use the `computeUniqueAmount` helper to avoid conflicting on-chain transfers.

---

## Agent Skills Configuration

### Issue Tracker
GitHub issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage Labels
Canonical 5-role triage label set. See `docs/agents/triage-labels.md`.

### Domain Docs
Single-context domain glossary and ADRs. See `docs/agents/domain.md` and `CONTEXT.md`.

---

## Stack Summary

- Framework: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4.
- Database: Prisma ORM (SQLite for local dev, PostgreSQL for production).
- Storage: Cloudflare R2 / AWS S3 presigned URLs.
- Serverless: Python 3.13 Lambda poller under `lambdas/payment_watcher/`.
