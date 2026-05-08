"use client";

import type { Player } from "@/lib/types";
import { cn } from "@/lib/utils";

type EmbedGridProps = {
  players: (Player | null)[];
  soloSlot?: number | null;
  className?: string;
};

const borderColors = [
  "border-neon-green/30",
  "border-electric-blue/30",
  "border-volt-purple/30",
  "border-amber-400/30",
];

export function ReplitGrid({ players, soloSlot, className }: EmbedGridProps) {
  const slots = soloSlot
    ? [players.find((p) => p?.slot === soloSlot) ?? null]
    : [
        players.find((p) => p?.slot === 1) ?? null,
        players.find((p) => p?.slot === 2) ?? null,
        players.find((p) => p?.slot === 3) ?? null,
        players.find((p) => p?.slot === 4) ?? null,
      ];

  return (
    <div
      className={cn(
        soloSlot ? "grid grid-cols-1" : "grid grid-cols-1 gap-3 md:grid-cols-2",
        "h-full w-full",
        className,
      )}
    >
      {slots.map((p, i) => {
        const slot = soloSlot ?? i + 1;
        const color = borderColors[(slot - 1) % borderColors.length];
        return (
          <div
            key={slot}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-xl border bg-black/60",
              color,
            )}
          >
            <div className="flex items-center gap-2 border-b border-white/5 bg-slate-dark/70 px-3 py-2">
              <span className="text-[10px] font-bold tracking-wider text-highlight-dim/50 uppercase">
                Slot {slot}
              </span>
              {p && (
                <span className="font-mono text-xs font-semibold text-white">
                  {p.name}
                </span>
              )}
            </div>
            {p?.replit_url ? (
              <iframe
                src={p.replit_url}
                title={`${p.name} - slot ${slot}`}
                className="flex-1 border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                allow="clipboard-write"
              />
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-highlight-dim/35">
                {p ? "No embed URL set" : "Empty slot"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
