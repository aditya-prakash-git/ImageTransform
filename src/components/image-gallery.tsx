"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Trash2, Sparkles } from "lucide-react";
import type { ImageRecord } from "@/lib/types";

interface ImageGalleryProps {
  refreshKey: number;
  onSelect: (record: ImageRecord) => void;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function ImageGallery({
  refreshKey,
  onSelect,
  onDelete,
}: ImageGalleryProps) {
  const [records, setRecords] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, refreshKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTarget);
      setDeleteTarget(null);
      fetchRecords();
    } catch {
      // Error handled by parent
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || records.length === 0) return null;

  return (
    <div className="mt-14">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Recent Transformations</h2>
          <p className="text-xs text-muted-foreground">
            Your processed images
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-primary to-purple-500 text-white border-0 text-[10px] shadow-sm">
          {records.length}
        </Badge>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 perspective">
        {records.map((record, i) => (
          <div
            key={record.id}
            className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 preserve-3d animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${i * 75}ms` }}
          >
            {/* Image */}
            <div className="aspect-[4/3] bg-[repeating-conic-gradient(#f1f1f1_0%_25%,transparent_0%_50%)] bg-[length:12px_12px]">
              <img
                src={record.processedUrl}
                alt={`Processed image ${record.id}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
              <div className="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  size="sm"
                  className="h-8 bg-white/90 text-foreground hover:bg-white shadow-lg text-xs"
                  onClick={() => onSelect(record)}
                  aria-label={`View image ${record.id}`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 text-destructive hover:bg-white hover:text-destructive shadow-lg"
                  onClick={() => setDeleteTarget(record.id)}
                  aria-label={`Delete image ${record.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Date badge */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                {formatDate(record.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="glass-strong !rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete image?</DialogTitle>
            <DialogDescription>
              This will permanently delete both the original and processed
              images. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
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
    </div>
  );
}
