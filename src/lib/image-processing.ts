import sharp from "sharp";
import { removeBackground } from "./background-removal";

export async function flipImageHorizontally(
  imageBuffer: Buffer
): Promise<Buffer> {
  console.log("[ImageProcessing] Flipping image horizontally...");
  const flipped = await sharp(imageBuffer).flop().png().toBuffer();
  console.log("[ImageProcessing] Flip complete");
  return flipped;
}

export async function processImage(
  imageBuffer: Buffer
): Promise<Buffer> {
  console.log("[ImageProcessing] Starting image processing pipeline...");

  const bgRemoved = await removeBackground(imageBuffer);
  const flipped = await flipImageHorizontally(bgRemoved);

  console.log("[ImageProcessing] Pipeline complete");
  return flipped;
}
