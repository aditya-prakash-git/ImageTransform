"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";

const STEPS = [
  "Uploading image...",
  "Removing background...",
  "Flipping image...",
  "Finalizing...",
];

const STEP_INTERVAL = 2500;

export function ProcessingStatus() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>

          <div className="w-full space-y-3">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              if (index > currentStep) return null;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isCompleted ? "opacity-60" : "opacity-100"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                  <span
                    className={`text-sm ${
                      isCurrent ? "font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This may take a few seconds...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
