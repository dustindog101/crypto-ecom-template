import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'crypto-ecom-assets';

export function getStorageClient(): S3Client | null {
  if (!accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: 'auto',
    endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 300
): Promise<string | null> {
  const client = getStorageClient();
  if (!client) return null;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export async function createPresignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 900
): Promise<string | null> {
  const client = getStorageClient();
  if (!client) return null;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
