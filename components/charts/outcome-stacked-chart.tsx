"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Row {
  demand: string;
  Accepted: number;
  "Partially Accepted": number;
  Rejected: number;
  Pending: number;
}

export function OutcomeStackedChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="demand" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" interval={0} height={60} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Accepted" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Partially Accepted" stackId="a" fill="hsl(var(--chart-4))" />
        <Bar dataKey="Pending" stackId="a" fill="hsl(var(--chart-5))" />
        <Bar dataKey="Rejected" stackId="a" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
