"use client";

import { Fragment } from "react";
import { Loader2, Music, Clock, PieChart as PieIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuth } from "@/hooks/use-auth";
import { useDeepAnalytics } from "@/hooks/use-deep-analytics";

const barChartConfig = {
  streams: { label: "Lượt nghe", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const COLORS = [
  "#FF1A8C",
  "#B30059",
  "#FF66B3",
  "#FF3399",
  "#CC0066",
  "#FF99CC",
];

export function AnalyticsView() {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading } = useDeepAnalytics(user?.id);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data)
    return (
      <div className="p-8 text-foreground">Không có dữ liệu phân tích.</div>
    );

  const formattedHourlyStats = data.hourlyStats.map((item) => ({
    hourLabel: `${item.hour}h`,
    streams: item.streams,
  }));

  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        {/* KHỐI 1: BIỂU ĐỒ CỘT */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-[24px] flex flex-col">
          <div className="flex items-center gap-2 mb-[24px]">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-[18px] font-bold text-foreground">
              Thói quen theo khung giờ
            </h2>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ChartContainer
              config={barChartConfig}
              className="w-full h-full min-h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedHourlyStats}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="hourLabel"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  />
                  {/* FIX LỖI TÀNG HÌNH: Dùng var(--color-streams) */}
                  <Bar
                    dataKey="streams"
                    fill="var(--color-streams)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* KHỐI 2: BIỂU ĐỒ TRÒN */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-[24px] flex flex-col">
          <div className="flex items-center gap-2 mb-[24px]">
            <PieIcon className="w-5 h-5 text-primary" />
            <h2 className="text-[18px] font-bold text-foreground">
              Phân bổ theo Thể loại
            </h2>
          </div>
          <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
            {data.genreStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.genreStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="streams"
                    nameKey="genre"
                    stroke="none"
                  >
                    {data.genreStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-[14px]">
                Chưa có dữ liệu thể loại
              </p>
            )}
          </div>
        </div>
      </div>

      {/* TẦNG 2: BẢNG DỮ LIỆU CÓ THỂ CUỘN */}
      <div className="bg-card border border-border rounded-[var(--radius)] p-[24px] flex flex-col">
        <div className="flex items-center gap-2 mb-[24px]">
          <Music className="w-5 h-5 text-primary" />
          <h2 className="text-[18px] font-bold text-foreground">
            Hiệu suất Bản ghi chi tiết
          </h2>
        </div>

        {/* GIẢI PHÁP CHO 100 BÀI HÁT: Khung giới hạn chiều cao (max-h-[400px]) và thanh cuộn */}
        <div className="overflow-auto max-h-[400px] custom-scrollbar border border-border rounded-md relative">
          <table className="w-full text-left text-[14px]">
            {/* THAY ĐỔI: Ghim Tiêu đề lên đầu (sticky top-0) để khi cuộn ko bị mất */}
            <thead className="text-muted-foreground bg-card sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-medium border-b border-border">
                  Tên bài hát
                </th>
                <th className="p-4 font-medium text-right border-b border-border">
                  Lượt nghe
                </th>
                <th className="p-4 font-medium text-right border-b border-border">
                  Khán giả (Unique)
                </th>
                <th className="p-4 font-medium text-right border-b border-border">
                  Tỷ lệ hoàn thành
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.trackPerformance.map((track) => (
                <tr
                  key={track.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 text-foreground font-medium">
                    {track.title}
                  </td>
                  <td className="p-4 text-right text-foreground font-mono">
                    {track.totalStreams.toLocaleString("vi-VN")}
                  </td>
                  <td className="p-4 text-right text-foreground font-mono">
                    {track.uniqueListeners.toLocaleString("vi-VN")}
                  </td>
                  <td className="p-4 text-right text-primary font-mono font-bold">
                    {track.completionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}
