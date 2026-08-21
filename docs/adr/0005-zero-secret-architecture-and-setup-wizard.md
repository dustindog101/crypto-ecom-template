# Zero-Secret Architecture and Interactive CLI Setup Wizard

We decided that the repository will contain strictly zero hardcoded secrets, proprietary brand assets, or dev fallback keys in any source file. All secrets (JWT keys, HMAC pay token secrets, API keys, deposit addresses) are managed via `.env.example` and an interactive terminal setup wizard (`npm run setup`) that cryptographically generates secure random keys, validates deposit address checksums, and tests cloud connections before first run.
