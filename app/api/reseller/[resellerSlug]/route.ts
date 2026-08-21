import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resellerSlug: string }> }
) {
  try {
    const { resellerSlug } = await params;
    const profile = await prisma.resellerProfile.findUnique({
      where: { slug: resellerSlug },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!profile || !profile.isActive) {
      return NextResponse.json({ error: 'Reseller storefront not found' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      reseller: {
        businessName: profile.businessName,
        slug: profile.slug,
        branding: profile.brandingJson ? JSON.parse(profile.brandingJson) : null,
      },
      products,
    });
  } catch (error) {
    console.error('Error fetching reseller portal:', error);
    return NextResponse.json({ error: 'Failed to fetch reseller portal' }, { status: 500 });
  }
}
