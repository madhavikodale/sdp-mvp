export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded shimmer" />
          <div className="h-5 w-32 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <div className="h-5 w-32 rounded shimmer" />
      </div>
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4">
            <div className="h-4 w-24 rounded shimmer" />
            <div className="h-4 w-16 rounded shimmer" />
            <div className="h-4 w-20 rounded shimmer" />
            <div className="h-4 w-12 rounded shimmer ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5 ${className}`}>
      <div className="h-5 w-32 rounded shimmer mb-2" />
      <div className="h-3 w-24 rounded shimmer mb-4" />
      <div className="h-32 rounded shimmer" />
    </div>
  );
}
