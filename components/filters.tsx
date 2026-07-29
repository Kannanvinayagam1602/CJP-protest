"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Filters as FilterState } from "@/lib/types";

interface FiltersBarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  cities: string[];
  demands: string[];
  outcomes: string[];
  eventTypes: string[];
  minDate: string;
  maxDate: string;
}

export function FiltersBar({
  filters,
  onChange,
  cities,
  demands,
  outcomes,
  eventTypes,
  minDate,
  maxDate,
}: FiltersBarProps) {
  const toOptions = (values: string[]) => [
    { label: "All", value: "All" },
    ...values.map((v) => ({ label: v, value: v })),
  ];

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">From</label>
          <Input
            type="date"
            min={minDate}
            max={maxDate}
            value={filters.dateFrom ?? minDate}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
          <Input
            type="date"
            min={minDate}
            max={maxDate}
            value={filters.dateTo ?? maxDate}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">City</label>
          <Select
            options={toOptions(cities)}
            value={filters.city ?? "All"}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Demand</label>
          <Select
            options={toOptions(demands)}
            value={filters.demand ?? "All"}
            onChange={(e) => onChange({ ...filters, demand: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Outcome</label>
          <Select
            options={toOptions(outcomes)}
            value={filters.outcome ?? "All"}
            onChange={(e) => onChange({ ...filters, outcome: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Event Type</label>
          <Select
            options={toOptions(eventTypes)}
            value={filters.eventType ?? "All"}
            onChange={(e) => onChange({ ...filters, eventType: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search any protest event, city, or demand…"
            className="pl-9"
            value={filters.query ?? ""}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            aria-label="Search protest events"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({ dateFrom: minDate, dateTo: maxDate, city: "All", demand: "All", outcome: "All", eventType: "All", query: "" })
          }
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
