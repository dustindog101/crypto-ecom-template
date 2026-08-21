import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trackingCode } = await req.json();
    if (!trackingCode) {
      return NextResponse.json({ error: 'Tracking code is required' }, { status: 400 });
    }

    const cleanCode = trackingCode.trim().toUpperCase();

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { trackingCode: cleanCode },
          { orderNumber: cleanCode },
        ],
      },
      include: {
        items: true,
        paymentIntent: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found for this tracking code' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingCode: order.trackingCode,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        createdAt: order.createdAt,
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
        items: order.items.map((i) => ({
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        paymentIntent: order.paymentIntent
          ? {
              status: order.paymentIntent.status,
              asset: order.paymentIntent.asset,
              txHash: order.paymentIntent.txHash,
              confirmations: order.paymentIntent.confirmations,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
