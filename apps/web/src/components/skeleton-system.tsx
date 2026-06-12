"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer rounded-lg bg-white/[0.03]",
        className
      )}
      style={style}
    />
  );
}

// Staggered container for skeleton layouts
export function SkeletonContainer({
  children,
  className,
  staggerDelay = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Dashboard overview skeleton
export function DashboardSkeleton() {
  return (
    <SkeletonContainer className="space-y-6">
      {/* Welcome section */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="glass-card rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </motion.div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="lg:col-span-2 glass-card rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-48 w-full" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="glass-card rounded-xl p-5 space-y-4"
        >
          <Skeleton className="h-5 w-28" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SkeletonContainer>
  );
}

// Table skeleton with header + rows
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <SkeletonContainer className="space-y-4">
      {/* Table header */}
      <div className="flex items-center gap-4 pb-3 border-b border-white/[0.06]">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" style={{ maxWidth: `${20 + Math.random() * 30}%` }} />
        ))}
      </div>
      {/* Table rows */}
      <div className="space-y-2">
        {[...Array(rows)].map((_, rowIdx) => (
          <motion.div
            key={rowIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIdx * 0.05, duration: 0.2 }}
            className="flex items-center gap-4 py-3"
          >
            {[...Array(columns)].map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-4 flex-1"
                style={{ maxWidth: `${15 + Math.random() * 35}%` }}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

// Chart skeleton with bars/lines
export function ChartSkeleton({ type = "bar" }: { type?: "bar" | "line" | "pie" }) {
  return (
    <SkeletonContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="relative h-64">
        {type === "bar" && (
          <div className="flex items-end justify-between h-full gap-2 px-4 pb-8">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 70}%` }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex-1 rounded-t-md bg-white/[0.06]"
              />
            ))}
          </div>
        )}
        {type === "line" && (
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <motion.path
              d="M 0 150 Q 50 120 100 100 T 200 80 T 300 60 T 400 40"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>
        )}
        {type === "pie" && (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
        )}
      </div>
    </SkeletonContainer>
  );
}

// Card grid skeleton
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SkeletonContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </motion.div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

// Form skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <SkeletonContainer className="space-y-4 max-w-lg">
      {[...Array(fields)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.2 }}
          className="space-y-2"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: fields * 0.08 }}
      >
        <Skeleton className="h-10 w-32" />
      </motion.div>
    </SkeletonContainer>
  );
}

// Stats cards skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <SkeletonContainer>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3, type: "spring", stiffness: 200 }}
            className="glass-card rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-24" />
            </div>
          </motion.div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

// Page shell skeleton with header + content
export function PageShellSkeleton() {
  return (
    <SkeletonContainer className="space-y-6">
      {/* Glass header skeleton */}
      <div className="sticky top-0 z-30 -mx-6 mb-8 border-b border-white/[0.06] bg-sdp-bg/80 px-6 py-4 backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-end justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <DashboardSkeleton />
    </SkeletonContainer>
  );
}

// Full page loading state with blur transition
export function PageLoadingState({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
