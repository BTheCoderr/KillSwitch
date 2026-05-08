"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, Radio, Zap } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { Match, Player, Vote } from "@/lib/types";
import { MODIFIER_OPTIONS } from "@/lib/types";

type ArenaGridProps = {
  matchId?: string;
};

/**
 * Embed URL prefixes — players can paste full URLs from any provider.
 * For the zero-config MVP we support Playcode, StackBlitz, and Replit.
 * Just paste the full embed URL into the player's `replit_url` field.
 *
 * Examples:
 *   Playcode:   https://playcode.io/embed/PROJECT_ID
 *   StackBlitz: https://stackblitz.com/edit/PROJECT?embed=1
 *   Replit:     https://replit.com/@user/project?embed=true
 */
const EMBED_FALLBACK = "https://playcode.io/";

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
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [commentary, setCommentary] = useState<string | null>(null);

  const activeModifier = match?.active_modifier ?? "none";
  const modifierActive = activeModifier !== "none";

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of votes) counts[v.command] = (counts[v.command] ?? 0) + 1;
    return counts;
  }, [votes]);

  const topModifier = useMemo(() => {
    let best = "";
    let max = 0;
    for (const [cmd, count] of Object.entries(voteCounts)) {
      if (count > max) {
        max = count;
        best = cmd;
      }
    }
    return best;
  }, [voteCounts]);

  const leadingPlayer = useMemo(() => {
    if (players.length === 0) return null;
    return [...players].sort((a, b) => b.score - a.score)[0];
  }, [players]);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;

    async function init() {
      let mId = propMatchId;

      if (!mId) {
        const { data } = await supabase
          .from("matches")
          .select("*")
          .in("status", ["active", "lobby"])
          .order("created_at", { ascending: false })
          .limit(1);
        if (cancelled) return;
        const m = (data?.[0] as Match) ?? null;
        if (!m) return;
        setMatch(m);
        mId = m.id;
      } else {
        const { data } = await supabase
          .from("matches")
          .select("*")
          .eq("id", mId)
          .single();
        if (cancelled) return;
        if (data) setMatch(data as Match);
      }

      const [pRes, vRes] = await Promise.all([
        supabase.from("players").select("*").eq("match_id", mId),
        supabase.from("votes").select("*").eq("match_id", mId),
      ]);
      if (cancelled) return;
      setPlayers((pRes.data as Player[]) ?? []);
      setVotes((vRes.data as Vote[]) ?? []);
    }

    init();

    const matchCh = supabase
      .channel("arena-grid-matches")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches" },
        (payload) => {
          const row = payload.new as Match;
          setMatch((prev) => (prev && prev.id === row.id ? row : prev));
        },
      )
      .subscribe();

    const playerCh = supabase
      .channel("arena-grid-players")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        (payload) => {
          const row = payload.new as Player;
          setPlayers((prev) => {
            const idx = prev.findIndex((p) => p.id === row.id);
            return idx >= 0
              ? prev.map((p, i) => (i === idx ? row : p))
              : [...prev, row];
          });
        },
      )
      .subscribe();

    const voteCh = supabase
      .channel("arena-grid-votes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        (payload) => {
          setVotes((prev) => [...prev, payload.new as Vote]);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(matchCh);
      supabase.removeChannel(playerCh);
      supabase.removeChannel(voteCh);
    };
  }, [propMatchId]);

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  const sortedPlayers = useMemo(() => {
    const slots: (Player | null)[] = [null, null, null, null];
    for (const p of players) {
      if (p.slot >= 1 && p.slot <= 4) slots[p.slot - 1] = p;
    }
    return slots;
  }, [players]);

  if (!match) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1117] font-[Rajdhani] text-xl text-white/30">
        <Zap className="mr-2 size-6 animate-pulse text-[#39FF14]" />
        Waiting for match...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#0F1117] p-4 font-[Rajdhani] text-white">
      {/* ── Top Bar / HUD ── */}
      <div className="flex items-center justify-between border-b border-[#39FF14]/30 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-tighter text-[#39FF14]">
            KILLSWITCH <span className="text-white/60">LIVE</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            ROUND {match.round} OF {match.best_of}
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
          <div
            className={`text-4xl font-black tabular-nums tracking-wider ${
              match.timer <= 30 ? "animate-pulse text-red-400" : "text-[#39FF14]"
            }`}
          >
            {formatTime(match.timer)}
          </div>
        </div>

        <div className="hidden items-center gap-3 text-sm text-white/60 lg:flex">
          <Radio className="size-4 text-[#39FF14]" />
          <span className="font-mono">
            {players.filter((p) => p.replit_url).length}/{players.length} embeds loaded
          </span>
        </div>
      </div>

      {/* ── Player score bar ── */}
      <div className="my-3 flex items-center justify-center gap-6">
        {sortedPlayers.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                p ? SLOT_BORDER[i].replace("border-", "bg-") : "bg-white/15"
              }`}
            />
            <span className="text-sm font-bold tracking-widest">
              {p?.name ?? `SLOT ${i + 1}`}
            </span>
            <span className={`font-mono text-lg font-black ${SLOT_ACCENT[i]}`}>
              {p?.score ?? 0}
            </span>
          </div>
        ))}
      </div>

      {/* ── 2x2 Arena Grid ── */}
      <div className="grid flex-1 grid-cols-2 gap-3" style={{ minHeight: "60vh" }}>
        {sortedPlayers.map((player, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-lg border-2 border-slate-800"
          >
            {/* Player label */}
            <div
              className={`absolute left-0 top-0 z-10 flex items-center gap-3 border-b border-r ${SLOT_BORDER[i]} bg-slate-900/85 px-3 py-2`}
            >
              <span className="text-sm font-bold tracking-widest">
                {player?.name ?? `SLOT ${i + 1}`}
              </span>
              <span className={`font-mono font-bold ${SLOT_ACCENT[i]}`}>
                {player?.score ?? 0}
              </span>
              {player?.language && (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white/50">
                  {player.language}
                </span>
              )}
            </div>

            {/* Code embed (Playcode / StackBlitz / Replit — any URL) */}
            {player?.replit_url ? (
              <iframe
                src={
                  player.replit_url.startsWith("http")
                    ? player.replit_url
                    : `${EMBED_FALLBACK}${player.replit_url}`
                }
                title={`${player.name} — Slot ${i + 1}`}
                className={`h-full w-full transition-all ${
                  modifierActive ? "grayscale-[0.6]" : "grayscale-[0.3] group-hover:grayscale-0"
                }`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                allow="clipboard-write"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-black/60 text-lg text-white/15">
                {player ? "No embed URL" : "Empty slot"}
              </div>
            )}

            {/* Modifier glitch overlay — uses CSS glitch-active animation */}
            {modifierActive && (
              <div className="glitch-overlay pointer-events-none absolute inset-0 border-4 border-red-500/50 bg-red-500/5 mix-blend-overlay">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 text-4xl font-black uppercase text-red-500 opacity-40">
                  {activeModifier.replace(/-/g, " ")}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom HUD ── */}
      <div className="mt-4 grid grid-cols-3 gap-4" style={{ minHeight: "12vh" }}>
        {/* Active Modifier */}
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
        </div>

        {/* AI Explainer */}
        <div className="rounded border-l-4 border-[#2979FF] bg-[#1C202B] p-3">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2979FF]">
            <Brain className="size-3.5" />
            AI Explainer <span className="text-white/25 normal-case">(Beta)</span>
          </h4>
          <p className="mt-1 text-sm leading-tight text-white/80">
            {commentary ??
              (leadingPlayer
                ? `${leadingPlayer.name} leads with ${leadingPlayer.score} pts. Watch for the next modifier to shift momentum.`
                : "Waiting for match data...")}
          </p>
          <button
            type="button"
            onClick={async () => {
              if (!match) return;
              try {
                const res = await fetch("/api/commentary", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ matchId: match.id }),
                });
                if (res.ok) {
                  const data = await res.json();
                  setCommentary(data.body);
                }
              } catch {
                /* swallow */
              }
            }}
            className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#2979FF]/60 transition hover:text-[#2979FF]"
          >
            Refresh insight
          </button>
        </div>

        {/* Spectator Poll */}
        <div className="rounded border-l-4 border-[#8A2BE2] bg-[#1C202B] p-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A2BE2]">
            Spectator Poll
          </h4>
          <div className="mt-2 space-y-1.5">
            {MODIFIER_OPTIONS.slice(0, 3).map((opt) => {
              const count = voteCounts[opt.id] ?? 0;
              const total = votes.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={opt.id}>
                  <div className="flex justify-between text-[10px]">
                    <span className="uppercase text-white/50">{opt.label}</span>
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
