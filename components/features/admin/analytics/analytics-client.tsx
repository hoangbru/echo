"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useAdminAnalytics } from "@/hooks/use-admin";

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#10b981"];

export function AnalyticsClient() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data)
    return (
      <div className="text-center text-muted-foreground mt-10">
        Không thể tải dữ liệu phân tích.
      </div>
    );

  const statsCards = [
    {
      label: "Tổng số Bài hát",
      value: data.overview.totalTracks.toLocaleString(),
      change: data.overview.growth.tracks,
    },
    {
      label: "Người dùng nền tảng",
      value: data.overview.totalUsers.toLocaleString(),
      change: data.overview.growth.users,
    },
    {
      label: "Nghệ sĩ xác minh",
      value: data.overview.totalArtists.toLocaleString(),
      change: data.overview.growth.artists,
    },
    {
      label: "Yêu cầu chờ duyệt",
      value: data.overview.pendingRequests.toLocaleString(),
      change: "Cần xử lý",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg border border-border p-6 shadow-sm"
          >
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p
                className={`text-sm font-medium ${stat.change.includes("+") ? "text-green-500" : "text-primary"}`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Lưu lượng 7 ngày qua
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.streamingData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="streams"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Lượt nghe (Streams)"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Người dùng Active"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Phân bổ Thể loại Nhạc
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.genreDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.genreDistribution.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top 5 Bài hát được nghe nhiều nhất
          </h2>
          <div className="space-y-3">
            {data.topTracks.map((track: any) => (
              <div
                key={track.rank}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-md hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary w-4">
                    {track.rank}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-foreground leading-tight">
                      {track.title}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-foreground bg-background px-2 py-1 rounded border border-border">
                  {track.streams?.toLocaleString()}{" "}
                  <span className="text-muted-foreground font-normal">
                    lượt
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top 5 Nghệ sĩ theo dõi nhiều nhất
          </h2>
          <div className="space-y-3">
            {data.topArtists.map((artist: any) => (
              <div
                key={artist.rank}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-md hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary w-4">
                    {artist.rank}
                  </span>
                  <p className="text-[14px] font-bold text-foreground">
                    {artist.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-foreground bg-background px-2 py-1 rounded border border-border inline-block">
                    {artist.followers?.toLocaleString()}{" "}
                    <span className="text-muted-foreground font-normal">
                      người
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
