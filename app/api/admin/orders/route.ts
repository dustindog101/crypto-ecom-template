import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        paymentIntent: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status, paymentStatus, carrier, trackingNumber, adminNotes } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        carrier: carrier !== undefined ? carrier : undefined,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating admin order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
