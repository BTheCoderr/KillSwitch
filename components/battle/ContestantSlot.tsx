"use client";

import { Minus, Plus } from "lucide-react";
import type { Player } from "@/lib/types";
import { cn } from "@/lib/utils";

type ContestantSlotProps = {
  player: Player | null;
  slot: number;
  editable?: boolean;
  onUpdate?: (field: string, value: string | number) => void;
  onScore?: (delta: number) => void;
  className?: string;
};

const slotColors = [
  "border-neon-green/40",
  "border-electric-blue/40",
  "border-volt-purple/40",
  "border-amber-400/40",
];

export function ContestantSlot({
  player,
  slot,
  editable = false,
  onUpdate,
  onScore,
  className,
}: ContestantSlotProps) {
  const color = slotColors[(slot - 1) % slotColors.length];

  if (!player && !editable) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-white/15 bg-slate-dark/40 p-4 text-center text-sm text-highlight-dim/40",
          className,
        )}
      >
        Slot {slot} — empty
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border bg-slate-dark/60 p-4", color, className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold tracking-wider text-highlight-dim/50 uppercase">
          Slot {slot}
        </span>
        {player && (
          <span className="font-mono text-lg font-black text-white">
            {player.score}
          </span>
        )}
      </div>

      {editable ? (
        <div className="mt-3 space-y-2">
          <input
            placeholder="Name"
            defaultValue={player?.name ?? ""}
            onBlur={(e) => onUpdate?.("name", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white placeholder:text-highlight-dim/30 focus:border-neon-green/40 focus:outline-none"
          />
          <input
            placeholder="Embed URL (Playcode / StackBlitz / Replit)"
            defaultValue={player?.replit_url ?? ""}
            onBlur={(e) => onUpdate?.("replit_url", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white placeholder:text-highlight-dim/30 focus:border-neon-green/40 focus:outline-none"
          />
          <input
            placeholder="Language"
            defaultValue={player?.language ?? ""}
            onBlur={(e) => onUpdate?.("language", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white placeholder:text-highlight-dim/30 focus:border-neon-green/40 focus:outline-none"
          />
          {player && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onScore?.(-1)}
                className="rounded-md border border-white/15 bg-black/40 p-1.5 text-highlight-dim hover:text-red-400"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="font-mono text-sm text-white">
                Score: {player.score}
              </span>
              <button
                type="button"
                onClick={() => onScore?.(1)}
                className="rounded-md border border-white/15 bg-black/40 p-1.5 text-highlight-dim hover:text-neon-green"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        player && (
          <div className="mt-2">
            <p className="font-mono text-base font-bold text-white">{player.name}</p>
            {player.language && (
              <p className="mt-0.5 text-xs text-highlight-dim/50">{player.language}</p>
            )}
          </div>
        )
      )}
    </div>
  );
}
