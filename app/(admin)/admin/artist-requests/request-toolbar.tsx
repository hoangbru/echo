"use client";

import { Filter } from "lucide-react";

import { useQueryString } from "@/hooks/use-query-string";
import { ArtistRequestStatus } from "@/types";

export function RequestToolbar({ currentStatus }: { currentStatus: string }) {
  const { updateURL } = useQueryString();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-white/5 mb-8">
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
          <select
            value={currentStatus}
            onChange={(e) => updateURL("status", e.target.value)}
            className="w-full md:w-[160px] bg-[#09090b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-pink-500 outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={ArtistRequestStatus.PENDING}>Chờ xác nhận</option>
            <option value={ArtistRequestStatus.APPROVED}>Đã chấp nhận</option>
            <option value={ArtistRequestStatus.REJECTED}>Từ chối</option>
          </select>
        </div>
      </div>
    </div>
  );
}
