"use client";

import { useMemo } from "react";
import { Radio } from "lucide-react";
import { CommentaryTicker } from "@/components/battle/CommentaryTicker";
import { ContestantSlot } from "@/components/battle/ContestantSlot";
import { CountdownTimer } from "@/components/battle/CountdownTimer";
import { ModifierAlert } from "@/components/battle/ModifierAlert";
import { VoteBar } from "@/components/battle/VoteBar";
import { describeMatchOutcome } from "@/lib/matchOutcome";
import { MODIFIER_OPTIONS } from "@/lib/types";
import { useLiveMatch } from "@/lib/useLiveMatch";

export default function OverlayPage() {
  const { match, players, votes, refreshing } = useLiveMatch();

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const vote of votes) {
      counts[vote.command] = (counts[vote.command] ?? 0) + 1;
    }
    return counts;
  }, [votes]);

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center font-heading text-lg text-highlight-dim/40">
        {refreshing ? "Connecting to match…" : "Waiting for a match…"}
      </div>
    );
  }

  const modActive = match.active_modifier !== "none";
  const outcome = match.status === "finished" ? describeMatchOutcome(players) : null;

  return (
    <div className="flex h-screen flex-col justify-between bg-transparent p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-300 ring-1 ring-red-400/40">
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
            {match.status === "finished" ? "FINAL" : match.status === "active" ? "LIVE" : "STANDBY"}
          </span>
          <Radio className="size-4 text-neon-green" />
          <span className="text-sm font-semibold text-white">
            Round {Math.min(match.round, match.best_of)} / {match.best_of}
          </span>
        </div>
        <CountdownTimer
          key={`${match.id}:${match.status}:${match.timer}:${match.timer_started_at ?? ""}`}
          seconds={match.timer}
          startedAt={match.timer_started_at}
          running={match.status === "active"}
        />
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">
          4-player broadcast cockpit
        </div>
      </div>

      {outcome && (
        <div className="mx-auto mt-5 rounded-xl border border-neon-green/45 bg-black/80 px-6 py-4 text-center shadow-[0_0_50px_rgb(57_255_20_/_0.18)]">
          <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-neon-green">
            {outcome.label}
          </p>
          <p className="mt-1 font-heading text-2xl font-black text-white">{outcome.detail}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((slot) => (
          <ContestantSlot
            key={slot}
            slot={slot}
            player={players.find((player) => player.slot === slot) ?? null}
          />
        ))}
      </div>

      <div className="mt-4">
        <ModifierAlert modifierType={match.active_modifier} active={modActive} />
      </div>

      <div className="flex-1" />

      <div className="space-y-3">
        {match.problem_title && (
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold uppercase text-highlight-dim/50">Problem</span>
            <span className="font-mono text-sm text-white">{match.problem_title}</span>
            {match.problem_difficulty && (
              <span className="rounded-full bg-volt-purple/15 px-2 py-0.5 text-[10px] font-bold text-volt-purple ring-1 ring-volt-purple/30">
                {match.problem_difficulty}
              </span>
            )}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MODIFIER_OPTIONS.slice(0, 3).map((option) => (
            <VoteBar
              key={option.id}
              label={option.label}
              count={voteCounts[option.id] ?? 0}
              total={Math.max(1, votes.length)}
            />
          ))}
        </div>

        <p className="text-[10px] uppercase tracking-wide text-white/35">
          Modifiers are show rules enforced by the producer/contestants; editor embeds are not programmatically restricted.
        </p>
        <CommentaryTicker text={null} />
      </div>
    </div>
  );
}
