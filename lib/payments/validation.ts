import { CryptoAssetId } from './types';

export function validateCryptoAddress(assetId: CryptoAssetId, address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const clean = address.trim();

  switch (assetId) {
    case 'btc':
      // Bitcoin: P2PKH (1...), P2SH (3...), Bech32 (bc1...)
      return /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{11,71})$/.test(clean);
    case 'ltc':
      // Litecoin: L..., M..., ltc1...
      return /^(L[a-km-zA-HJ-NP-Z1-9]{26,33}|M[a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-zA-HJ-NP-Z0-9]{11,71})$/.test(clean);
    case 'sol':
    case 'usdc_solana':
      // Solana base58 address: 32-44 characters
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean);
    case 'usdc_ethereum':
    case 'usdc_base':
    case 'usdc_polygon':
      // EVM 0x address
      return /^0x[a-fA-F0-9]{40}$/.test(clean);
    default:
      return false;
  }
}
