"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Mail,
  Loader2,
  MessageSquareWarning,
} from "lucide-react";
import Image from "next/image";

export function RequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: any;
  onApprove: (req: any) => Promise<void>;
  onReject: (id: string, comment: string) => Promise<void>;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  const userData = Array.isArray(request.User) ? request.User[0] : request.User;

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(request);
    setIsProcessing(false);
  };

  const handleConfirmReject = async () => {
    if (!rejectComment.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }
    setIsProcessing(true);
    await onReject(request.id, rejectComment);
    setIsProcessing(false);
    setIsRejecting(false);
  };

  return (
    <div className="bg-card rounded-xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10">
          {userData?.avatar ? (
            <Image
              src={userData.avatar}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center bg-gray-800 text-white font-bold uppercase text-xl">
              {userData?.fullName?.[0] || "U"}
            </div>
          )}
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                {userData?.fullName}
              </h3>
              <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" /> {userData?.email}
              </p>
            </div>
            <div className="text-left md:text-right mt-2 md:mt-0">
              <p className="text-xs text-gray-500">
                Ngày gửi:{" "}
                {new Date(request.createdAt).toLocaleDateString("vi-VN")}
              </p>

              {request.status !== "PENDING" && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 border ${
                    request.status === "APPROVED"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {request.status === "APPROVED" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {request.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 p-4 bg-[#09090b] rounded-lg border border-white/5">
            <p className="text-sm font-medium text-gray-300 mb-2">
              Lý do / Link Demo của User:
            </p>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">
              {request.reason}
            </p>
          </div>

          {request.status === "PENDING" && (
            <>
              {isRejecting ? (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-red-400 mb-2">
                    <MessageSquareWarning className="w-4 h-4" />
                    Nhập lý do từ chối đơn này:
                  </label>
                  <textarea
                    autoFocus
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Ví dụ: Link nhạc demo không truy cập được..."
                    className="w-full bg-[#09090b] border border-red-500/20 rounded-lg p-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 text-sm mb-3 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirmReject}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      ) : null}{" "}
                      Xác nhận Từ chối
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsRejecting(false)}
                      className="text-gray-400 hover:text-white h-9 text-xs"
                    >
                      Huỷ
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}{" "}
                    Duyệt Đơn
                  </Button>
                  <Button
                    onClick={() => setIsRejecting(true)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    variant="outline"
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Từ chối
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
