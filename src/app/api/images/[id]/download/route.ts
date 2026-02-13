import { NextRequest, NextResponse } from "next/server";
import { getRecord } from "@/lib/metadata";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = getRecord(id);

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    const response = await fetch(record.processedUrl);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch image" },
        { status: 502 }
      );
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", blob.type || "image/png");
    headers.set(
      "Content-Disposition",
      `attachment; filename="processed-${id}.png"`
    );

    return new NextResponse(blob, { status: 200, headers });
  } catch (error) {
    console.error("[Download] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
