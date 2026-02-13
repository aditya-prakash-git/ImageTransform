"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Error icon with rings */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-destructive/10 to-red-500/10 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-destructive/20 to-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6 max-w-sm w-full text-center shadow-xl shadow-destructive/5 border-destructive/10">
        <h3 className="font-semibold text-lg">Processing Failed</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {message}
        </p>
      </div>

      <Button
        onClick={onRetry}
        className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}
