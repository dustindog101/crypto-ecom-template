import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { paymentIntent: true },
    });

    if (!order || !order.paymentIntent) {
      return NextResponse.json({ error: 'Order or payment intent not found' }, { status: 404 });
    }

    const intent = order.paymentIntent;

    // Check if expired
    if (new Date(intent.expiresAt) < new Date() && intent.status === 'PENDING') {
      await prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json({ status: 'EXPIRED', intent });
    }

    // Return current DB status
    return NextResponse.json({
      status: intent.status,
      confirmations: intent.confirmations,
      requiredConfirmations: CRYPTO_ASSETS[intent.asset as CryptoAssetId]?.minConfirmations || 1,
      txHash: intent.txHash,
      intent,
    });
  } catch (error) {
    console.error('Error polling payment status:', error);
    return NextResponse.json({ error: 'Failed to poll payment status' }, { status: 500 });
  }
}
