"use client";

import { useMemo, useState } from "react";
import { Brain, Radio, Zap } from "lucide-react";
import { CountdownTimer } from "@/components/battle/CountdownTimer";
import { normalizeEmbedUrl } from "@/lib/embed";
import { describeMatchOutcome } from "@/lib/matchOutcome";
import { MODIFIER_OPTIONS } from "@/lib/types";
import { useLiveMatch } from "@/lib/useLiveMatch";

type ArenaGridProps = {
  matchId?: string;
};

const SLOT_BORDER = [
  "border-[#39FF14]",
  "border-[#2979FF]",
  "border-[#8A2BE2]",
  "border-amber-400",
];

const SLOT_ACCENT = [
  "text-[#39FF14]",
  "text-[#2979FF]",
  "text-[#8A2BE2]",
  "text-amber-400",
];

export default function ArenaGrid({ matchId: propMatchId }: ArenaGridProps) {
  const { match, players, votes, refreshing } = useLiveMatch(propMatchId);
  const [commentary, setCommentary] = useState<string | null>(null);

  const activeModifier = match?.active_modifier ?? "none";
  const modifierActive = activeModifier !== "none";

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const vote of votes) {
      counts[vote.command] = (counts[vote.command] ?? 0) + 1;
    }
    return counts;
  }, [votes]);

  const topModifier = useMemo(() => {
    let best = "";
    let max = 0;
    for (const [command, count] of Object.entries(voteCounts)) {
      if (count > max) {
        max = count;
        best = command;
      }
    }
    return best;
  }, [voteCounts]);

  const leadingPlayer = useMemo(() => {
    if (players.length === 0) return null;
    return [...players].sort((a, b) => b.score - a.score)[0];
  }, [players]);

  const sortedPlayers = useMemo(() => {
    const slots = Array.from({ length: 4 }, () => null) as (typeof players[number] | null)[];
    for (const player of players) {
      if (player.slot >= 1 && player.slot <= 4) slots[player.slot - 1] = player;
    }
    return slots;
  }, [players]);

  if (!match) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1117] font-[Rajdhani] text-xl text-white/30">
        <Zap className="mr-2 size-6 animate-pulse text-[#39FF14]" />
        {refreshing ? "Connecting to match…" : "Waiting for match…"}
      </div>
    );
  }

  const outcome = match.status === "finished" ? describeMatchOutcome(players) : null;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#0F1117] p-4 font-[Rajdhani] text-white">
      <div className="flex items-center justify-between gap-4 border-b border-[#39FF14]/30 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-tighter text-[#39FF14]">
            KILLSWITCH <span className="text-white/60">LIVE</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            {match.status === "finished"
              ? "FINAL"
              : match.status === "active"
                ? `ROUND ${Math.min(match.round, match.best_of)} OF ${match.best_of}`
                : `STANDBY · ROUND ${Math.min(match.round, match.best_of)} OF ${match.best_of}`}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {match.problem_title && (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                Problem
              </span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-sm font-bold">
                {match.problem_title}
              </span>
              {match.problem_difficulty && (
                <span className="rounded bg-[#8A2BE2]/25 px-1.5 py-0.5 text-[10px] font-bold text-[#8A2BE2] ring-1 ring-[#8A2BE2]/40">
                  {match.problem_difficulty}
                </span>
              )}
            </div>
          )}
          <CountdownTimer
            key={`${match.id}:${match.status}:${match.timer}:${match.timer_started_at ?? ""}`}
            seconds={match.timer}
            startedAt={match.timer_started_at}
            running={match.status === "active"}
            className="text-4xl"
          />
        </div>

        <div className="hidden items-center gap-3 text-sm text-white/60 lg:flex">
          <Radio className="size-4 text-[#39FF14]" />
          <span className="font-mono">
            {players.filter((player) => normalizeEmbedUrl(player.replit_url)).length}/4 embeds loaded
          </span>
        </div>
      </div>

      {outcome && (
        <div className="mx-auto mt-3 rounded-xl border border-[#39FF14]/50 bg-black/80 px-7 py-3 text-center shadow-[0_0_45px_rgb(57_255_20_/_0.16)]">
          <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-[#39FF14]">
            {outcome.label}
          </p>
          <p className="mt-1 text-2xl font-black text-white">{outcome.detail}</p>
        </div>
      )}

      <div className="my-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {sortedPlayers.map((player, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                player ? SLOT_BORDER[index].replace("border-", "bg-") : "bg-white/15"
              }`}
            />
            <span className="text-sm font-bold tracking-widest">
              {player?.name ?? `SLOT ${index + 1}`}
            </span>
            <span className={`font-mono text-lg font-black ${SLOT_ACCENT[index]}`}>
              {player?.score ?? 0}
            </span>
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3" style={{ minHeight: "60vh" }}>
        {sortedPlayers.map((player, index) => {
          const embedUrl = normalizeEmbedUrl(player?.replit_url);
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border-2 border-slate-800"
            >
              <div
                className={`absolute left-0 top-0 z-10 flex items-center gap-3 border-b border-r ${SLOT_BORDER[index]} bg-slate-900/85 px-3 py-2`}
              >
                <span className="text-sm font-bold tracking-widest">
                  {player?.name ?? `SLOT ${index + 1}`}
                </span>
                <span className={`font-mono font-bold ${SLOT_ACCENT[index]}`}>
                  {player?.score ?? 0}
                </span>
                {player?.language && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white/50">
                    {player.language}
                  </span>
                )}
              </div>

              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${player?.name ?? `Slot ${index + 1}`} — Slot ${index + 1}`}
                  className={`h-full w-full transition-all ${
                    modifierActive
                      ? "grayscale-[0.6]"
                      : "grayscale-[0.3] group-hover:grayscale-0"
                  }`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  allow="clipboard-write"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-black/60 text-lg text-white/15">
                  {player ? "No supported embed URL" : "Empty slot"}
                </div>
              )}

              {modifierActive && (
                <div className="glitch-overlay pointer-events-none absolute inset-0 border-4 border-red-500/50 bg-red-500/5 mix-blend-overlay">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 text-4xl font-black uppercase text-red-500 opacity-40">
                    {activeModifier.replace(/-/g, " ")}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4" style={{ minHeight: "12vh" }}>
        <div className="rounded border-l-4 border-[#39FF14] bg-[#1C202B] p-3">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#39FF14]">
            <Zap className="size-3.5" />
            Active Modifier
          </h4>
          <p className="mt-1 text-xl font-bold italic">
            {modifierActive ? activeModifier.replace(/-/g, " ").toUpperCase() : "NONE"}
          </p>
          {topModifier && (
            <p className="mt-1 text-[10px] text-white/40">
              Top vote: {topModifier.replace(/-/g, " ")} ({voteCounts[topModifier]})
            </p>
          )}
          <p className="mt-1 text-[9px] uppercase tracking-wide text-white/30">
            Producer-enforced show rule
          </p>
        </div>

        <div className="rounded border-l-4 border-[#2979FF] bg-[#1C202B] p-3">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2979FF]">
            <Brain className="size-3.5" />
            Live Explainer <span className="normal-case text-white/25">(match-aware)</span>
          </h4>
          <p className="mt-1 text-sm leading-tight text-white/80">
            {commentary ??
              (leadingPlayer
                ? `${leadingPlayer.name} leads with ${leadingPlayer.score} pts. Watch for the next modifier to shift momentum.`
                : "Waiting for match data…")}
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch("/api/commentary", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ matchId: match.id }),
                });
                if (response.ok) {
                  const data = (await response.json()) as { body?: string };
                  setCommentary(data.body ?? null);
                }
              } catch {
                // Broadcast should remain usable if commentary is unavailable.
              }
            }}
            className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#2979FF]/60 transition hover:text-[#2979FF]"
          >
            Refresh insight
          </button>
        </div>

        <div className="rounded border-l-4 border-[#8A2BE2] bg-[#1C202B] p-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A2BE2]">
            Spectator Poll
          </h4>
          <div className="mt-2 space-y-1.5">
            {MODIFIER_OPTIONS.slice(0, 3).map((option) => {
              const count = voteCounts[option.id] ?? 0;
              const total = votes.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={option.id}>
                  <div className="flex justify-between text-[10px]">
                    <span className="uppercase text-white/50">{option.label}</span>
                    <span className="font-mono text-[#39FF14]">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-[#39FF14] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-1.5 text-right text-[10px] text-white/30">
            {votes.length} total votes
          </p>
        </div>
      </div>
    </div>
  );
}
