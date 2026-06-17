export function LikedTracksHeroSkeleton() {
  return (
    <div className="relative w-full h-[30vh] md:h-[40vh] min-h-[340px] bg-gradient-to-b from-secondary to-background px-6 pt-20 pb-6 flex items-end animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end gap-6 z-10 w-full">
        <div className="w-48 h-48 md:w-60 md:h-60 bg-muted rounded-lg shadow-2xl shrink-0" />

        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-12 md:h-20 bg-muted rounded w-3/4 my-2" />
          <div className="flex items-center gap-2 flex-wrap w-full mt-2">
            <div className="w-6 h-6 rounded-full bg-muted" />
            <div className="h-4 bg-muted rounded w-28" />
            <div className="h-4 bg-muted rounded w-16" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackRowSkeleton() {
  return (
    <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-3 items-center animate-pulse border-b border-border/10 rounded-md bg-transparent">
      <div className="flex justify-center">
        <div className="h-4 w-4 bg-muted rounded" />
      </div>
      <div className="flex flex-col gap-2 min-w-0 pr-4">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/3 mt-1" />
      </div>
      <div className="hidden md:block">
        <div className="h-4 bg-muted rounded w-20" />
      </div>
      <div className="flex justify-center">
        <div className="h-4 bg-muted rounded w-10" />
      </div>
    </div>
  );
}

export function LikedTracksPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <LikedTracksHeroSkeleton />

      <div className="px-6 bg-gradient-to-b from-secondary/50 to-background pt-4 min-h-screen">
        <div className="flex items-center gap-6 py-6 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-muted shadow-xl" />
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="w-8 h-8 rounded bg-muted" />
        </div>

        <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2 border-b border-border/50 mb-2 animate-pulse">
          <div className="h-3 bg-muted rounded w-4 mx-auto" />
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-20 hidden md:block" />
          <div className="h-3 bg-muted rounded w-6 mx-auto" />
        </div>

        <div className="mt-8 animate-pulse flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <TrackRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
