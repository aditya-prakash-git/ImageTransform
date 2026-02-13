export interface ImageRecord {
  id: string;
  originalKey: string;
  processedKey: string;
  originalUrl: string;
  processedUrl: string;
  createdAt: string;
  status: "processing" | "completed" | "failed";
}

export interface UploadResponse {
  success: boolean;
  data?: ImageRecord;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
