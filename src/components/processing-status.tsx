"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Uploading image", icon: "upload" },
  { label: "Removing background", icon: "wand" },
  { label: "Flipping image", icon: "flip" },
  { label: "Finalizing", icon: "check" },
];

const STEP_INTERVAL = 2500;
const SLOW_THRESHOLD = 30000;

export function ProcessingStatus() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_INTERVAL);

    const slowTimer = setTimeout(() => {
      setShowSlowMessage(true);
    }, SLOW_THRESHOLD);

    return () => {
      clearInterval(interval);
      clearTimeout(slowTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Orbital spinner */}
      <div className="relative w-28 h-28">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/50 animate-spin" style={{ animationDuration: "1.5s" }} />
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-orbit">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-purple-500 shadow-lg shadow-primary/50" />
        </div>
        {/* Center icon area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="glass-strong rounded-2xl p-6 w-full max-w-sm shadow-xl shadow-primary/5">
        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            if (index > currentStep) return null;

            return (
              <div
                key={step.label}
                className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-purple-500 animate-pulse" />
                  </div>
                )}
                <span
                  className={`text-sm transition-all duration-300 ${
                    isCurrent
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                  {isCurrent && (
                    <span className="inline-flex ml-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        {showSlowMessage
          ? "This is taking longer than usual. Large images may take more time."
          : "Your image is being processed with AI. This usually takes a few seconds."}
      </p>
    </div>
  );
}
