"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Download,
  Trash2,
  RotateCcw,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { ImageRecord } from "@/lib/types";

interface ImageResultProps {
  imageRecord: ImageRecord;
  originalPreview: string;
  onDelete: (id: string) => Promise<void>;
  onReset: () => void;
}

export function ImageResult({
  imageRecord,
  originalPreview,
  onDelete,
  onReset,
}: ImageResultProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(imageRecord.processedUrl);
      toast.success("URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(imageRecord.id);
      setDialogOpen(false);
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Success badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-700">
            Transformation complete
          </span>
        </div>
      </div>

      {/* Comparison */}
      <div className="glass-strong rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
          {/* Original */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Original</h3>
            </div>
            <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-muted/30 shadow-sm">
              <img
                src={originalPreview}
                alt="Original uploaded image"
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Processed */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Processed</h3>
              <Badge className="text-[10px] bg-gradient-to-r from-primary to-purple-500 text-white border-0 shadow-sm">
                BG Removed + Flipped
              </Badge>
            </div>
            <div className="relative group rounded-xl overflow-hidden border border-border/50 shadow-sm bg-[repeating-conic-gradient(#f1f1f1_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
              <img
                src={imageRecord.processedUrl}
                alt="Processed image with background removed and flipped"
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="font-mono text-[10px] bg-muted/50">
            ID: {imageRecord.id}
          </Badge>
          <a
            href={imageRecord.processedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-xs truncate max-w-xs"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{imageRecord.processedUrl}</span>
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          size="sm"
          onClick={handleCopyUrl}
          className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy URL
        </Button>

        <Button variant="outline" size="sm" asChild className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <a
            href={imageRecord.processedUrl}
            download={`processed-${imageRecord.id}.png`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong !rounded-2xl">
            <DialogHeader>
              <DialogTitle>Delete image?</DialogTitle>
              <DialogDescription>
                Are you sure? This will permanently delete both the original and
                processed images. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Upload Another
        </Button>
      </div>
    </div>
  );
}
