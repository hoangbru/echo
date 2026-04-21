"use client";

import {
  PlayCircle,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock Data (Sau này sẽ fetch từ Supabase)
const STATS = [
  {
    title: "Tổng Lượt Nghe",
    value: "1.2M",
    change: "+12.5%",
    isUp: true,
    icon: PlayCircle,
  },
  {
    title: "Người Nghe Hàng Tháng",
    value: "45.2K",
    change: "+8.2%",
    isUp: true,
    icon: Users,
  },
  {
    title: "Người Theo Dõi",
    value: "12.4K",
    change: "+5.1%",
    isUp: true,
    icon: Heart,
  },
  {
    title: "Doanh Thu Ước Tính",
    value: "$1,240",
    change: "-2.4%",
    isUp: false,
    icon: DollarSign,
  },
];

const TOP_TRACKS = [
  {
    id: 1,
    title: "Midnight Dreams",
    streams: "452,120",
    cover:
      "https://images.unsplash.com/photo-1614613535308-eb51bd3d2c17?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    title: "Electric Pulse",
    streams: "321,400",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    title: "Ethereal Wave",
    streams: "189,050",
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    title: "Neon Highway",
    streams: "95,300",
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop",
  },
];

export default function ArtistDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Tổng Quan
        </h1>
        <p className="text-gray-400 mt-2">
          Theo dõi lượt nghe và sự phát triển của bạn trong 30 ngày qua.
        </p>
      </div>

      {/* 4 Thẻ Thống Kê Chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-white/10 rounded-2xl p-6 shadow-lg hover:border-pink-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                <stat.icon className="w-6 h-6 text-pink-500" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${stat.isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
              >
                {stat.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-black text-white tracking-tight">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Khu vực Biểu đồ & Top Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ (Cột lớn chiếm 2/3) */}
        <div className="lg:col-span-2 bg-card border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">
              Lượt Nghe Theo Thời Gian
            </h2>
            <select className="bg-[#09090b] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-pink-500">
              <option>30 ngày qua</option>
              <option>7 ngày qua</option>
              <option>Năm nay</option>
            </select>
          </div>

          {/* Box mô phỏng Biểu đồ (Do chưa cài thư viện Recharts) */}
          <div className="flex-1 w-full min-h-[300px] bg-[#09090b] rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="text-center z-10">
              <PlayCircle className="w-12 h-12 text-pink-500/20 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">
                Biểu đồ đang được cập nhật dữ liệu...
              </p>
            </div>

            {/* Giả lập các đường line neon */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pink-500/10 to-transparent"></div>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M0,80 Q25,60 50,70 T100,30"
                fill="none"
                stroke="rgba(236,72,153,0.5)"
                strokeWidth="0.5"
                className="drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
              />
              <path
                d="M0,90 Q30,85 60,95 T100,75"
                fill="none"
                stroke="rgba(168,85,247,0.5)"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Danh sách Bài Hát Hàng Đầu (Cột nhỏ chiếm 1/3) */}
        <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">
              Bài Hát Phổ Biến Nhất
            </h2>
          </div>

          <div className="space-y-4">
            {TOP_TRACKS.map((track, idx) => (
              <div
                key={track.id}
                className="flex items-center gap-4 group p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={track.cover}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate group-hover:text-pink-400 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {track.streams} lượt nghe
                  </p>
                </div>

                <div className="text-pink-500 font-black text-lg opacity-30">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/artist/tracks"
            className="w-full mt-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
