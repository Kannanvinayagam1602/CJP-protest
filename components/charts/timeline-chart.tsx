"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCompactNumber, formatDate } from "@/lib/utils";

export function TimelineChart({ data }: { data: { date: string; participants: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => formatDate(d)}
          tick={{ fontSize: 11 }}
          minTickGap={24}
        />
        <YAxis tickFormatter={(v) => formatCompactNumber(v)} tick={{ fontSize: 11 }} width={48} />
        <Tooltip
          labelFormatter={(d) => formatDate(String(d))}
          formatter={(value: any) => [formatCompactNumber(value ?? 0), "Participants"]}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="participants"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2.25}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
