"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { audienceVoteOptions } from "@/lib/data";
import { cn } from "@/lib/utils";

function seededVotes(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const base = 1200 + (h % 800);
  return audienceVoteOptions.map((opt, i) => {
    const bump = ((h >> (i * 3)) & 0xff) % 120;
    return { id: opt.id, count: base + bump + i * 42 };
  });
}

export function AudienceVotePanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const baseCounts = useMemo(() => seededVotes("killswitch-demo"), []);

  const counts = useMemo(() => {
    const map = Object.fromEntries(baseCounts.map((c) => [c.id, c.count]));
    if (selected) map[selected] = (map[selected] ?? 0) + 1842;
    return map;
  }, [baseCounts, selected]);

  const total = useMemo(
    () => Object.values(counts).reduce((a, b) => a + b, 0),
    [counts],
  );

  return (
    <div className="ks-panel relative overflow-hidden rounded-xl">
      <div className="relative border-b border-neon-green/10 bg-black/45 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white uppercase">
          <Zap className="size-4 fill-neon-green text-neon-green" />
          Audience Modifier
        </div>
        <p className="mt-1 text-xs text-highlight-dim/60">
          Vote to trigger a modifier — local demo, no backend.
        </p>
      </div>
      <ul className="relative divide-y divide-white/5 p-2">
        {audienceVoteOptions.map((opt) => {
          const active = selected === opt.id;
          const pct = total ? Math.round(((counts[opt.id] ?? 0) / total) * 100) : 0;
          return (
            <li key={opt.id} className="p-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  "relative flex w-full items-center justify-between overflow-hidden rounded-lg border px-3 py-3 text-left transition",
                  active
                    ? "border-neon-green/50 bg-neon-green/10 shadow-[0_0_20px_rgb(57_255_20_/_0.1)]"
                    : "border-white/10 bg-slate-dark/60 hover:border-white/20",
                )}
              >
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-neon-green/20 to-transparent"
                  style={{ width: `${Math.min(94, pct)}%` }}
                />
                <div className="relative">
                  <p className="text-sm font-semibold text-white">{opt.label}</p>
                  <p className="text-[11px] text-highlight-dim/50">+{pct}%</p>
                </div>
                <div className="relative flex items-center gap-2">
                  <span className="rounded bg-neon-green/15 px-2 py-0.5 text-[10px] font-bold text-neon-green">
                    VOTE
                  </span>
                  {active && <Check className="size-4 text-neon-green" />}
                </div>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-neon-green/10 bg-black/30 px-4 py-2 text-right">
        <span className="text-xs text-highlight-dim/50">Total votes </span>
        <span className="font-mono text-sm font-bold text-neon-green">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
