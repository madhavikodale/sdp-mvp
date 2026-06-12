"use client";

import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniChart } from "./mini-chart";
import { AnimatedCounter } from "./animated-counter";
import { type ReactNode } from "react";

interface AnalyticsStatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: ReactNode;
  accent: "indigo" | "emerald" | "amber" | "violet" | "blue" | "purple" | "rose" | "cyan";
  change?: number;
  changeLabel?: string;
  sparklineData?: Array<{ label: string; value: number }>;
  inverseChange?: boolean;
}

const accentMap = {
  indigo: { bg: "from-indigo-500/20 to-indigo-500/5", text: "text-indigo-400", color: "#6366f1" },
  emerald: { bg: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400", color: "#10b981" },
  amber: { bg: "from-amber-500/20 to-amber-500/5", text: "text-amber-400", color: "#f59e0b" },
  violet: { bg: "from-violet-500/20 to-violet-500/5", text: "text-violet-400", color: "#8b5cf6" },
  blue: { bg: "from-blue-500/20 to-blue-500/5", text: "text-blue-400", color: "#3b82f6" },
  purple: { bg: "from-purple-500/20 to-purple-500/5", text: "text-purple-400", color: "#a855f7" },
  rose: { bg: "from-rose-500/20 to-rose-500/5", text: "text-rose-400", color: "#f43f5e" },
  cyan: { bg: "from-cyan-500/20 to-cyan-500/5", text: "text-cyan-400", color: "#06b6d4" },
};

export function AnalyticsStatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  icon,
  accent,
  change,
  changeLabel = "vs last period",
  sparklineData,
  inverseChange = false,
}: AnalyticsStatCardProps) {
  const isPositive = change !== undefined ? (inverseChange ? change < 0 : change > 0) : null;
  const accentStyle = accentMap[accent];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm card-lift gradient-border overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
              accentStyle.bg,
              accentStyle.text
            )}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">
              {label}
            </p>
            <p className="text-2xl font-bold text-white tabular-nums">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
                duration={1200}
              />
            </p>
          </div>
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {change !== undefined && (
        <p className="mt-1 text-xs text-white/30 ml-[52px]">{changeLabel}</p>
      )}

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3 -mx-2 -mb-2">
          <MiniChart
            data={sparklineData}
            color={accentStyle.color}
            height={50}
            showAxis={false}
          />
        </div>
      )}
    </div>
  );
}
