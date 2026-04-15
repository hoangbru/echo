"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Music, Loader2, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ArtistAlbumsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [albumToDelete, setAlbumToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAlbums = async () => {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: artist } = await supabase
      .from("ArtistProfile")
      .select("id")
      .eq("userId", user?.id)
      .single();

    if (artist) {
      const { data } = await supabase
        .from("Album")
        .select("*, Track(count)") // Đếm số bài hát con
        .eq("artistId", artist.id)
        .order("createdAt", { ascending: false });
      setAlbums(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDelete = async () => {
    if (!albumToDelete) return;
    setIsDeleting(true);

    try {
      // 1. Xóa ảnh bìa trên Storage
      if (albumToDelete.coverImage) {
        const pathParts = albumToDelete.coverImage.split("covers/");
        const path = pathParts.length > 1 ? pathParts[1] : null;
        if (path) await supabase.storage.from("covers").remove([path]);
      }

      // 2. Xóa trong DB
      const { error } = await supabase
        .from("Album")
        .delete()
        .eq("id", albumToDelete.id);
      if (error) throw error;

      // 3. Cập nhật UI
      setAlbums((prev) => prev.filter((a) => a.id !== albumToDelete.id));
      setAlbumToDelete(null);
    } catch (err: any) {
      alert("Lỗi khi xóa: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Album & EP
          </h1>
          <p className="text-gray-400 mt-1">
            Nơi trưng bày các bộ sưu tập âm nhạc của bạn.
          </p>
        </div>
        <Link href="/artist/albums/new">
          <Button className="bg-pink-500 hover:bg-pink-600 font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> Tạo Album mới
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 bg-[#18181b] rounded-2xl border border-white/5">
          <p className="text-gray-500">
            Bạn chưa có Album nào. Hãy tạo mới ngay!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group bg-[#18181b] border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-lg border border-white/10">
                <Image
                  src={album.coverImage || "/default-cover.jpg"}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Nút hành động hiện lên khi hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full h-10 w-10 hover:bg-white text-black"
                    onClick={() =>
                      router.push(`/artist/albums/edit/${album.id}`)
                    }
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full h-10 w-10 bg-red-500 hover:bg-red-600"
                    onClick={() => setAlbumToDelete(album)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-white font-bold truncate">
                    {album.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Music className="w-3 h-3 text-pink-500" />
                    <p className="text-xs text-gray-400">
                      {album.Track?.[0]?.count || 0} Bài hát
                    </p>
                  </div>
                </div>
                {album.isPublished ? (
                  <Globe className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL XÓA */}
      <Dialog
        open={!!albumToDelete}
        onOpenChange={(open) => !open && setAlbumToDelete(null)}
      >
        <DialogContent className="bg-[#18181b] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Xóa Album này?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Bạn có chắc muốn xóa Album{" "}
              <span className="text-white font-bold">
                "{albumToDelete?.title}"
              </span>
              ? Các bài hát bên trong sẽ không bị xóa mà chỉ bị gỡ khỏi Album
              này.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setAlbumToDelete(null)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}{" "}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
