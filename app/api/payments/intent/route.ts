import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CryptoAssetId, CRYPTO_ASSETS } from '@/lib/payments/types';
import { getExchangeRate } from '@/lib/payments/rates';
import { computeUniqueAmount } from '@/lib/payments/amounts';
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

    // 3. Fetch Settings for Merchant Deposit Address
    const settings = await prisma.paymentSettings.findUnique({
      where: { id: 'site' },
    });

    const gateways = JSON.parse(settings?.paymentGateways || '{}');
    const gw = gateways[asset];

    if (!gw || !gw.enabled || !gw.address) {
      return NextResponse.json({ error: `Payment method ${asset} is not configured` }, { status: 400 });
    }

    const depositAddress = gw.address.trim();
    if (!validateCryptoAddress(asset, depositAddress)) {
      return NextResponse.json({ error: 'Configured deposit address is invalid' }, { status: 500 });
    }

    // 4. Rate & Unique Amount Calculation with Collision Avoidance
    const rate = await getExchangeRate(asset);
    
    // Query active intents on same deposit address to avoid atomic collisions
    const activeIntents = await prisma.paymentIntent.findMany({
      where: {
        depositAddress,
        status: { in: ['PENDING', 'DETECTED'] },
        expiresAt: { gt: new Date() },
      },
      select: { expectedAtomic: true },
    });

    const pendingAtomics = new Set(activeIntents.map((i) => i.expectedAtomic));
    const uniqueResult = computeUniqueAmount(order.total, rate, asset, pendingAtomics);

    const ttlHours = settings?.paymentIntentTtlHours || 48;
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    // 5. Create or Upsert Payment Intent
    const intent = await prisma.paymentIntent.upsert({
      where: { orderId: order.id },
      update: {
        asset,
        depositAddress,
        expectedAmount: uniqueResult.expectedAmount,
        expectedAtomic: uniqueResult.expectedAtomic,
        uniqueSuffix: uniqueResult.uniqueSuffix,
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
        depositAddress,
        expectedAmount: uniqueResult.expectedAmount,
        expectedAtomic: uniqueResult.expectedAtomic,
        uniqueSuffix: uniqueResult.uniqueSuffix,
        baseTotalUsd: order.total,
        exchangeRate: rate,
        status: 'PENDING',
        expiresAt,
      },
    });

    // Update order payment method reference
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
