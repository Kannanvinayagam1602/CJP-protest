import type { ProtestEvent, Dataset } from "./types";

export function mean(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function median(nums: number[]): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(values: string[]): string {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = "";
  let bestCount = -1;
  for (const [k, c] of counts) {
    if (c > bestCount) {
      best = k;
      bestCount = c;
    }
  }
  return best;
}

export function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const m = mean(nums);
  const variance = nums.reduce((sum, n) => sum + (n - m) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

export function countBy<T extends string>(items: T[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) out[item] = (out[item] ?? 0) + 1;
  return out;
}

export function percentageDistribution(items: string[]): { label: string; count: number; pct: number }[] {
  const counts = countBy(items);
  const total = items.length || 1;
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, pct: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count);
}

export interface KPISet {
  totalDurationDays: number;
  estimatedParticipants: number;
  numberOfDemands: number;
  citiesParticipated: number;
  governmentResponses: number;
  finalOutcomeStatus: string;
  acceptanceRatePct: number;
}

export function computeKPIs(dataset: Dataset): KPISet {
  const { events, meta } = dataset;
  const totalParticipants = events.reduce((s, e) => s + e.estimated_participants, 0);
  const uniqueCities = new Set(events.map((e) => e.city));
  const govResponses = events.filter((e) => e.government_response !== "No Response").length;
  const resolved = events.filter((e) => e.status === "Resolved");
  const accepted = resolved.filter((e) => e.outcome === "Accepted" || e.outcome === "Partially Accepted");
  const acceptanceRatePct = resolved.length ? (accepted.length / resolved.length) * 100 : 0;

  const lastDate = events[events.length - 1];
  const finalOutcomeStatus =
    lastDate?.status === "Resolved" ? "Movement Concluded" : "Ongoing / Under Negotiation";

  return {
    totalDurationDays: meta.total_duration_days,
    estimatedParticipants: totalParticipants,
    numberOfDemands: meta.main_demands.length,
    citiesParticipated: uniqueCities.size,
    governmentResponses: govResponses,
    finalOutcomeStatus,
    acceptanceRatePct: Math.round(acceptanceRatePct * 10) / 10,
  };
}

export function dailyIntensity(events: ProtestEvent[]) {
  const byDate = new Map<string, number>();
  for (const e of events) {
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + e.estimated_participants);
  }
  return Array.from(byDate.entries())
    .map(([date, participants]) => ({ date, participants }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function participantsByCity(events: ProtestEvent[]) {
  const byCity = new Map<string, number>();
  for (const e of events) {
    byCity.set(e.city, (byCity.get(e.city) ?? 0) + e.estimated_participants);
  }
  return Array.from(byCity.entries())
    .map(([city, participants]) => ({ city, participants }))
    .sort((a, b) => b.participants - a.participants);
}

export function demandDistribution(events: ProtestEvent[]) {
  return percentageDistribution(events.map((e) => e.main_demand)).map((d) => ({
    name: d.label,
    value: d.count,
    pct: Math.round(d.pct * 10) / 10,
  }));
}

export function outcomeByDemand(events: ProtestEvent[]) {
  const demands = Array.from(new Set(events.map((e) => e.main_demand)));
  return demands.map((demand) => {
    const subset = events.filter((e) => e.main_demand === demand);
    const accepted = subset.filter((e) => e.outcome === "Accepted").length;
    const partial = subset.filter((e) => e.outcome === "Partially Accepted").length;
    const rejected = subset.filter((e) => e.outcome === "Rejected").length;
    const pending = subset.filter((e) => e.outcome === "Pending").length;
    return { demand, Accepted: accepted, "Partially Accepted": partial, Rejected: rejected, Pending: pending };
  });
}

export function governmentResponseTimeline(events: ProtestEvent[]) {
  const byDate = new Map<string, { Meetings: number; Negotiations: number; "Police Action": number; "Public Statements": number }>();
  for (const e of events) {
    if (!byDate.has(e.date)) {
      byDate.set(e.date, { Meetings: 0, Negotiations: 0, "Police Action": 0, "Public Statements": 0 });
    }
    const bucket = byDate.get(e.date)!;
    if (e.government_response === "Meeting Scheduled" || e.government_response === "Formal Committee Formed") bucket.Meetings += 1;
    if (e.government_response === "Negotiation" || e.government_response === "Partial Concession") bucket.Negotiations += 1;
    if (e.police_action !== "None") bucket["Police Action"] += 1;
    if (e.government_response === "Public Statement") bucket["Public Statements"] += 1;
  }
  return Array.from(byDate.entries())
    .map(([date, vals]) => ({ date, ...vals }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function majorEventDurations(events: ProtestEvent[]) {
  // Group by event type, summing duration_day as a proxy for total days of that event type
  const byEvent = new Map<string, number>();
  for (const e of events) {
    byEvent.set(e.event, (byEvent.get(e.event) ?? 0) + e.duration_day);
  }
  return Array.from(byEvent.entries())
    .map(([event, days]) => ({ event, days }))
    .sort((a, b) => b.days - a.days);
}

export interface InsightSummary {
  averageParticipants: number;
  medianParticipants: number;
  stdDevParticipants: number;
  longestProtestPhase: string;
  mostCommonDemand: string;
  mostAffectedCity: string;
  acceptanceRatePct: number;
  governmentResponseFrequency: number;
  avgDaysBetweenNegotiations: number;
  peakDailyIntensity: { date: string; participants: number };
}

export function computeInsights(events: ProtestEvent[]): InsightSummary {
  const participants = events.map((e) => e.estimated_participants);
  const durations = majorEventDurations(events);
  const demands = percentageDistribution(events.map((e) => e.main_demand));
  const cities = participantsByCity(events);
  const resolved = events.filter((e) => e.status === "Resolved");
  const accepted = resolved.filter((e) => e.outcome === "Accepted" || e.outcome === "Partially Accepted");

  const negotiationDates = events
    .filter((e) => e.government_response === "Negotiation")
    .map((e) => new Date(e.date).getTime())
    .sort((a, b) => a - b);

  let avgGap = 0;
  if (negotiationDates.length > 1) {
    const gaps = negotiationDates.slice(1).map((t, i) => (t - negotiationDates[i]) / (1000 * 60 * 60 * 24));
    avgGap = mean(gaps);
  }

  const intensity = dailyIntensity(events);
  const peak = intensity.reduce((max, cur) => (cur.participants > max.participants ? cur : max), intensity[0]);

  return {
    averageParticipants: Math.round(mean(participants)),
    medianParticipants: Math.round(median(participants)),
    stdDevParticipants: Math.round(stdDev(participants)),
    longestProtestPhase: durations[0]?.event ?? "N/A",
    mostCommonDemand: demands[0]?.label ?? "N/A",
    mostAffectedCity: cities[0]?.city ?? "N/A",
    acceptanceRatePct: resolved.length ? Math.round((accepted.length / resolved.length) * 1000) / 10 : 0,
    governmentResponseFrequency: events.filter((e) => e.government_response !== "No Response").length,
    avgDaysBetweenNegotiations: Math.round(avgGap * 10) / 10,
    peakDailyIntensity: peak ?? { date: "", participants: 0 },
  };
}

export function growthTrend(events: ProtestEvent[]) {
  const intensity = dailyIntensity(events);
  return intensity.map((point, i) => {
    if (i === 0) return { ...point, growthPct: 0 };
    const prev = intensity[i - 1].participants || 1;
    const growthPct = ((point.participants - prev) / prev) * 100;
    return { ...point, growthPct: Math.round(growthPct * 10) / 10 };
  });
}

export function applyFilters(
  events: ProtestEvent[],
  filters: { dateFrom?: string; dateTo?: string; city?: string; demand?: string; outcome?: string; eventType?: string; query?: string }
) {
  return events.filter((e) => {
    if (filters.dateFrom && e.date < filters.dateFrom) return false;
    if (filters.dateTo && e.date > filters.dateTo) return false;
    if (filters.city && filters.city !== "All" && e.city !== filters.city) return false;
    if (filters.demand && filters.demand !== "All" && e.main_demand !== filters.demand) return false;
    if (filters.outcome && filters.outcome !== "All" && e.outcome !== filters.outcome) return false;
    if (filters.eventType && filters.eventType !== "All" && e.event !== filters.eventType) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${e.city} ${e.event} ${e.main_demand} ${e.location} ${e.government_response}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
