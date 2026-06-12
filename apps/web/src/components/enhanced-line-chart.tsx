"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedLineChartProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; color?: string }[];
  };
  className?: string;
}

export function EnhancedLineChart({ data, className = "" }: EnhancedLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; dataset: string; value: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const maxValue = Math.max(...data.datasets.flatMap((d) => d.data));
  const minValue = Math.min(...data.datasets.flatMap((d) => d.data));
  const range = maxValue - minValue || 1;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className={cn("relative", className)} onMouseMove={handleMouseMove}>
      <svg viewBox="0 0 300 130" className="w-full h-36">
        {/* Grid lines */}
        {[0, 1, 2, 3].map((i) => {
          const y = 110 - i * 30;
          return (
            <line
              key={i}
              x1="10"
              y1={y}
              x2="290"
              y2={y}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          );
        })}

        {data.datasets.map((dataset, di) => {
          const points = dataset.data.map((value, i) => {
            const x = (i / (dataset.data.length - 1)) * 280 + 10;
            const y = 110 - ((value - minValue) / range) * 100;
            return { x, y, value, label: data.labels[i] };
          });

          const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

          return (
            <g key={di}>
              {/* Area fill */}
              <polygon
                fill={dataset.color || "#6366f1"}
                opacity={0.05}
                points={`${points[0].x},110 ${linePoints} ${points[points.length - 1].x},110`}
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke={dataset.color || "#6366f1"}
                strokeWidth="2"
                points={linePoints}
                opacity={0.8}
                className="transition-all duration-500"
              />
              {/* Points */}
              {points.map((p, pi) => (
                <circle
                  key={pi}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill={dataset.color || "#6366f1"}
                  opacity={0}
                  className="transition-opacity duration-200 hover:opacity-100 cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPoint({ label: p.label, dataset: dataset.label, value: p.value })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-50 pointer-events-none px-3 py-2 rounded-lg border border-white/[0.1] bg-[#0f0f16]/95 backdrop-blur-sm text-xs shadow-xl"
          style={{
            left: Math.min(mousePos.x + 12, 250),
            top: mousePos.y - 50,
          }}
        >
          <div className="text-white/60 mb-0.5">{hoveredPoint.label}</div>
          <div className="font-medium text-white">
            {hoveredPoint.dataset}: {hoveredPoint.value}ms
          </div>
        </div>
      )}

      <div className="flex justify-between text-xs text-white/40 px-2">
        <span>{data.labels[0]}</span>
        <span>{data.labels[data.labels.length - 1]}</span>
      </div>

      <div className="flex gap-4 pt-2 mt-1 border-t border-white/[0.06]">
        {data.datasets.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-0.5 w-4" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-white/50">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
