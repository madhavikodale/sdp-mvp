"use client";

import { cn } from "@/lib/utils";

export type TimeRange = "24h" | "7d" | "30d";

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const ranges: { value: TimeRange; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
];

export function TimeRangeToggle({ value, onChange, className = "" }: TimeRangeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5 backdrop-blur-sm",
        className
      )}
    >
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "relative rounded-md px-3 py-1 text-xs font-medium transition-all duration-200",
            value === range.value
              ? "text-white"
              : "text-white/40 hover:text-white/70"
          )}
        >
          {value === range.value && (
            <span className="absolute inset-0 rounded-md bg-white/[0.08]" />
          )}
          <span className="relative">{range.label}</span>
        </button>
      ))}
    </div>
  );
}
