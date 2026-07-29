"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/utils";

interface CityPoint {
  city: string;
  lat: number;
  lng: number;
  participants: number;
}

// Rough bounding box for mainland India used only to place approximate dots —
// this is a simplified illustrative scatter, not a precise geographic map.
const BOUNDS = { minLat: 8, maxLat: 35, minLng: 68, maxLng: 90 };

function project(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * width;
  const y = height - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * height;
  return { x, y };
}

export function CityBubbleMap({ data }: { data: CityPoint[] }) {
  const [active, setActive] = useState<string | null>(null);
  const width = 360;
  const height = 380;
  const max = Math.max(...data.map((d) => d.participants), 1);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm" role="img" aria-label="Participating cities map">
        <rect x={0} y={0} width={width} height={height} rx={16} className="fill-muted/40" />
        {data.map((d) => {
          const { x, y } = project(d.lat, d.lng, width, height);
          const r = 8 + (d.participants / max) * 22;
          const isActive = active === d.city;
          return (
            <g key={d.city} onMouseEnter={() => setActive(d.city)} onMouseLeave={() => setActive(null)}>
              <circle
                cx={x}
                cy={y}
                r={r}
                className={isActive ? "fill-accent" : "fill-primary"}
                fillOpacity={isActive ? 0.85 : 0.55}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
              <text x={x} y={y - r - 6} textAnchor="middle" className="fill-foreground text-[10px] font-medium">
                {d.city}
              </text>
            </g>
          );
        })}
      </svg>
      {active && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{active}</span> —{" "}
          {formatNumber(data.find((d) => d.city === active)?.participants ?? 0)} participants
        </p>
      )}
      <p className="mt-1 text-[11px] text-muted-foreground/70">
        Illustrative bubble placement, not a precise geographic projection.
      </p>
    </div>
  );
}
