import { describe, it, expect } from 'vitest';
import { validateCryptoAddress } from '../lib/payments/validation';

describe('Multi-Chain Crypto Address Validation', () => {
  it('should validate Bitcoin addresses', () => {
    expect(validateCryptoAddress('btc', 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
    expect(validateCryptoAddress('btc', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(true);
    expect(validateCryptoAddress('btc', 'invalid_address')).toBe(false);
  });

  it('should validate EVM addresses', () => {
    expect(validateCryptoAddress('usdc_ethereum', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(true);
    expect(validateCryptoAddress('usdc_base', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(true);
    expect(validateCryptoAddress('usdc_polygon', 'not_an_eth_address')).toBe(false);
  });

  it('should validate Solana addresses', () => {
    expect(validateCryptoAddress('sol', 'Vote111111111111111111111111111111111111111')).toBe(true);
    expect(validateCryptoAddress('sol', '0x123')).toBe(false);
  });
});
