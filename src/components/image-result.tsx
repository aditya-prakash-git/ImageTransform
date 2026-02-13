"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
      toast.success("URL copied!");
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Original</h3>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                <img
                  src={originalPreview}
                  alt="Original uploaded image"
                  className="w-full h-auto max-h-80 object-contain"
                />
              </div>
            </div>

            {/* Processed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Processed</h3>
                <Badge variant="secondary" className="text-xs">
                  BG Removed + Flipped
                </Badge>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
                <img
                  src={imageRecord.processedUrl}
                  alt="Processed image with background removed and flipped"
                  className="w-full h-auto max-h-80 object-contain"
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Image info */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono text-xs">
              {imageRecord.id}
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
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" size="sm" onClick={handleCopyUrl}>
          <Copy className="w-4 h-4 mr-2" />
          Copy URL
        </Button>

        <Button variant="outline" size="sm" asChild>
          <a href={imageRecord.processedUrl} download={`processed-${imageRecord.id}.png`}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
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

        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Upload Another
        </Button>
      </div>
    </div>
  );
}
