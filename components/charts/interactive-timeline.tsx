"use client";

import { motion } from "framer-motion";
import { Megaphone, ShieldAlert, Handshake, Landmark, FlagOff, Users } from "lucide-react";
import type { ProtestEvent } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ICONS: Record<string, typeof Megaphone> = {
  "Press Conference": Megaphone,
  "Police Action": ShieldAlert,
  "Negotiation Meeting": Handshake,
  "Public Statement": Landmark,
  "Student Assembly": Users,
  Rally: Users,
  March: Users,
  "Sit-in": Users,
  "Candlelight Vigil": Users,
};

const NOTABLE_EVENTS = [
  "Press Conference",
  "Police Action",
  "Negotiation Meeting",
  "Public Statement",
];

export function InteractiveTimeline({ events }: { events: ProtestEvent[] }) {
  const milestones = events
    .filter((e) => NOTABLE_EVENTS.includes(e.event))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 14);

  if (milestones.length === 0) {
    return <p className="text-sm text-muted-foreground">No milestone events match the current filters.</p>;
  }

  return (
    <ol className="relative space-y-6 border-s border-border/70 ps-6">
      {milestones.map((m, i) => {
        const Icon = ICONS[m.event] ?? FlagOff;
        return (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="relative"
          >
            <span className="absolute -start-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-primary">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{m.event}</span>
              <Badge variant="outline">{formatDate(m.date)}</Badge>
              <Badge variant="default">{m.city}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {m.main_demand} — {m.government_response} · {formatNumber(m.estimated_participants)} participants
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}
