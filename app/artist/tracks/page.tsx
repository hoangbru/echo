import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import TrackTable from "./track-table";
import TrackToolbar from "./track-toolbar";

export default function ArtistTracksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bài hát của tôi
          </h1>
          <p className="text-gray-400 mt-1">
            Quản lý kho nhạc và trạng thái phát hành.
          </p>
        </div>
        <Link href="/artist/tracks/new">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> Tải nhạc mới
          </Button>
        </Link>
      </div>

      {/* BẢNG DANH SÁCH */}
      <TrackTable />
    </div>
  );
}
