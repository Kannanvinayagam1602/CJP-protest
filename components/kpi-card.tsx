"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  index?: number;
}

export function KPICard({ label, value, icon: Icon, delta, deltaTone = "neutral", index = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="glass-panel-hover h-full">
        <CardContent className="flex items-start justify-between gap-3 p-5">
          <div className="flex flex-col gap-1.5">
            <span className="section-label">{label}</span>
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
            {delta && (
              <span
                className={cn(
                  "text-xs font-medium",
                  deltaTone === "up" && "text-emerald-600 dark:text-emerald-400",
                  deltaTone === "down" && "text-destructive",
                  deltaTone === "neutral" && "text-muted-foreground"
                )}
              >
                {delta}
              </span>
            )}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
