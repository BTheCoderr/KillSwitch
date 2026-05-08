"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Radio, Sparkles, Zap } from "lucide-react";
import { ContestantSlot } from "@/components/battle/ContestantSlot";
import { CountdownTimer } from "@/components/battle/CountdownTimer";
import { MatchControls } from "@/components/battle/MatchControls";
import { VoteBar } from "@/components/battle/VoteBar";
import { CommentaryTicker } from "@/components/battle/CommentaryTicker";
import { getSupabase } from "@/lib/supabase";
import type { Match, Player, Vote } from "@/lib/types";
import { MODIFIER_OPTIONS } from "@/lib/types";

export default function ControlPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [latestCommentary, setLatestCommentary] = useState<string | null>(null);
  const [commentaryLoading, setCommentaryLoading] = useState(false);

  const match = matches.find((m) => m.id === activeId) ?? null;
  const supabase = getSupabase();

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of votes) counts[v.command] = (counts[v.command] ?? 0) + 1;
    return counts;
  }, [votes]);
  const totalVotes = votes.length;

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      const rows = (data as Match[]) ?? [];
      setMatches(rows);
      if (rows.length > 0) setActiveId((prev) => prev ?? rows[0].id);
    }
    init();
    return () => { cancelled = true; };
  }, [supabase]);

  const loadMatchData = useCallback(
    async (matchId: string) => {
      const [pRes, vRes] = await Promise.all([
        supabase.from("players").select("*").eq("match_id", matchId),
        supabase.from("votes").select("*").eq("match_id", matchId),
      ]);
      setPlayers((pRes.data as Player[]) ?? []);
      setVotes((vRes.data as Vote[]) ?? []);
    },
    [supabase],
  );

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    (async () => {
      await loadMatchData(activeId);
      if (cancelled) return;
    })();

    const ch = supabase
      .channel(`control-${activeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, (p) => {
        const row = p.new as Match;
        setMatches((prev) => prev.map((m) => (m.id === row.id ? row : m)));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, (p) => {
        const row = p.new as Player;
        setPlayers((prev) => {
          const idx = prev.findIndex((c) => c.id === row.id);
          return idx >= 0 ? prev.map((c, i) => (i === idx ? row : c)) : [...prev, row];
        });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, (p) => {
        setVotes((prev) => [...prev, p.new as Vote]);
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [activeId, supabase, loadMatchData]);

  async function createMatch() {
    const { data } = await supabase
      .from("matches")
      .insert({ status: "lobby" })
      .select()
      .single();
    if (!data) return;
    const m = data as Match;
    setMatches((prev) => [m, ...prev]);
    setActiveId(m.id);
  }

  async function updateMatch(fields: Partial<Match>) {
    if (!activeId) return;
    await supabase.from("matches").update(fields).eq("id", activeId);
  }

  async function upsertPlayer(slot: number, field: string, value: string | number) {
    if (!activeId) return;
    const existing = players.find((p) => p.slot === slot);
    if (existing) {
      await supabase.from("players").update({ [field]: value }).eq("id", existing.id);
    } else {
      await supabase.from("players").insert({
        match_id: activeId,
        slot,
        name: field === "name" ? (value as string) : `Player ${slot}`,
        ...(field !== "name" ? { [field]: value } : {}),
      });
    }
    loadMatchData(activeId);
  }

  async function updateScore(slot: number, delta: number) {
    const p = players.find((pl) => pl.slot === slot);
    if (!p) return;
    await supabase.from("players").update({ score: Math.max(0, p.score + delta) }).eq("id", p.id);
  }

  async function fireModifier(modType: string) {
    if (!activeId) return;
    await supabase.from("matches").update({ active_modifier: modType }).eq("id", activeId);
  }

  async function generateCommentary() {
    if (!activeId) return;
    setCommentaryLoading(true);
    try {
      const res = await fetch("/api/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: activeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLatestCommentary(data.body);
      }
    } finally {
      setCommentaryLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
      <div className="flex items-center gap-3">
        <Radio className="size-5 text-neon-green" />
        <h1 className="font-heading text-2xl font-bold text-white">Match Control</h1>
      </div>

      {/* Match selector */}
      <div className="ks-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
            Match
          </label>
          <select
            value={activeId ?? ""}
            onChange={(e) => setActiveId(e.target.value || null)}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value="">Select a match</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id.slice(0, 8)} — {m.status} — R{m.round}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={createMatch}
            className="inline-flex items-center gap-1.5 rounded-md bg-neon-green/15 px-3 py-1.5 text-xs font-bold text-neon-green ring-1 ring-neon-green/30 transition hover:bg-neon-green/25"
          >
            <Plus className="size-3.5" /> New match
          </button>
        </div>
      </div>

      {match && (
        <>
          <div className="ks-panel rounded-xl p-5">
            <div className="flex items-center justify-between gap-4">
              <MatchControls
                match={match}
                onSetStatus={(s) => updateMatch({ status: s })}
                onStartRound={(dur) => updateMatch({ timer: dur, status: "active" })}
                onPause={() => updateMatch({ status: "lobby" })}
                onAdvanceRound={() => updateMatch({ round: match.round + 1 })}
              />
              <CountdownTimer seconds={match.timer} className="text-2xl md:text-4xl" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
                  Problem title
                </label>
                <input
                  defaultValue={match.problem_title ?? ""}
                  onBlur={(e) => updateMatch({ problem_title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-neon-green/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
                  Difficulty
                </label>
                <input
                  defaultValue={match.problem_difficulty ?? ""}
                  onBlur={(e) => updateMatch({ problem_difficulty: e.target.value })}
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-neon-green/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="ks-panel rounded-xl p-5">
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
              Player slots
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((slot) => (
                <ContestantSlot
                  key={slot}
                  slot={slot}
                  player={players.find((p) => p.slot === slot) ?? null}
                  editable
                  onUpdate={(f, v) => upsertPlayer(slot, f, v)}
                  onScore={(d) => updateScore(slot, d)}
                />
              ))}
            </div>
          </div>

          <div className="ks-panel rounded-xl p-5">
            <p className="mb-3 text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
              Audience votes
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MODIFIER_OPTIONS.map((opt) => (
                <VoteBar
                  key={opt.id}
                  label={opt.label}
                  count={voteCounts[opt.id] ?? 0}
                  total={Math.max(1, totalVotes)}
                />
              ))}
            </div>
          </div>

          <div className="ks-panel rounded-xl p-5">
            <p className="mb-3 text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
              Fire modifier (manual)
            </p>
            <div className="flex flex-wrap gap-2">
              {MODIFIER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => fireModifier(opt.id)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-neon-green/15 px-3 py-2 text-xs font-bold text-neon-green ring-1 ring-neon-green/30 transition hover:bg-neon-green/25"
                >
                  <Zap className="size-3.5" /> {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => fireModifier("none")}
                className="rounded-md bg-red-500/15 px-3 py-2 text-xs font-bold text-red-300 ring-1 ring-red-400/30 hover:bg-red-500/25"
              >
                Clear modifier
              </button>
            </div>
          </div>

          <div className="ks-panel rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
                AI commentary
              </p>
              <button
                type="button"
                onClick={generateCommentary}
                disabled={commentaryLoading}
                className="inline-flex items-center gap-1.5 rounded-md bg-volt-purple/15 px-3 py-2 text-xs font-bold text-volt-purple ring-1 ring-volt-purple/30 transition hover:bg-volt-purple/25 disabled:opacity-50"
              >
                <Sparkles className="size-3.5" />
                {commentaryLoading ? "Generating..." : "Generate"}
              </button>
            </div>
            <div className="mt-3">
              <CommentaryTicker text={latestCommentary} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
