"use client";

import { cn } from "@/lib/utils";
import { GlassHeader } from "./glass-header";
import { StatusPulse } from "./status-pulse";
import { SkeletonCard } from "./skeleton-card";
import { type ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
  headerAction?: ReactNode;
  status?: "online" | "offline" | "warning" | "processing";
  statusLabel?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
  loading?: boolean;
  skeletonCount?: number;
}

export function PageShell({
  title,
  description,
  children,
  headerAction,
  status,
  statusLabel,
  breadcrumb,
  className = "",
  loading = false,
  skeletonCount = 4,
}: PageShellProps) {
  if (loading) {
    return (
      <div className={cn("space-y-8 -mt-4", className)}>
        <div className="h-20 animate-pulse rounded-xl bg-white/[0.03]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 -mt-4", className)}>
      <GlassHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
      >
        {status && (
          <StatusPulse status={status} label={statusLabel} />
        )}
        {headerAction}
      </GlassHeader>
      {children}
    </div>
  );
}

// ─── Consistent Card Components ───

interface StatCardProps {
  label: string;
  value: string | number;
  total?: number;
  icon: ReactNode;
  accent: "indigo" | "emerald" | "amber" | "violet" | "blue" | "purple" | "rose" | "cyan";
  change?: number;
  isInverse?: boolean;
}

const accentMap: Record<string, string> = {
  indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
  violet: "from-violet-500/20 to-violet-500/5 text-violet-400",
  blue: "from-blue-500/20 to-blue-500/5 text-blue-400",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
  rose: "from-rose-500/20 to-rose-500/5 text-rose-400",
  cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
};

export function StatCard({
  label,
  value,
  total,
  icon,
  accent,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm card-lift gradient-border">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
            accentMap[accent]
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            {label}
          </p>
          <p className="text-xl font-bold text-white">
            {value}
            {total !== undefined && (
              <span className="text-sm font-normal text-white/30"> / {total}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Section Components ───

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Section({ title, children, className = "", action }: SectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Table Shell ───

interface TableShellProps {
  children: ReactNode;
  className?: string;
}

export function TableShell({ children, className = "" }: TableShellProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Grid Shell ───

interface GridShellProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5;
}

export function GridShell({ children, className = "", cols = 3 }: GridShellProps) {
  const colsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  };

  return (
    <div className={cn("grid gap-4", colsMap[cols], className)}>
      {children}
    </div>
  );
}
