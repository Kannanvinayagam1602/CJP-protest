"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatDate } from "@/lib/utils";

interface Row {
  date: string;
  Meetings: number;
  Negotiations: number;
  "Police Action": number;
  "Public Statements": number;
}

export function GovResponseAreaChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillMeetings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillNegotiations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.5} />
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillPolice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.45} />
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillStatements" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.5} />
            <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} tick={{ fontSize: 11 }} minTickGap={24} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip labelFormatter={(d) => formatDate(String(d))} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="Meetings" stackId="1" stroke="hsl(var(--chart-1))" fill="url(#fillMeetings)" />
        <Area type="monotone" dataKey="Negotiations" stackId="1" stroke="hsl(var(--chart-2))" fill="url(#fillNegotiations)" />
        <Area type="monotone" dataKey="Police Action" stackId="1" stroke="hsl(var(--destructive))" fill="url(#fillPolice)" />
        <Area type="monotone" dataKey="Public Statements" stackId="1" stroke="hsl(var(--chart-5))" fill="url(#fillStatements)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
