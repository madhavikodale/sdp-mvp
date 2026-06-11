"use client";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg shimmer" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded shimmer" />
          <div className="h-4 w-16 rounded shimmer" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded shimmer" />
        <div className="h-3 w-3/4 rounded shimmer" />
      </div>
    </div>
  );
}

export function SkeletonStat({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg shimmer" />
        <div className="space-y-2">
          <div className="h-3 w-20 rounded shimmer" />
          <div className="h-6 w-24 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden backdrop-blur-sm">
      <div className="grid grid-cols-4 gap-4 border-b border-white/[0.06] p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 rounded shimmer" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4">
          {[...Array(4)].map((_, j) => (
            <div
              key={j}
              className="h-4 rounded shimmer"
              style={{ width: j === 0 ? "80%" : "60%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
