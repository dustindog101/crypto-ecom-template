import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';
import { getExchangeRate } from '@/lib/payments/rates';

export async function GET() {
  try {
    const settings = await prisma.paymentSettings.findUnique({
      where: { id: 'site' },
    });

    if (!settings) {
      return NextResponse.json({ methods: [], enabled: false });
    }

    const gateways: Record<string, { enabled: boolean; address: string }> = JSON.parse(settings.paymentGateways || '{}');
    const enabledMethods = [];

    for (const [id, meta] of Object.entries(CRYPTO_ASSETS)) {
      const gw = gateways[id];
      if (gw && gw.enabled && gw.address) {
        try {
          const rate = await getExchangeRate(id as CryptoAssetId);
          enabledMethods.push({
            id: meta.id,
            name: meta.name,
            symbol: meta.symbol,
            network: meta.network,
            exchangeRate: rate,
            minConfirmations: meta.minConfirmations,
          });
        } catch (e) {
          console.warn(`Failed to fetch rate for ${id}:`, e);
        }
      }
    }

    return NextResponse.json({
      methods: enabledMethods,
      enabled: enabledMethods.length > 0,
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}
