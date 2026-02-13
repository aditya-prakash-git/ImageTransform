"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/upload-zone";
import { ProcessingStatus } from "@/components/processing-status";
import { ImageResult } from "@/components/image-result";
import { ErrorDisplay } from "@/components/error-display";
import type { ImageRecord } from "@/lib/types";

type AppState = "idle" | "uploading" | "processing" | "completed" | "error";

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>("idle");
  const [imageRecord, setImageRecord] = useState<ImageRecord | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const resetState = () => {
    setCurrentState("idle");
    setImageRecord(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalPreview(null);
    setErrorMessage("");
  };

  const handleUpload = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setOriginalPreview(preview);
    setCurrentState("uploading");

    const formData = new FormData();
    formData.append("image", file);

    setCurrentState("processing");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setImageRecord(result.data);
      setCurrentState("completed");
      toast.success("Image processed successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setErrorMessage(message);
      setCurrentState("error");
      toast.error("Processing failed");
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Delete failed");
    }

    toast.success("Image deleted");
    resetState();
  };

  return (
    <div className="transition-all duration-300">
      {currentState === "idle" && (
        <div className="animate-in fade-in duration-300">
          <UploadZone onUpload={handleUpload} />
        </div>
      )}

      {(currentState === "uploading" || currentState === "processing") && (
        <div className="animate-in fade-in duration-300">
          <ProcessingStatus />
        </div>
      )}

      {currentState === "completed" && imageRecord && originalPreview && (
        <div className="animate-in fade-in duration-500">
          <ImageResult
            imageRecord={imageRecord}
            originalPreview={originalPreview}
            onDelete={handleDelete}
            onReset={resetState}
          />
        </div>
      )}

      {currentState === "error" && (
        <div className="animate-in fade-in duration-300">
          <ErrorDisplay message={errorMessage} onRetry={resetState} />
        </div>
      )}
    </div>
  );
}
