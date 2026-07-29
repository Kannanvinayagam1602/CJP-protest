"use client";

import * as React from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import type { ProtestEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "date" | "estimated_participants" | "city";

const OUTCOME_VARIANT: Record<string, "success" | "destructive" | "warning" | "default"> = {
  Accepted: "success",
  Rejected: "destructive",
  Pending: "warning",
  "Partially Accepted": "default",
};

export function DataTable({ events }: { events: ProtestEvent[] }) {
  const [sortKey, setSortKey] = React.useState<SortKey>("date");
  const [sortDir, setSortDir] = React.useState<1 | -1>(1);
  const [page, setPage] = React.useState(0);
  const pageSize = 10;

  const sorted = React.useMemo(() => {
    return [...events].sort((a, b) => {
      if (sortKey === "estimated_participants") {
        return (a.estimated_participants - b.estimated_participants) * sortDir;
      }
      return a[sortKey] > b[sortKey] ? sortDir : a[sortKey] < b[sortKey] ? -sortDir : 0;
    });
  }, [events, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice(page * pageSize, page * pageSize + pageSize);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  React.useEffect(() => setPage(0), [events]);

  return (
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Searchable table of protest events</caption>
          <thead className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <Th label="Date" active={sortKey === "date"} onClick={() => toggleSort("date")} />
              <Th label="City" active={sortKey === "city"} onClick={() => toggleSort("city")} />
              <th className="px-4 py-3 font-medium">Event</th>
              <Th
                label="Participants"
                active={sortKey === "estimated_participants"}
                onClick={() => toggleSort("estimated_participants")}
              />
              <th className="px-4 py-3 font-medium">Demand</th>
              <th className="px-4 py-3 font-medium">Gov. Response</th>
              <th className="px-4 py-3 font-medium">Outcome</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((e) => (
              <tr key={e.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/50">
                <td className="whitespace-nowrap px-4 py-3">{formatDate(e.date)}</td>
                <td className="whitespace-nowrap px-4 py-3">{e.city}</td>
                <td className="px-4 py-3">{e.event}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatNumber(e.estimated_participants)}</td>
                <td className="px-4 py-3">{e.main_demand}</td>
                <td className="px-4 py-3">{e.government_response}</td>
                <td className="px-4 py-3">
                  <Badge variant={OUTCOME_VARIANT[e.outcome] ?? "default"}>{e.outcome}</Badge>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={e.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {e.source} <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No events match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
        <span>
          Showing {pageRows.length ? page * pageSize + 1 : 0}–{page * pageSize + pageRows.length} of {sorted.length}
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-input px-2 py-1 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            className="rounded-md border border-input px-2 py-1 disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <th className="px-4 py-3 font-medium">
      <button
        className={`inline-flex items-center gap-1 ${active ? "text-foreground" : ""}`}
        onClick={onClick}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    </th>
  );
}
