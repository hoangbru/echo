"use client";

import { useState } from "react";
import { Search, Loader2, Lock, Unlock } from "lucide-react";
import { useAdminUsers, useToggleUserLock } from "@/hooks/use-admin-users";
import { cn } from "@/lib/utils/helpers";
import { formatDate } from "@/lib/utils/format";
import { DataPagination } from "@/components/shared/data-tables";

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading } = useAdminUsers(search, page, limit);
  const toggleLockMutation = useToggleUserLock();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const users = response?.data || [];
  const totalCount = response?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);
  const currentCount = users.length;

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm theo Username, Email hoặc ID..."
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
                  Ngày tham gia
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Người dùng
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border text-center">
                  Trạng thái
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 text-muted-foreground font-mono text-[13px]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-foreground">
                        {user.username}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {user.email}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[12px] font-bold inline-flex items-center gap-1",
                          user.isLocked
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        {user.isLocked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                        {user.isLocked ? "BỊ KHÓA" : "HOẠT ĐỘNG"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={
                          user.role === "ADMIN" ||
                          (toggleLockMutation.isPending &&
                            toggleLockMutation.variables?.id === user.id)
                        }
                        onClick={() =>
                          toggleLockMutation.mutate({
                            id: user.id,
                            isLocked: !user.isLocked,
                          })
                        }
                        className="px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors text-[13px] font-medium disabled:opacity-50 inline-flex items-center gap-2"
                      >
                        {toggleLockMutation.isPending &&
                          toggleLockMutation.variables?.id === user.id && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          )}
                        {user.isLocked ? "Mở khóa" : "Khóa tài khoản"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && users.length > 0 && (
        <DataPagination
          currentPage={page}
          totalPages={totalPages}
          currentCount={currentCount}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          itemName="tài khoản"
        />
      )}
    </div>
  );
}
