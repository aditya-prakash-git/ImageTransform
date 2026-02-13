import { NextRequest, NextResponse } from "next/server";
import { getRecord, deleteRecord } from "@/lib/metadata";
import { deleteFromR2 } from "@/lib/storage";
import { DeleteResponse } from "@/lib/types";

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

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("[GetImage] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = getRecord(id);

    if (!record) {
      return NextResponse.json<DeleteResponse>(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    // Delete both files from R2
    console.log(`[DeleteImage] Deleting files for ${id}...`);
    await Promise.all([
      deleteFromR2(record.originalKey),
      deleteFromR2(record.processedKey),
    ]);

    // Delete metadata
    deleteRecord(id);

    console.log(`[DeleteImage] Complete for ${id}`);
    return NextResponse.json<DeleteResponse>({
      success: true,
      message: `Image ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("[DeleteImage] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
