import { CryptoAssetId, CRYPTO_ASSETS } from './types';

export interface UniqueAmountResult {
  expectedAmount: string; // e.g. "0.00145231"
  expectedAtomic: string; // e.g. "145231" (Satoshis/Wei/Lamports)
  uniqueSuffix: number;   // 1 - 9999
}

/**
 * Computes deterministic unique atomic amount with random nonce (1-9999)
 * to avoid collisions on the same merchant deposit address.
 */
export function computeUniqueAmount(
  usdTotal: number,
  exchangeRate: number,
  assetId: CryptoAssetId,
  existingPendingAtomics: Set<string> = new Set()
): UniqueAmountResult {
  const asset = CRYPTO_ASSETS[assetId];
  if (!asset) throw new Error(`Unknown asset: ${assetId}`);

  const baseCryptoAmount = usdTotal / exchangeRate;
  const multiplier = Math.pow(10, asset.decimals);
  let baseAtomic = BigInt(Math.floor(baseCryptoAmount * multiplier));

  // Generate random 4-digit nonce and check for atomic collision
  for (let attempt = 0; attempt < 50; attempt++) {
    const nonce = Math.floor(1000 + Math.random() * 9000);
    const candidateAtomic = (baseAtomic + BigInt(nonce)).toString();

    if (!existingPendingAtomics.has(candidateAtomic)) {
      const formatted = (Number(candidateAtomic) / multiplier).toFixed(asset.decimals);
      return {
        expectedAmount: formatted,
        expectedAtomic: candidateAtomic,
        uniqueSuffix: nonce,
      };
    }
  }

  // Fallback if tight collision
  const fallbackNonce = Math.floor(10000 + Math.random() * 90000);
  const candidateAtomic = (baseAtomic + BigInt(fallbackNonce)).toString();
  const formatted = (Number(candidateAtomic) / multiplier).toFixed(asset.decimals);

  return {
    expectedAmount: formatted,
    expectedAtomic: candidateAtomic,
    uniqueSuffix: fallbackNonce,
  };
}
