"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type VoteBarProps = {
  label: string;
  count: number;
  total: number;
  className?: string;
};

export function VoteBar({ label, count, total, className }: VoteBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold tracking-wide text-highlight-dim uppercase">
          {label}
        </span>
        <span className="font-mono text-neon-green">+{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-black/50 ring-1 ring-inset ring-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon-green/90 to-electric-blue/70"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
