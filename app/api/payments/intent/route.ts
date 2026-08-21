import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CryptoAssetId, CRYPTO_ASSETS } from '@/lib/payments/types';
import { getExchangeRate } from '@/lib/payments/rates';
import { deriveAddressForAsset } from '@/lib/payments/bip32Derive';
import { validateCryptoAddress } from '@/lib/payments/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, asset } = body as { orderId: string; asset: CryptoAssetId };

    if (!orderId || !asset || !CRYPTO_ASSETS[asset]) {
      return NextResponse.json({ error: 'Missing or invalid orderId/asset' }, { status: 400 });
    }

    // 1. Fetch Order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { paymentIntent: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    }

    // 2. Return existing active intent if same asset and not expired
    if (
      order.paymentIntent &&
      order.paymentIntent.asset === asset &&
      order.paymentIntent.status !== 'EXPIRED' &&
      order.paymentIntent.status !== 'CANCELLED' &&
      new Date(order.paymentIntent.expiresAt) > new Date()
    ) {
      return NextResponse.json({ intent: order.paymentIntent });
    }

    // 3. Fetch Merchant Gateway Settings
    const settings = await prisma.paymentSettings.findUnique({
      where: { id: 'site' },
    });

    const gateways = JSON.parse(settings?.paymentGateways || '{}');
    const gw = gateways[asset];

    if (!gw || !gw.enabled || (!gw.address && !gw.xpub)) {
      return NextResponse.json({ error: `Payment method ${asset} is not enabled or configured` }, { status: 400 });
    }

    const merchantKey = (gw.xpub || gw.address || '').trim();
    const currentIndex = typeof gw.nextIndex === 'number' ? gw.nextIndex : 0;

    // 4. Derive Unique Dedicated Address for this Order (BIP84 zpub / BIP44 xpub or static)
    let derivedAddress = merchantKey;
    let derivedIndex: number | null = null;

    if (merchantKey.startsWith('zpub') || merchantKey.startsWith('xpub') || merchantKey.startsWith('ypub') || merchantKey.startsWith('Ltub')) {
      derivedAddress = deriveAddressForAsset(asset, merchantKey, currentIndex);
      derivedIndex = currentIndex;

      // Increment next derivation index in settings
      gateways[asset].nextIndex = currentIndex + 1;
      await prisma.paymentSettings.update({
        where: { id: 'site' },
        data: { paymentGateways: JSON.stringify(gateways) },
      });
    }

    if (!validateCryptoAddress(asset, derivedAddress)) {
      return NextResponse.json({ error: `Derived address is invalid for ${asset}` }, { status: 500 });
    }

    // 5. Rate & Exact Amount Calculation (No atomic random offset required with unique address!)
    const rate = await getExchangeRate(asset);
    const assetMeta = CRYPTO_ASSETS[asset];
    const exactCrypto = (order.total / rate).toFixed(assetMeta.decimals);
    const multiplier = Math.pow(10, assetMeta.decimals);
    const exactAtomic = BigInt(Math.round(parseFloat(exactCrypto) * multiplier)).toString();

    const ttlHours = settings?.paymentIntentTtlHours || 48;
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    // 6. Create or Upsert Payment Intent
    const intent = await prisma.paymentIntent.upsert({
      where: { orderId: order.id },
      update: {
        asset,
        depositAddress: derivedAddress,
        addressIndex: derivedIndex,
        expectedAmount: exactCrypto,
        expectedAtomic: exactAtomic,
        baseTotalUsd: order.total,
        exchangeRate: rate,
        status: 'PENDING',
        expiresAt,
        txHash: null,
        confirmations: 0,
        confirmedAt: null,
      },
      create: {
        orderId: order.id,
        userId: order.userId,
        asset,
        depositAddress: derivedAddress,
        addressIndex: derivedIndex,
        expectedAmount: exactCrypto,
        expectedAtomic: exactAtomic,
        baseTotalUsd: order.total,
        exchangeRate: rate,
        status: 'PENDING',
        expiresAt,
      },
    });

    // Update order payment reference
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: `crypto:${asset}`,
        paymentIntentId: intent.id,
        cryptoAsset: asset,
        paymentExpiresAt: expiresAt,
      },
    });

    return NextResponse.json({ intent });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
