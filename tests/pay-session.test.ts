import { describe, it, expect } from 'vitest';
import { signPayToken, verifyPayToken } from '../lib/payments/paySession';

describe('HMAC Pay Session Tokens', () => {
  it('should sign and verify valid order tokens', () => {
    const orderId = 'ord_test_12345';
    const secret = 'super_secure_test_secret_123';

    const token = signPayToken(orderId, secret);
    expect(token).toBeDefined();

    const isValid = verifyPayToken(token, orderId, secret);
    expect(isValid).toBe(true);
  });

  it('should reject tampered or mismatched order tokens', () => {
    const orderId = 'ord_test_12345';
    const secret = 'super_secure_test_secret_123';

    const token = signPayToken(orderId, secret);
    const isValid = verifyPayToken(token, 'different_order_id', secret);
    expect(isValid).toBe(false);
  });
});
