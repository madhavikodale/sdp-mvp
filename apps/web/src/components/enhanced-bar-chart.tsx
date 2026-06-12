"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedBarChartProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; color?: string }[];
  };
  className?: string;
}

export function EnhancedBarChart({ data, className = "" }: EnhancedBarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ label: string; dataset: string; value: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const maxValue = Math.max(...data.datasets.flatMap((d) => d.data));
  const visibleLabels = data.labels.slice(-12);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className={cn("relative", className)} onMouseMove={handleMouseMove}>
      <div className="space-y-2">
        {visibleLabels.map((label, i) => {
          const idx = data.labels.length - 12 + i;
          const total = data.datasets.reduce((sum, d) => sum + d.data[idx], 0);

          return (
            <div key={label} className="flex items-center gap-3 group">
              <span className="w-8 text-xs text-white/40 shrink-0">{label}</span>
              <div className="flex-1 h-7 bg-white/[0.03] rounded-md overflow-hidden flex relative">
                {data.datasets.map((dataset, di) => {
                  const value = dataset.data[idx];
                  const width = maxValue > 0 ? (value / maxValue) * 100 : 0;

                  return (
                    <div
                      key={di}
                      className="h-full transition-all duration-500 ease-out cursor-pointer hover:brightness-125"
                      style={{
                        width: `${width}%`,
                        backgroundColor: dataset.color || "#6366f1",
                        opacity: 0.7 + di * 0.1,
                        animationDelay: `${i * 30}ms`,
                      }}
                      onMouseEnter={() =>
                        setHoveredBar({ label, dataset: dataset.label, value })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                  );
                })}
              </div>
              <span className="w-14 text-xs text-white/50 text-right shrink-0 tabular-nums">
                {(total / 1000).toFixed(0)}k
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredBar && (
        <div
          className="absolute z-50 pointer-events-none px-3 py-2 rounded-lg border border-white/[0.1] bg-[#0f0f16]/95 backdrop-blur-sm text-xs shadow-xl"
          style={{
            left: Math.min(mousePos.x + 12, 300),
            top: mousePos.y - 40,
          }}
        >
          <div className="text-white/60 mb-0.5">{hoveredBar.label}</div>
          <div className="font-medium text-white">
            {hoveredBar.dataset}: {hoveredBar.value.toLocaleString()}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 pt-3 mt-2 border-t border-white/[0.06]">
        {data.datasets.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-white/50">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
