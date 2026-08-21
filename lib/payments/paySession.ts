import crypto from 'crypto';

/**
 * Creates an HMAC signed pay token for guest / reseller checkout invoice viewing.
 */
export function signPayToken(orderId: string, secret: string = process.env.PAY_TOKEN_SECRET || 'dev_secret'): string {
  const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 hours
  const payload = `${orderId}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

/**
 * Verifies an HMAC pay token.
 */
export function verifyPayToken(token: string, orderId: string, secret: string = process.env.PAY_TOKEN_SECRET || 'dev_secret'): boolean {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const [tokenOrderId, expiresAtStr, signature] = raw.split(':');

    if (tokenOrderId !== orderId) return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `${tokenOrderId}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}
