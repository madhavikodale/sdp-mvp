"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MiniChartProps {
  data: Array<{ label: string; value: number }>;
  color?: string;
  height?: number;
  showAxis?: boolean;
}

export function MiniChart({
  data,
  color = "#6366f1",
  height = 80,
  showAxis = false,
}: MiniChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showAxis && (
            <>
              <XAxis dataKey="label" hide />
              <YAxis hide />
            </>
          )}
          <Tooltip
            contentStyle={{
              background: "rgba(15, 15, 22, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f0f0f5",
            }}
            itemStyle={{ color: "#f0f0f5" }}
            labelStyle={{ display: "none" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color.replace("#", "")})`}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
