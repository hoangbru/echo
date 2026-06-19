"use client";

import { useState } from "react";
import { Search, Loader2, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { formatDate } from "@/lib/utils/format";
import {
  useAdminArtists,
  useToggleArtistVerify,
} from "@/hooks/use-admin-users";
import { DataPagination } from "@/components/shared/data-tables";

export function ArtistManagementClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading } = useAdminArtists(search, page, limit);
  const toggleVerifyMutation = useToggleArtistVerify();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const artists = response?.data || [];
  const totalCount = response?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);
  const currentCount = artists.length;

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm theo Tên nghệ sĩ hoặc ID..."
          value={search}
          onChange={handleSearchChange}
          className="w-full bg-background border border-border rounded-[4px] pl-10 pr-4 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-muted/40 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Ngày tạo hồ sơ
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Nghệ danh (Stage Name)
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border text-center">
                  Xác minh (Verified)
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : (
                artists.map((artist: any) => (
                  <tr
                    key={artist.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 text-muted-foreground font-mono text-[13px]">
                      {formatDate(artist.createdAt)}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-foreground flex items-center gap-2">
                        {artist.stageName} 
                        {artist.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </p>
                      <p className="text-[12px] text-muted-foreground font-mono truncate max-w-[200px]">
                        {artist.contactEmail || "Chưa cập nhật email"}{" "}
                        
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[12px] font-bold inline-flex items-center gap-1",
                          artist.isVerified
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {artist.isVerified ? "ĐÃ XÁC MINH" : "CHƯA XÁC MINH"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={
                          toggleVerifyMutation.isPending &&
                          toggleVerifyMutation.variables?.id === artist.id
                        }
                        onClick={() =>
                          toggleVerifyMutation.mutate({
                            id: artist.id,
                            isVerified: !artist.isVerified,
                          })
                        }
                        className="px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors text-[13px] font-medium disabled:opacity-50 inline-flex items-center gap-2"
                      >
                        {toggleVerifyMutation.isPending &&
                          toggleVerifyMutation.variables?.id === artist.id && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          )}
                        {artist.isVerified ? "Gỡ tích xanh" : "Cấp tích xanh"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && artists.length > 0 && (
        <DataPagination
          currentPage={page}
          totalPages={totalPages}
          currentCount={currentCount}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          itemName="hồ sơ nghệ sĩ"
        />
      )}
    </div>
  );
}
