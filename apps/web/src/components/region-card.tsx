"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { HealthRing } from "./health-ring";
import { AnimatedCounter } from "./animated-counter";
import type { RegionUsage } from "@sdp-mvp/types";

interface RegionCardProps {
  region: RegionUsage;
  index?: number;
}

function MiniRing({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = 18;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative inline-flex items-center justify-center">
        <svg width="40" height="40" className="-rotate-90">
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
      <span className="text-[10px] text-white/40">{label}</span>
    </div>
  );
}

export function RegionCard({ region, index = 0 }: RegionCardProps) {
  const latencyScore = Math.max(0, 100 - region.latencyMs / 2);
  const uptimeScore = region.uptime;
  const overallScore = (latencyScore + uptimeScore) / 2;

  const regionNames: Record<string, string> = {
    "us-east-1": "US East",
    "us-west-2": "US West",
    "eu-west-1": "EU West",
    "ap-south-1": "AP South",
    "ap-northeast-1": "AP North",
  };

  return (
    <div
      className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm card-lift"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-white/40" />
          <span className="text-sm font-medium text-white">
            {regionNames[region.region] || region.region}
          </span>
        </div>
        <HealthRing score={overallScore} size={36} strokeWidth={3} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniRing
          value={region.requests}
          max={1_500_000}
          color="#6366f1"
          label="Load"
        />
        <MiniRing
          value={region.latencyMs}
          max={200}
          color="#f59e0b"
          label="Latency"
        />
        <MiniRing
          value={region.uptime}
          max={100}
          color="#10b981"
          label="Uptime"
        />
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-white/40">Requests</span>
          <span className="text-white font-medium tabular-nums">
            <AnimatedCounter
              value={region.requests}
              duration={1000 + index * 200}
            />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Latency</span>
          <span className="text-white font-medium tabular-nums">
            {region.latencyMs}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Uptime</span>
          <span className="text-emerald-400 font-medium tabular-nums">
            {region.uptime}%
          </span>
        </div>
      </div>
    </div>
  );
}
