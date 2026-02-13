"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};
const MAX_SIZE = 10 * 1024 * 1024;

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

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0] as {
          errors: { code: string }[];
        };
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
    },
    []
  );

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

  // File selected state
  if (selectedFile && preview) {
    return (
      <div>
        <div className="glass-strong rounded-2xl p-8 shadow-xl shadow-primary/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-sm group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <img
                src={preview}
                alt="Selected file preview"
                className="relative w-full h-auto max-h-72 object-contain rounded-xl border border-white/30 shadow-lg"
              />
              <button
                onClick={clearSelection}
                className="absolute -top-3 -right-3 bg-white shadow-lg border border-border/50 rounded-full p-1.5 hover:bg-destructive hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Remove selected file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileImage className="w-4 h-4" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={disabled}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 text-white border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Transform Image
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Dropzone state
  return (
    <div className="space-y-3 perspective">
      <div
        {...getRootProps()}
        className={`relative group rounded-2xl p-14 cursor-pointer transition-all duration-300 preserve-3d ${
          isDragActive
            ? "scale-[1.02] shadow-2xl shadow-primary/20"
            : "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Gradient border */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 p-[1px] transition-opacity duration-300 ${
            isDragActive
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-full h-full rounded-2xl bg-background/95" />
        </div>

        {/* Solid fallback border */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragActive
              ? "border-primary/50 opacity-0"
              : "border-muted-foreground/20 group-hover:opacity-0"
          }`}
        />

        {/* Inner content */}
        <div className="relative z-10">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-5 text-center">
            <div
              className={`relative rounded-2xl p-5 transition-all duration-300 ${
                isDragActive
                  ? "bg-primary/10 scale-110"
                  : "bg-gradient-to-br from-primary/5 to-purple-500/5 group-hover:from-primary/10 group-hover:to-purple-500/10"
              }`}
            >
              <Upload
                className={`w-10 h-10 transition-all duration-300 ${
                  isDragActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
              {isDragActive && (
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-pulse-ring" />
              )}
            </div>

            {isDragActive ? (
              <div>
                <p className="text-xl font-semibold text-primary">
                  Drop your image here
                </p>
                <p className="text-sm text-primary/60 mt-1">
                  Release to start transforming
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xl font-semibold">
                    Drop your image here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    PNG, JPEG, or WebP up to 10MB
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-border" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    or
                  </span>
                  <div className="h-px w-12 bg-border" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Browse Files
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
