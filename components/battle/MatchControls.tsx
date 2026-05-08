"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import { useState } from "react";
import type { Match } from "@/lib/types";
import { cn } from "@/lib/utils";

type MatchControlsProps = {
  match: Match | null;
  onStartRound: (durationSec: number) => void;
  onPause: () => void;
  onAdvanceRound: () => void;
  onSetStatus: (status: Match["status"]) => void;
  className?: string;
};

export function MatchControls({
  match,
  onStartRound,
  onPause,
  onAdvanceRound,
  onSetStatus,
  className,
}: MatchControlsProps) {
  const [duration, setDuration] = useState(600);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
          Status
        </span>
        {(["lobby", "active", "finished"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSetStatus(s)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition",
              match?.status === s
                ? "bg-neon-green/20 text-neon-green ring-1 ring-neon-green/40"
                : "bg-slate-dark/60 text-highlight-dim/60 ring-1 ring-white/10 hover:text-white",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
          Timer
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white focus:outline-none"
        >
          <option value={120}>2 min</option>
          <option value={300}>5 min</option>
          <option value={600}>10 min</option>
          <option value={900}>15 min</option>
          <option value={1200}>20 min</option>
        </select>
        <button
          type="button"
          onClick={() => onStartRound(duration)}
          className="inline-flex items-center gap-1.5 rounded-md bg-neon-green/20 px-3 py-1.5 text-xs font-bold text-neon-green ring-1 ring-neon-green/30 transition hover:bg-neon-green/30"
        >
          <Play className="size-3.5" /> Start
        </button>
        <button
          type="button"
          onClick={onPause}
          className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30 transition hover:bg-amber-500/30"
        >
          <Pause className="size-3.5" /> Pause
        </button>
        <button
          type="button"
          onClick={onAdvanceRound}
          className="inline-flex items-center gap-1.5 rounded-md bg-volt-purple/20 px-3 py-1.5 text-xs font-bold text-volt-purple ring-1 ring-volt-purple/30 transition hover:bg-volt-purple/30"
        >
          <SkipForward className="size-3.5" /> Next round
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-highlight-dim/60">
        <span>
          Round <strong className="text-white">{match?.round ?? 1}</strong> of{" "}
          {match?.best_of ?? 5}
        </span>
      </div>
    </div>
  );
}
