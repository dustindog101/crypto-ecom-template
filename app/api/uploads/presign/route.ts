import { NextRequest, NextResponse } from 'next/server';
import { createPresignedUploadUrl } from '@/lib/storage/r2Client';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/zip',
];

export async function POST(req: NextRequest) {
  try {
    const { contentType, prefix = 'custom-orders' } = await req.json();

    if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType)) {
      return NextResponse.json({ error: 'Unsupported file MIME type' }, { status: 400 });
    }

    const ext = contentType.split('/')[1] || 'bin';
    const randomName = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    const key = `${prefix}/${new Date().toISOString().slice(0, 10)}/${randomName}`;

    const presignedUrl = await createPresignedUploadUrl(key, contentType, 300);

    if (!presignedUrl) {
      // Mock mode fallback when R2 credentials are not set locally
      return NextResponse.json({
        mock: true,
        key: `mock-uploads/${randomName}`,
        uploadUrl: `/api/uploads/mock?key=${randomName}`,
        publicUrl: `https://placeholder-assets.local/${randomName}`,
      });
    }

    return NextResponse.json({
      key,
      uploadUrl: presignedUrl,
      publicUrl: process.env.R2_PUBLIC_DOMAIN ? `https://${process.env.R2_PUBLIC_DOMAIN}/${key}` : undefined,
    });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
