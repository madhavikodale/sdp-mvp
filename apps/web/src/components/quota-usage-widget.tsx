"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";
import { ArrowUpRight, Zap, AlertTriangle, Crown } from "lucide-react";

interface QuotaUsageWidgetProps {
  used: number;
  limit: number;
  unit: string;
  tier: "free" | "starter" | "pro" | "enterprise";
  billingCycle: string;
  burnRate?: number; // requests per hour
  className?: string;
}

const tierConfig = {
  free: { label: "Free", color: "#94a3b8", upgradeAt: 0.8, price: "$0" },
  starter: { label: "Starter", color: "#6366f1", upgradeAt: 0.85, price: "$49/mo" },
  pro: { label: "Pro", color: "#8b5cf6", upgradeAt: 0.9, price: "$199/mo" },
  enterprise: { label: "Enterprise", color: "#10b981", upgradeAt: 1.0, price: "Custom" },
};

export function QuotaUsageWidget({
  used,
  limit,
  unit,
  tier,
  billingCycle,
  burnRate = 0,
  className = "",
}: QuotaUsageWidgetProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const config = tierConfig[tier];
  const remaining = limit - used;
  const isNearLimit = percentage >= config.upgradeAt * 100;
  const isAtLimit = percentage >= 100;

  // Predict days until depletion
  const hoursLeft = burnRate > 0 ? remaining / burnRate : Infinity;
  const daysLeft = hoursLeft / 24;

  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 card-lift overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Zap className="h-4 w-4" style={{ color: config.color }} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">
              Quota Usage
            </p>
            <p className="text-xs text-white/30">{billingCycle}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border"
          style={{
            backgroundColor: `${config.color}10`,
            color: config.color,
            borderColor: `${config.color}20`,
          }}
        >
          {tier === "enterprise" ? <Crown className="h-3 w-3" /> : null}
          {config.label}
        </div>
      </div>

      {/* Ring + Stats */}
      <div className="flex items-center gap-5">
        <div className="relative flex items-center justify-center shrink-0">
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
              stroke={isAtLimit ? "#ef4444" : isNearLimit ? "#f59e0b" : config.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white tabular-nums">
              <AnimatedCounter value={percentage} suffix="%" decimals={1} duration={800} />
            </span>
            <span className="text-[10px] text-white/30">used</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-white/40">Used</span>
            <span className="text-sm font-medium text-white tabular-nums">
              {used.toLocaleString()} <span className="text-white/30">{unit}</span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-white/40">Limit</span>
            <span className="text-sm font-medium text-white tabular-nums">
              {limit.toLocaleString()} <span className="text-white/30">{unit}</span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-white/40">Remaining</span>
            <span className="text-sm font-medium text-emerald-400 tabular-nums">
              {remaining.toLocaleString()} <span className="text-emerald-400/50">{unit}</span>
            </span>
          </div>
          {burnRate > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white/40">Burn rate</span>
              <span className="text-sm font-medium text-white/70 tabular-nums">
                {burnRate.toLocaleString()}/hr
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prediction / Nudge */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        {isAtLimit ? (
          <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-rose-400">Quota exhausted</p>
              <p className="text-[10px] text-rose-400/60">Requests are being rate limited</p>
            </div>
            <button className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-0.5">
              Upgrade <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        ) : isNearLimit ? (
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-400">
                {daysLeft < 1
                  ? `~${Math.ceil(hoursLeft)} hours remaining`
                  : `~${Math.ceil(daysLeft)} days remaining`}
              </p>
              <p className="text-[10px] text-amber-400/60">At current burn rate</p>
            </div>
            <button className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-0.5">
              Upgrade <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        ) : burnRate > 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/30">
              {daysLeft > 30
                ? ">30 days at current rate"
                : `~${Math.ceil(daysLeft)} days remaining`}
            </p>
            <p className="text-xs text-white/20">{config.price}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/30">On track</p>
            <p className="text-xs text-white/20">{config.price}</p>
          </div>
        )}
      </div>
    </div>
  );
}
