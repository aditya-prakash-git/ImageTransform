import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  console.log(`[Storage] Uploading to R2: ${key}`);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicUrl = `${PUBLIC_URL}/${key}`;
  console.log(`[Storage] Upload complete: ${publicUrl}`);
  return publicUrl;
}

export async function deleteFromR2(key: string): Promise<void> {
  console.log(`[Storage] Deleting from R2: ${key}`);

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );

  console.log(`[Storage] Deleted: ${key}`);
}

export function generateKey(prefix: string, extension: string): string {
  const id = nanoid();
  return `${prefix}/${id}.${extension}`;
}
