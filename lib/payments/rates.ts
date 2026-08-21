import { CryptoAssetId, CRYPTO_ASSETS } from './types';

interface CachedRate {
  rate: number;
  timestamp: number;
}

const rateCache = new Map<string, CachedRate>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export async function getExchangeRate(assetId: CryptoAssetId): Promise<number> {
  const asset = CRYPTO_ASSETS[assetId];
  if (!asset) throw new Error(`Unknown asset: ${assetId}`);

  // Stablecoins are 1.0 USD
  if (asset.symbol === 'USDC') {
    return 1.0;
  }

  const cached = rateCache.get(asset.coingeckoId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.rate;
  }

  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${asset.coingeckoId}&vs_currencies=usd`;
    
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const res = await fetch(url, { headers, next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`CoinGecko rate fetch failed: ${res.statusText}`);

    const data = await res.json();
    const rate = data[asset.coingeckoId]?.usd;
    if (!rate || typeof rate !== 'number') {
      throw new Error(`Invalid rate returned for ${asset.coingeckoId}`);
    }

    rateCache.set(asset.coingeckoId, { rate, timestamp: Date.now() });
    return rate;
  } catch (error) {
    console.warn(`[Rates] Failed to fetch rate for ${assetId}, falling back to cache if available:`, error);
    if (cached) return cached.rate;
    throw error;
  }
}
