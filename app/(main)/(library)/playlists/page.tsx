import { PlaylistGrid } from "@/components/features/guest/playlist";

export default function PlaylistsPage() {
  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Thư viện của bạn
          </h1>
        </div>

        {/* Playlists Grid */}
        <PlaylistGrid />
      </div>
    </div>
  );
}
