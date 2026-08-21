import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';
import { validateCryptoAddress } from '@/lib/payments/validation';

export async function GET() {
  try {
    const settings = await prisma.paymentSettings.findUnique({
      where: { id: 'site' },
    });

    const activeIntents = await prisma.paymentIntent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        order: {
          select: { orderNumber: true, total: true },
        },
      },
    });

    const gateways = JSON.parse(settings?.paymentGateways || '{}');

    return NextResponse.json({
      gateways,
      paymentIntentTtlHours: settings?.paymentIntentTtlHours || 48,
      intents: activeIntents,
    });
  } catch (error) {
    console.error('Error fetching admin payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { gateways, paymentIntentTtlHours } = await req.json();

    // Validate addresses
    for (const [assetId, gw] of Object.entries(gateways as Record<string, any>)) {
      if (gw.enabled && gw.address) {
        if (!validateCryptoAddress(assetId as CryptoAssetId, gw.address.trim())) {
          return NextResponse.json({ error: `Invalid deposit address for ${assetId}` }, { status: 400 });
        }
      }
    }

    const updated = await prisma.paymentSettings.upsert({
      where: { id: 'site' },
      update: {
        paymentGateways: JSON.stringify(gateways),
        paymentIntentTtlHours: paymentIntentTtlHours || 48,
      },
      create: {
        id: 'site',
        paymentGateways: JSON.stringify(gateways),
        paymentIntentTtlHours: paymentIntentTtlHours || 48,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Error updating admin payments:', error);
    return NextResponse.json({ error: 'Failed to update payment settings' }, { status: 500 });
  }
}
