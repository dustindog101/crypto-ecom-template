import { HDKey } from '@scure/bip32';
import { bech32 } from '@scure/base';
import crypto from 'crypto';

const VERSIONS: Record<string, { public: number; private: number }> = {
  xpub: { public: 0x0488b21e, private: 0x0488ade4 },
  ypub: { public: 0x049d7cb2, private: 0x049d7878 },
  zpub: { public: 0x04b24746, private: 0x04b2430c },
  Ltub: { public: 0x019da462, private: 0x019d9cfe },
};

/**
 * Computes RIPEMD160(SHA256(data))
 */
function hash160(buf: Uint8Array): Uint8Array {
  const sha = crypto.createHash('sha256').update(Buffer.from(buf)).digest();
  const ripe = crypto.createHash('ripemd160').update(sha).digest();
  return new Uint8Array(ripe);
}

/**
 * Parses an extended public key (xpub, ypub, zpub, Ltub)
 */
export function parseExtendedKey(keyStr: string): HDKey {
  const clean = keyStr.trim();
  const prefix = clean.slice(0, 4);
  const version = VERSIONS[prefix] || VERSIONS.xpub;
  return HDKey.fromExtendedKey(clean, version);
}

/**
 * Derives a Bitcoin Native SegWit address (bc1q...) from a BIP84 zpub or xpub.
 * Path: m/0/index
 */
export function deriveBtcAddress(extendedPubKey: string, index: number): string {
  const cleanKey = extendedPubKey.trim();
  if (cleanKey.startsWith('bc1') || cleanKey.startsWith('1') || cleanKey.startsWith('3')) {
    return cleanKey;
  }

  try {
    const hdkey = parseExtendedKey(cleanKey);
    const child = hdkey.deriveChild(0).deriveChild(index);
    if (!child.publicKey) throw new Error('Failed to derive public key');

    const pubKeyHash = hash160(child.publicKey);
    const words = bech32.toWords(pubKeyHash);
    return bech32.encode('bc', [0, ...words]);
  } catch (error) {
    console.error(`[BIP32] Error deriving BTC address at index ${index}:`, error);
    throw new Error(`Invalid Bitcoin extended public key (zpub/xpub): ${error}`);
  }
}

/**
 * Derives a Litecoin Native SegWit address (ltc1...) from an extended public key.
 * Path: m/0/index
 */
export function deriveLtcAddress(extendedPubKey: string, index: number): string {
  const cleanKey = extendedPubKey.trim();
  if (cleanKey.startsWith('ltc1') || cleanKey.startsWith('L') || cleanKey.startsWith('M')) {
    return cleanKey;
  }

  try {
    const hdkey = parseExtendedKey(cleanKey);
    const child = hdkey.deriveChild(0).deriveChild(index);
    if (!child.publicKey) throw new Error('Failed to derive public key');

    const pubKeyHash = hash160(child.publicKey);
    const words = bech32.toWords(pubKeyHash);
    return bech32.encode('ltc', [0, ...words]);
  } catch (error) {
    console.error(`[BIP32] Error deriving LTC address at index ${index}:`, error);
    throw new Error(`Invalid Litecoin extended public key: ${error}`);
  }
}

/**
 * Derives an EVM address (0x...) from an extended public key.
 */
export function deriveEvmAddress(extendedPubKey: string, index: number): string {
  const cleanKey = extendedPubKey.trim();
  if (cleanKey.startsWith('0x') && cleanKey.length === 42) {
    return cleanKey;
  }

  try {
    const hdkey = parseExtendedKey(cleanKey);
    const child = hdkey.deriveChild(0).deriveChild(index);
    if (!child.publicKey) throw new Error('Failed to derive public key');

    const pub = Buffer.from(child.publicKey);
    const hash = crypto.createHash('sha256').update(pub).digest();
    return `0x${hash.slice(-20).toString('hex')}`;
  } catch (error) {
    console.error(`[BIP32] Error deriving EVM address at index ${index}:`, error);
    throw new Error(`Invalid EVM extended public key: ${error}`);
  }
}

/**
 * Master dispatcher to derive address for any supported crypto asset.
 */
export function deriveAddressForAsset(assetId: string, merchantKeyOrAddress: string, index: number): string {
  const key = merchantKeyOrAddress.trim();
  switch (assetId) {
    case 'btc':
      return deriveBtcAddress(key, index);
    case 'ltc':
      return deriveLtcAddress(key, index);
    case 'usdc_ethereum':
    case 'usdc_base':
    case 'usdc_polygon':
      return deriveEvmAddress(key, index);
    case 'sol':
    case 'usdc_solana':
    default:
      return key;
  }
}
