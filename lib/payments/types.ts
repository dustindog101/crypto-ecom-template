export type CryptoAssetId =
  | 'btc'
  | 'ltc'
  | 'sol'
  | 'usdc_ethereum'
  | 'usdc_base'
  | 'usdc_polygon'
  | 'usdc_solana';

export interface CryptoAssetMeta {
  id: CryptoAssetId;
  name: string;
  symbol: string;
  network: string;
  decimals: number;
  coingeckoId: string;
  minConfirmations: number;
  explorerTxUrl: (txHash: string) => string;
}

export const CRYPTO_ASSETS: Record<CryptoAssetId, CryptoAssetMeta> = {
  btc: {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Mainnet',
    decimals: 8,
    coingeckoId: 'bitcoin',
    minConfirmations: 1,
    explorerTxUrl: (tx) => `https://mempool.space/tx/${tx}`,
  },
  ltc: {
    id: 'ltc',
    name: 'Litecoin',
    symbol: 'LTC',
    network: 'Litecoin Mainnet',
    decimals: 8,
    coingeckoId: 'litecoin',
    minConfirmations: 2,
    explorerTxUrl: (tx) => `https://blockchair.com/litecoin/transaction/${tx}`,
  },
  sol: {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Mainnet',
    decimals: 9,
    coingeckoId: 'solana',
    minConfirmations: 32,
    explorerTxUrl: (tx) => `https://solscan.io/tx/${tx}`,
  },
  usdc_ethereum: {
    id: 'usdc_ethereum',
    name: 'USDC (Ethereum)',
    symbol: 'USDC',
    network: 'Ethereum (ERC-20)',
    decimals: 6,
    coingeckoId: 'usd-coin',
    minConfirmations: 12,
    explorerTxUrl: (tx) => `https://etherscan.io/tx/${tx}`,
  },
  usdc_base: {
    id: 'usdc_base',
    name: 'USDC (Base)',
    symbol: 'USDC',
    network: 'Base (EVM)',
    decimals: 6,
    coingeckoId: 'usd-coin',
    minConfirmations: 10,
    explorerTxUrl: (tx) => `https://basescan.org/tx/${tx}`,
  },
  usdc_polygon: {
    id: 'usdc_polygon',
    name: 'USDC (Polygon)',
    symbol: 'USDC',
    network: 'Polygon PoS',
    decimals: 6,
    coingeckoId: 'usd-coin',
    minConfirmations: 30,
    explorerTxUrl: (tx) => `https://polygonscan.com/tx/${tx}`,
  },
  usdc_solana: {
    id: 'usdc_solana',
    name: 'USDC (Solana)',
    symbol: 'USDC',
    network: 'Solana (SPL)',
    decimals: 6,
    coingeckoId: 'usd-coin',
    minConfirmations: 32,
    explorerTxUrl: (tx) => `https://solscan.io/tx/${tx}`,
  },
};
