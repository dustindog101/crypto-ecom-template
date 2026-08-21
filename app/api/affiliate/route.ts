import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code') || 'VIP2026';

    const profile = await prisma.affiliateProfile.findUnique({
      where: { code },
      include: { payoutRequests: true },
    });

    if (!profile) {
      return NextResponse.json({
        profile: {
          code,
          commissionRate: 10.0,
          totalEarned: 0,
          totalPaid: 0,
          pendingBalance: 0,
          payoutRequests: [],
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching affiliate:', error);
    return NextResponse.json({ error: 'Failed to fetch affiliate profile' }, { status: 500 });
  }
}
