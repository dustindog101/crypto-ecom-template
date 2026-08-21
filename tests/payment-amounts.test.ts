import { describe, it, expect } from 'vitest';
import { computeUniqueAmount } from '../lib/payments/amounts';

describe('Payment Atomic Amount & Collision Avoidance', () => {
  it('should generate valid unique atomic amount for Bitcoin', () => {
    const usdTotal = 100.0;
    const btcRate = 95000.0;
    const result = computeUniqueAmount(usdTotal, btcRate, 'btc');

    expect(result.expectedAmount).toBeDefined();
    expect(result.expectedAtomic).toBeDefined();
    expect(result.uniqueSuffix).toBeGreaterThanOrEqual(1000);
    expect(result.uniqueSuffix).toBeLessThanOrEqual(99999);
  });

  it('should avoid atomic collisions when existing intents are pending', () => {
    const usdTotal = 100.0;
    const btcRate = 95000.0;
    const existing = new Set<string>();

    const first = computeUniqueAmount(usdTotal, btcRate, 'btc', existing);
    existing.add(first.expectedAtomic);

    const second = computeUniqueAmount(usdTotal, btcRate, 'btc', existing);
    expect(second.expectedAtomic).not.toEqual(first.expectedAtomic);
  });
});
