import { NextResponse } from "next/server";
import { getAllRecords } from "@/lib/metadata";

export async function GET() {
  try {
    const records = getAllRecords();
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("[ListImages] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
