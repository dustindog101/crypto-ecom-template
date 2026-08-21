export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Crypto Commerce',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Self-Custodial Cryptocurrency E-Commerce Platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  currency: {
    code: 'USD',
    symbol: '$',
  },
  fees: {
    standardShipping: 10.0,
    expressShipping: 25.0,
    handlingFee: 0.0,
  },
  features: {
    enableReseller: process.env.ENABLE_RESELLER === 'true',
    enableAffiliates: process.env.ENABLE_AFFILIATES === 'true',
    enableMarketing: process.env.ENABLE_MARKETING !== 'false',
    allowGuestCheckout: process.env.ALLOW_GUEST_CHECKOUT !== 'false',
  },
  crypto: {
    intentTtlHours: 48,
    pollIntervalSeconds: 15,
  }
};
