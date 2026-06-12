"use client";

import { cn } from "@/lib/utils";

interface HealthRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function HealthRing({
  score,
  size = 48,
  strokeWidth = 4,
  className = "",
}: HealthRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span
        className="absolute text-xs font-bold tabular-nums"
        style={{ color }}
      >
        {Math.round(score)}
      </span>
    </div>
  );
}

export function HealthBadge({ score }: { score: number }) {
  const config =
    score >= 80
      ? { label: "Healthy", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
      : score >= 60
        ? { label: "Degraded", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
        : { label: "Critical", className: "bg-rose-500/10 text-rose-400 border-rose-500/20" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          score >= 80
            ? "bg-emerald-400"
            : score >= 60
              ? "bg-amber-400"
              : "bg-rose-400"
        )}
      />
      {config.label}
    </span>
  );
}
