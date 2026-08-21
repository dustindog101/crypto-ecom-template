import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { SITE_CONFIG } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      guestEmail,
      guestContact,
      shippingAddress,
      shippingMethod,
      items,
      couponCode,
      cryptoAsset,
      customerNotes,
      resellerSlug,
      affiliateCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!guestEmail && !guestContact) {
      return NextResponse.json({ error: 'Please provide an email or contact handle' }, { status: 400 });
    }

    // 1. Calculate pricing securely on backend
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json({ error: `Variant not found: ${item.variantId}` }, { status: 400 });
      }

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        variantId: variant.id,
        productName: variant.product.name,
        variantName: variant.displayName,
        sku: variant.sku,
        unitPrice: variant.price,
        quantity: item.quantity,
        customValues: item.customValues ? JSON.stringify(item.customValues) : null,
      });
    }

    // 2. Coupon Validation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENT') {
          discountAmount = (subtotal * coupon.value) / 100;
        } else {
          discountAmount = Math.min(subtotal, coupon.value);
        }
      }
    }

    const shippingFee = shippingMethod === 'express' ? SITE_CONFIG.fees.expressShipping : SITE_CONFIG.fees.standardShipping;
    const handlingFee = SITE_CONFIG.fees.handlingFee;
    const total = Math.max(0, subtotal - discountAmount + shippingFee + handlingFee);

    // 3. Cryptographic Order Number & Tracking Code
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `ORD-${randomSuffix}`;
    const trackingCode = `TRK-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    // 4. Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        trackingCode,
        guestEmail: guestEmail || null,
        guestContact: guestContact || null,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        paymentMethod: cryptoAsset ? `crypto:${cryptoAsset}` : null,
        cryptoAsset: cryptoAsset || null,
        subtotal,
        discountAmount,
        shippingFee,
        handlingFee,
        total,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        shippingMethod: shippingMethod || 'standard',
        customerNotes: customerNotes || null,
        resellerSlug: resellerSlug || null,
        affiliateCode: affiliateCode || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode,
      total: order.total,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
