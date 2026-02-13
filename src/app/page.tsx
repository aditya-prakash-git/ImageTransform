"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/upload-zone";
import { ProcessingStatus } from "@/components/processing-status";
import { ImageResult } from "@/components/image-result";
import { ErrorDisplay } from "@/components/error-display";
import { ImageGallery } from "@/components/image-gallery";
import type { ImageRecord } from "@/lib/types";

type AppState = "idle" | "uploading" | "processing" | "completed" | "error";

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>("idle");
  const [imageRecord, setImageRecord] = useState<ImageRecord | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const resetState = () => {
    setCurrentState("idle");
    setImageRecord(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalPreview(null);
    setErrorMessage("");
    setGalleryRefreshKey((k) => k + 1);
  };

  const handleUpload = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setOriginalPreview(preview);
    setCurrentState("processing");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Network error. Please check your connection.");
      }

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

  const handleGallerySelect = (record: ImageRecord) => {
    setImageRecord(record);
    setOriginalPreview(record.originalUrl);
    setCurrentState("completed");
  };

  const handleGalleryDelete = async (id: string) => {
    const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Delete failed");
    }

    toast.success("Image deleted");
    setGalleryRefreshKey((k) => k + 1);
  };

  return (
    <div className="transition-all duration-500">
      {/* Hero text - only on idle */}
      {currentState === "idle" && (
        <div className="text-center mb-10 animate-in fade-in duration-500">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Transform your images{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              in seconds
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">
            Remove backgrounds and flip images with AI. Get a hosted URL
            instantly.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["AI Background Removal", "Horizontal Flip", "Cloud Hosted URL"].map(
              (feature) => (
                <span
                  key={feature}
                  className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 text-muted-foreground"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {currentState === "idle" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UploadZone onUpload={handleUpload} />
          <ImageGallery
            refreshKey={galleryRefreshKey}
            onSelect={handleGallerySelect}
            onDelete={handleGalleryDelete}
          />
        </div>
      )}

      {currentState === "processing" && (
        <div className="animate-in fade-in duration-300">
          <ProcessingStatus />
        </div>
      )}

      {currentState === "completed" && imageRecord && originalPreview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
