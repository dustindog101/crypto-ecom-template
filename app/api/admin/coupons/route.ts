import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching admin coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, discountType, value, minOrder, maxUses, isActive } = await req.json();

    if (!code || !discountType || value === undefined) {
      return NextResponse.json({ error: 'Missing required coupon fields' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        discountType,
        value: parseFloat(value),
        minOrder: minOrder ? parseFloat(minOrder) : 0,
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error creating admin coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
