"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio, Trophy, Users } from "lucide-react";
import { CommentaryTicker } from "@/components/battle/CommentaryTicker";
import { ContestantSlot } from "@/components/battle/ContestantSlot";
import { CountdownTimer } from "@/components/battle/CountdownTimer";
import { ModifierAlert } from "@/components/battle/ModifierAlert";
import { VoteBar } from "@/components/battle/VoteBar";
import { StatPill } from "@/components/StatPill";
import { getSupabase } from "@/lib/supabase";
import type { Match, Player, Vote } from "@/lib/types";
import { MODIFIER_OPTIONS } from "@/lib/types";

export default function OverlayPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of votes) {
      counts[v.command] = (counts[v.command] ?? 0) + 1;
    }
    return counts;
  }, [votes]);

  const totalVotes = useMemo(() => votes.length, [votes]);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;

    async function loadInitial() {
      const { data: matches } = await supabase
        .from("matches")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const m = (matches?.[0] as Match) ?? null;
      if (!m) return;
      setMatch(m);

      const [pRes, vRes] = await Promise.all([
        supabase.from("players").select("*").eq("match_id", m.id),
        supabase.from("votes").select("*").eq("match_id", m.id),
      ]);
      if (cancelled) return;
      setPlayers((pRes.data as Player[]) ?? []);
      setVotes((vRes.data as Vote[]) ?? []);
    }

    loadInitial();

    const matchCh = supabase
      .channel("overlay-matches")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, (p) => {
        const row = p.new as Match;
        setMatch((prev) => (prev && prev.id === row.id ? row : prev));
      })
      .subscribe();

    const playerCh = supabase
      .channel("overlay-players")
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, (p) => {
        const row = p.new as Player;
        setPlayers((prev) => {
          const idx = prev.findIndex((c) => c.id === row.id);
          return idx >= 0 ? prev.map((c, i) => (i === idx ? row : c)) : [...prev, row];
        });
      })
      .subscribe();

    const voteCh = supabase
      .channel("overlay-votes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, (p) => {
        setVotes((prev) => [...prev, p.new as Vote]);
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(matchCh);
      supabase.removeChannel(playerCh);
      supabase.removeChannel(voteCh);
    };
  }, []);

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center font-heading text-lg text-highlight-dim/40">
        Waiting for an active match...
      </div>
    );
  }

  const modActive = match.active_modifier !== "none";

  return (
    <div className="flex h-screen flex-col justify-between p-4 md:p-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wide text-red-300 uppercase ring-1 ring-red-400/40">
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
            LIVE
          </span>
          <Radio className="size-4 text-neon-green" />
          <span className="text-sm font-semibold text-white">
            Round {match.round} / {match.best_of}
          </span>
        </div>
        <CountdownTimer seconds={match.timer} />
        <div className="flex items-center gap-2">
          <StatPill label="Viewers" value="--" icon={Users} />
          <StatPill label="Prize" value="$1,000" tone="green" icon={Trophy} />
        </div>
      </div>

      {/* Player name plates */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((slot) => (
          <ContestantSlot
            key={slot}
            slot={slot}
            player={players.find((p) => p.slot === slot) ?? null}
          />
        ))}
      </div>

      {/* Modifier alert */}
      <div className="mt-4">
        <ModifierAlert modifierType={match.active_modifier} active={modActive} />
      </div>

      <div className="flex-1" />

      {/* Bottom: votes + commentary */}
      <div className="space-y-3">
        {match.problem_title && (
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-highlight-dim/50 uppercase">Problem</span>
            <span className="font-mono text-sm text-white">{match.problem_title}</span>
            {match.problem_difficulty && (
              <span className="rounded-full bg-volt-purple/15 px-2 py-0.5 text-[10px] font-bold text-volt-purple ring-1 ring-volt-purple/30">
                {match.problem_difficulty}
              </span>
            )}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MODIFIER_OPTIONS.slice(0, 3).map((opt) => (
            <VoteBar
              key={opt.id}
              label={opt.label}
              count={voteCounts[opt.id] ?? 0}
              total={Math.max(1, totalVotes)}
            />
          ))}
        </div>

        <CommentaryTicker text={null} />
      </div>
    </div>
  );
}
