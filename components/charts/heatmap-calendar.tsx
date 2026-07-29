"use client";

import { formatDate } from "@/lib/utils";

interface Props {
  data: { date: string; participants: number }[];
}

function intensityLevel(value: number, max: number): number {
  if (max === 0) return 0;
  const ratio = value / max;
  if (ratio > 0.8) return 4;
  if (ratio > 0.55) return 3;
  if (ratio > 0.3) return 2;
  if (ratio > 0.08) return 1;
  return 0;
}

const LEVEL_CLASSES = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-accent",
];

export function HeatmapCalendar({ data }: Props) {
  const max = Math.max(...data.map((d) => d.participants), 1);

  // Group into weeks of 7 for a simple calendar grid
  const weeks: { date: string; participants: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex gap-1.5">
            {week.map((day) => {
              const level = intensityLevel(day.participants, max);
              return (
                <div
                  key={day.date}
                  title={`${formatDate(day.date)} — ${day.participants.toLocaleString("en-IN")} participants`}
                  className={`h-8 flex-1 rounded-md transition-transform hover:scale-110 ${LEVEL_CLASSES[level]}`}
                  aria-label={`${formatDate(day.date)}: ${day.participants} participants`}
                  role="img"
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        <span>Low</span>
        {LEVEL_CLASSES.map((c, i) => (
          <span key={i} className={`h-3 w-3 rounded-sm ${c}`} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}
