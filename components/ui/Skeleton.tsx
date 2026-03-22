export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted-border rounded ${className}`} />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-muted-border p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <SkeletonText lines={2} />
    </div>
  );
}
