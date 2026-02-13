import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { uploadToR2 } from "@/lib/storage";
import { processImage } from "@/lib/image-processing";
import { saveRecord } from "@/lib/metadata";
import { ImageRecord, UploadResponse } from "@/lib/types";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
  };
  return map[mimeType] || "png";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json<UploadResponse>(
        {
          success: false,
          error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: "File size exceeds 10MB limit" },
        { status: 413 }
      );
    }

    const id = nanoid();
    const ext = getExtension(file.type);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`[Upload] Processing image ${id} (${file.name}, ${file.type}, ${file.size} bytes)`);

    // Upload original to R2
    const originalKey = `originals/${id}.${ext}`;
    const originalUrl = await uploadToR2(buffer, originalKey, file.type);

    // Process image (remove background + flip)
    console.log(`[Upload] Starting image processing for ${id}...`);
    const processedBuffer = await processImage(buffer);

    // Upload processed image to R2
    const processedKey = `processed/${id}.png`;
    const processedUrl = await uploadToR2(processedBuffer, processedKey, "image/png");

    // Save metadata record
    const record: ImageRecord = {
      id,
      originalKey,
      processedKey,
      originalUrl,
      processedUrl,
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    saveRecord(record);
    console.log(`[Upload] Complete for ${id}`);

    return NextResponse.json<UploadResponse>(
      { success: true, data: record },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json<UploadResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
