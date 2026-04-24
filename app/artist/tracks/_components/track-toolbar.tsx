"use client";

import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";
import { useQueryString } from "@/hooks/use-query-string";

export interface TrackToolbarProps {
  currentSearch: string;
  currentStatus: string;
}

export default function TrackToolbar({
  currentSearch,
  currentStatus,
}: TrackToolbarProps) {
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
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm tên bài hát..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Filter className="w-4 h-4 text-muted-foreground ml-2 hidden md:block" />
        <select
          value={currentStatus}
          onChange={(e) => {
            updateURL("status", e.target.value);
          }}
          className="w-full md:w-auto bg-input border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="public">Công khai (Public)</option>
          <option value="private">Riêng tư (Private)</option>
        </select>
      </div>
    </div>
  );
}
