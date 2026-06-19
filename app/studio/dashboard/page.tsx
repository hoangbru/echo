"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PlayCircle,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Loader2,
  Music,
} from "lucide-react";

import {
  ArtistDashboardSkeleton,
  StreamChart,
} from "@/components/features/studio/stats";

import { useAuth } from "@/hooks/use-auth";
import { useArtistStats } from "@/hooks/use-stats";

export default function ArtistDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useArtistStats(user?.id);

  if (authLoading || statsLoading) {
    return <ArtistDashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="text-foreground">Không tải được dữ liệu thống kê.</div>
    );
  }

  // Tính toán doanh thu (0.003 USD / 1 stream)
  const estimatedRevenue = (stats.overview.totalStreams * 0.003).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    },
  );

  const STATS_CARDS = [
    {
      title: "Tổng Lượt Nghe",
      value: stats.overview.totalStreams.toLocaleString("vi-VN"),
      icon: PlayCircle,
    },
    {
      title: "Người Nghe Hàng Tháng",
      value: stats.overview.monthlyListeners.toLocaleString("vi-VN"),
      icon: Users,
    },
    {
      title: "Người Theo Dõi",
      value: stats.overview.totalFollowers.toLocaleString("vi-VN"),
      icon: Heart,
    },
    {
      title: "Doanh Thu Ước Tính",
      value: estimatedRevenue,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-[32px] max-w-7xl mx-auto p-[32px]">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-black text-foreground tracking-tight">
          Tổng Quan
        </h1>
        <p className="text-muted-foreground mt-2 text-[16px]">
          Theo dõi lượt nghe và sự phát triển của bạn trong 30 ngày qua.
        </p>
      </div>

      {/* 4 Thẻ Thống Kê Chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {STATS_CARDS.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-[var(--radius)] p-[24px] shadow-sm hover:border-primary/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-[var(--radius)] bg-background flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-[4px] bg-primary/10 text-primary">
                <TrendingUp className="w-3 h-3" />
                Cập nhật
              </div>
            </div>
            <div>
              <p className="text-[14px] font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <h3 className="text-[24px] font-black text-foreground tracking-tight">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Khu vực Biểu đồ & Top Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Biểu đồ (Cột lớn chiếm 2/3) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[var(--radius)] p-[24px] flex flex-col">
          <div className="flex justify-between items-center mb-[24px]">
            <h2 className="text-[18px] font-bold text-foreground">
              Lượt Nghe Theo Thời Gian
            </h2>
          </div>

          <div className="flex-1 w-full min-h-[300px] bg-background rounded-[var(--radius)] border border-border flex items-center justify-center relative overflow-hidden">
            <StreamChart data={stats.chartData} />
          </div>
        </div>

        {/* Danh sách Bài Hát Hàng Đầu */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-[24px]">
          <div className="flex justify-between items-center mb-[24px]">
            <h2 className="text-[18px] font-bold text-foreground">
              Bài Hát Phổ Biến Nhất
            </h2>
          </div>

          <div className="space-y-[16px]">
            {stats.topTracks.map((track, idx) => (
              <div
                key={track.id}
                className="flex items-center gap-[16px] group p-2 hover:bg-background rounded-[var(--radius)] transition-colors"
              >
                <div className="relative w-12 h-12 rounded-[4px] overflow-hidden flex-shrink-0 bg-background flex items-center justify-center">
                  {track.imageUrl ? (
                    <Image
                      src={track.imageUrl}
                      alt={track.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Music className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <PlayCircle className="w-6 h-6 text-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground text-[15px] font-medium truncate group-hover:text-primary transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {track.totalStreams.toLocaleString("vi-VN")} lượt nghe
                  </p>
                </div>

                <div className="text-primary font-black text-[16px] opacity-30">
                  #{idx + 1}
                </div>
              </div>
            ))}

            {stats.topTracks.length === 0 && (
              <p className="text-muted-foreground text-[14px] text-center py-4">
                Chưa có bài hát nào.
              </p>
            )}
          </div>

          <Link
            href="/studio/tracks"
            className="w-full mt-[24px] py-[10px] rounded-[var(--radius)] border border-border text-[14px] font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors flex items-center justify-center gap-2"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
