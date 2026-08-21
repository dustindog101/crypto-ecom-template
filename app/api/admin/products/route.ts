import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, category, categoryLabel, description, longDescription, featured, isDigital, variants, customSchema } = body;

    if (!name || !slug || !category || !variants || variants.length === 0) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        category,
        categoryLabel: categoryLabel || category,
        description,
        longDescription,
        featured: Boolean(featured),
        isDigital: Boolean(isDigital),
        customSchema: customSchema ? JSON.stringify(customSchema) : null,
        variants: {
          create: variants.map((v: any, index: number) => ({
            displayName: v.displayName,
            sku: v.sku || `${slug.toUpperCase()}-${index + 1}`,
            price: parseFloat(v.price),
            stockQty: parseInt(v.stockQty || '100', 10),
            inStock: v.inStock !== false,
            sortOrder: index + 1,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
