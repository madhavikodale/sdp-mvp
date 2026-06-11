"use client";

import { cn } from "@/lib/utils";

interface StatusPulseProps {
  status: "online" | "offline" | "warning" | "processing";
  size?: "sm" | "md" | "lg";
  label?: string;
}

const statusColors = {
  online: "bg-emerald-500 shadow-emerald-500/50",
  offline: "bg-red-500 shadow-red-500/50",
  warning: "bg-amber-500 shadow-amber-500/50",
  processing: "bg-sdp-accent shadow-sdp-accent/50",
};

const sizeClasses = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-3 w-3",
};

export function StatusPulse({ status, size = "md", label }: StatusPulseProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            statusColors[status]
          )}
          style={{ animationDuration: "2s" }}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full shadow-lg",
            sizeClasses[size],
            statusColors[status]
          )}
        />
      </span>
      {label && (
        <span className="text-xs font-medium text-white/60">{label}</span>
      )}
    </div>
  );
}
