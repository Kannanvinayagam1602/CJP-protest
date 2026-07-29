"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SummaryCards({ summaries }: { summaries: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {summaries.map((text, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
        >
          <Card className="glass-panel-hover h-full">
            <CardContent className="flex gap-3 p-5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
