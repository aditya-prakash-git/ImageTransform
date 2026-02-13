"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <Card className="max-w-md mx-auto border-destructive/50">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full p-3 bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>

          <div>
            <h3 className="font-medium text-lg">Processing Failed</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>

          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
