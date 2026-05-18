"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Tag } from "lucide-react";

import { useQueryString } from "@/hooks/use-query-string";
import { useDebounce } from "@/hooks/use-debounce";
import { AlbumType } from "@/types";

export function AlbumToolbar({
  currentSearch,
  currentStatus,
  currentType,
}: {
  currentSearch: string;
  currentStatus: string;
  currentType: string;
}) {
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const { updateURL } = useQueryString();
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      updateURL("search", debouncedSearch);
    }
  }, [debouncedSearch, currentSearch, updateURL]);

  useEffect(() => {
    setLocalSearch(currentSearch);
  }, [currentSearch]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-white/5 mb-8">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm tên Album/EP..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full bg-[#09090b] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Lọc Thể loại */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <Tag className="w-4 h-4 text-muted-foreground hidden md:block" />
          <select
            value={currentType}
            onChange={(e) => updateURL("type", e.target.value)}
            className="w-full md:w-[160px] bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-ring outline-none cursor-pointer transition-colors"
          >
            <option value="all">Tất cả định dạng</option>
            <option value={AlbumType.SINGLE}>Single (Đĩa đơn)</option>
            <option value={AlbumType.EP}>EP (Đĩa mở rộng)</option>
            <option value={AlbumType.ALBUM}>Album (Album tiêu chuẩn)</option>
            <option value={AlbumType.COMPILATION}>
              Compilation (Tuyển tập)
            </option>
          </select>
        </div>

        {/* Lọc Trạng thái */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
          <select
            value={currentStatus}
            onChange={(e) => updateURL("status", e.target.value)}
            className="w-full md:w-[160px] bg-[#09090b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="public">Công khai</option>
            <option value="private">Bản nháp</option>
          </select>
        </div>
      </div>
    </div>
  );
}
