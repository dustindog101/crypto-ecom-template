# Serverless AWS Architecture with Next.js App Router and Python Lambdas

We decided on a monorepo structure with Next.js 16 (App Router) at the root, Python 3.13 Lambda handlers under `lambdas/`, AWS DynamoDB for primary persistence, and Cloudflare R2 / S3 for asset storage, complemented by a local mock storage adapter for rapid zero-cloud development. This provides enterprise-scale serverless resilience while keeping hosting costs within free tiers for small to medium merchants.
