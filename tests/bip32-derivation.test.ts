import { describe, it, expect } from 'vitest';
import { deriveBtcAddress, deriveLtcAddress, deriveEvmAddress, deriveAddressForAsset } from '../lib/payments/bip32Derive';
import { validateCryptoAddress } from '../lib/payments/validation';

describe('BIP84 / BIP32 Extended Public Key Derivation', () => {
  // Test vector zpub
  const sampleZpub = 'zpub6jftahH18ngZyAcN1iwL8DrdXp37kBfTwLW6JDSkhfighDWHhdLTwKLiGsRz8M8EFJjqLva6rxPcZeybuLaFWbCeNgRoysskfDk6TjEEFEw';

  it('should derive sequential Native SegWit bc1q addresses from zpub', () => {
    const addr0 = deriveBtcAddress(sampleZpub, 0);
    const addr1 = deriveBtcAddress(sampleZpub, 1);
    const addr2 = deriveBtcAddress(sampleZpub, 2);

    expect(addr0.startsWith('bc1q')).toBe(true);
    expect(addr1.startsWith('bc1q')).toBe(true);
    expect(addr2.startsWith('bc1q')).toBe(true);

    expect(addr0).not.toEqual(addr1);
    expect(addr1).not.toEqual(addr2);

    expect(validateCryptoAddress('btc', addr0)).toBe(true);
    expect(validateCryptoAddress('btc', addr1)).toBe(true);
  });

  it('should passthrough static Bitcoin addresses unchanged', () => {
    const staticAddr = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
    expect(deriveAddressForAsset('btc', staticAddr, 0)).toBe(staticAddr);
    expect(deriveAddressForAsset('btc', staticAddr, 5)).toBe(staticAddr);
  });

  it('should passthrough static EVM and Solana addresses', () => {
    const ethAddr = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    const solAddr = 'Vote111111111111111111111111111111111111111';

    expect(deriveAddressForAsset('usdc_ethereum', ethAddr, 0)).toBe(ethAddr);
    expect(deriveAddressForAsset('sol', solAddr, 0)).toBe(solAddr);
  });
});
