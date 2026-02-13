import axios from "axios";

const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";

export async function removeBackground(
  imageBuffer: Buffer
): Promise<Buffer> {
  console.log("[BackgroundRemoval] Sending image to remove.bg API...");

  const formData = new FormData();
  formData.append(
    "image_file",
    new Blob([new Uint8Array(imageBuffer)]),
    "image.png"
  );
  formData.append("size", "auto");
  formData.append("type", "auto");

  try {
    const response = await axios.post(REMOVE_BG_API_URL, formData, {
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
      },
      responseType: "arraybuffer",
    });

    console.log("[BackgroundRemoval] Background removed successfully");
    return Buffer.from(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 429) {
        throw new Error(
          "Background removal rate limit exceeded. Please try again later."
        );
      }
      if (status === 400) {
        throw new Error(
          "Invalid image provided for background removal."
        );
      }
      if (status === 402) {
        throw new Error(
          "Background removal API credits exhausted."
        );
      }

      const message =
        error.response?.data
          ? Buffer.from(error.response.data).toString()
          : error.message;
      throw new Error(`Background removal failed (${status}): ${message}`);
    }

    throw new Error(`Background removal failed: ${String(error)}`);
  }
}
