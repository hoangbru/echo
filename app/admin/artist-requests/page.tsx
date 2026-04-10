"use client";

import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { RequestCard } from "./request-card";

const ITEMS_PER_PAGE = 5;

export default function ArtistRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const supabase = createClient();
  const router = useRouter();

  const fetchRequests = async (page: number) => {
    setIsLoading(true);

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await supabase
      .from("ArtistRequest")
      .select("*, User:userId (fullName, email, avatar)", { count: "exact" })
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (!error && data) {
      setRequests(data);
      if (count !== null) setTotalItems(count);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  const handleApprove = async (request: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("ArtistRequest")
      .update({
        status: "APPROVED",
        updatedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.id,
        reviewComment:
          "Hồ sơ hợp lệ. Chào mừng bạn đến với hệ thống Nghệ sĩ Echo!",
      })
      .eq("id", request.id);

    await supabase
      .from("ArtistProfile")
      .insert({ userId: request.userId, isVerified: true });

    setRequests((reqs) =>
      reqs.map((r) => (r.id === request.id ? { ...r, status: "APPROVED" } : r)),
    );
    router.refresh();
  };

  const handleReject = async (id: string, comment: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("ArtistRequest")
      .update({
        status: "REJECTED",
        updatedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.id,
        reviewComment: comment,
      })
      .eq("id", id);

    setRequests((reqs) =>
      reqs.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r)),
    );
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Quản lý Đơn Đăng Ký Nghệ Sĩ
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Tổng số đơn trong hệ thống:{" "}
          <span className="font-bold text-pink-500">{totalItems}</span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-[#18181b] border border-white/10 rounded-xl">
          <p className="text-gray-400">Không có đơn đăng ký nào.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
              <p className="text-sm text-gray-400">
                Hiển thị trang {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[#18181b] border border-white/10 text-white disabled:opacity-50 hover:bg-white/5 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[#18181b] border border-white/10 text-white disabled:opacity-50 hover:bg-white/5 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
