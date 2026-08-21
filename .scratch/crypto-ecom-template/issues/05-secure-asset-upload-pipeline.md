# 05: Cloudflare R2 / S3 Secure Asset Upload Pipeline

**What to build:** Direct browser-to-storage presigned upload pipeline with client-side image compression, MIME/size validation, and authorized presigned GET retrieval for customer order attachments and digital deliverables.

**Blocked by:** 01: Core Repository Scaffold, Config Tokens & Prisma Database Engine, 04: Frictionless Guest Checkout, Order Creation & Public Tracking

**Status:** closed

- [x] S3 / Cloudflare R2 client configuration with standard AWS S3 SDK
- [x] API endpoint for generating presigned PUT upload URLs with strict MIME and size bounds
- [x] Client-side UploadSlot component with drag-and-drop, progress indication, and image compression
- [x] Secure presigned GET endpoint granting access only to admins or authorized order holders
- [x] Lifecycle management and cleanup guidelines for orphaned uploads
