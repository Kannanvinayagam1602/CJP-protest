"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function DurationBarChart({ data }: { data: { event: string; days: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="event" tick={{ fontSize: 11 }} width={130} />
        <Tooltip formatter={(value: any) => [`${value ?? 0} days`, "Total Days"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="days" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
