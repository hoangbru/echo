export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse space-y-4">
      <div className="flex gap-4 items-start">
        <div className="w-14 h-14 rounded-md bg-border" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-5 bg-border rounded w-32" />
          <div className="h-3 bg-border rounded w-48" />
        </div>
      </div>
      <div className="h-16 bg-border rounded-md" />
    </div>
  );
}
