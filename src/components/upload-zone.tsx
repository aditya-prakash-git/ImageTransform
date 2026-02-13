"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadZoneProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0] as { errors: { code: string }[] };
      const err = rejection.errors[0];
      if (err.code === "file-too-large") {
        setError("File is too large. Maximum size is 10MB.");
      } else if (err.code === "file-invalid-type") {
        setError("Invalid file type. Please use PNG, JPEG, or WebP.");
      } else {
        setError("Invalid file. Please try again.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
    disabled,
  });

  const clearSelection = () => {
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  if (selectedFile && preview) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-sm">
            <img
              src={preview}
              alt="Selected file preview"
              className="w-full h-auto max-h-64 object-contain rounded-lg border border-border"
            />
            <button
              onClick={clearSelection}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80 transition-opacity"
              aria-label="Remove selected file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileImage className="w-4 h-4" />
            <span>{selectedFile.name}</span>
            <span className="text-xs">({formatFileSize(selectedFile.size)})</span>
          </div>

          <Button onClick={handleSubmit} disabled={disabled} size="lg">
            <Upload className="w-4 h-4 mr-2" />
            Upload &amp; Process
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card
        {...getRootProps()}
        className={`p-12 border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`rounded-full p-4 transition-colors ${
              isDragActive ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <Upload
              className={`w-8 h-8 ${
                isDragActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>

          {isDragActive ? (
            <p className="text-lg font-medium text-primary">
              Drop your image here
            </p>
          ) : (
            <>
              <div>
                <p className="text-lg font-medium">
                  Drag &amp; drop your image here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPEG, or WebP up to 10MB
                </p>
              </div>
              <Button variant="outline" size="sm" type="button">
                Browse Files
              </Button>
            </>
          )}
        </div>
      </Card>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
