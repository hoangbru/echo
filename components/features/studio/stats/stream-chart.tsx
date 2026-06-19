"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  streams: {
    label: "Lượt nghe",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface StreamChartProps {
  data: Array<{ date: string; streams: number }>;
}

export function StreamChart({ data }: StreamChartProps) {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (data.length === 1) {
      return [{ date: "Trước đó", streams: 0 }, data[0]];
    }

    return data;
  }, [data]);

  if (processedData.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground text-[14px]">
        Chưa có dữ liệu thống kê
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
            opacity={0.5}
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            domain={[0, "auto"]}
          />

          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

          <defs>
            <linearGradient id="fillStreams" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-streams)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-streams)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="streams"
            stroke="var(--color-streams)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#fillStreams)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
