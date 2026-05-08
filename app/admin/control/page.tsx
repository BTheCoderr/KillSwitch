"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Brain,
  ChevronDown,
  Minus,
  Pause,
  Play,
  Plus,
  Radio,
  SkipForward,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { Match, Player, Vote } from "@/lib/types";

/* ── Modifier palette ── */
const MODIFIERS = [
  { id: "none", label: "Reset Arena", color: "bg-slate-700 hover:bg-slate-600" },
  { id: "reverse-iteration", label: "Reverse Logic", color: "bg-purple-600 hover:bg-purple-500" },
  { id: "time-crunch", label: "Time Crunch", color: "bg-red-600 hover:bg-red-500" },
  { id: "memory-limit", label: "Memory Limit", color: "bg-amber-600 hover:bg-amber-500" },
  { id: "bright-pink", label: "Neon Overload", color: "bg-[#39FF14] text-black hover:brightness-110" },
  { id: "no-backspace", label: "No Backspace", color: "bg-rose-700 hover:bg-rose-600" },
  { id: "darkmode", label: "Dark Mode", color: "bg-indigo-700 hover:bg-indigo-600" },
] as const;

type LogEntry = { id: string; ts: number; text: string; type: "info" | "modifier" | "vote" | "error" | "score" };

const LOG_COLORS: Record<LogEntry["type"], string> = {
  info: "text-slate-400",
  modifier: "text-[#39FF14]",
  vote: "text-[#2979FF]",
  error: "text-red-400",
  score: "text-amber-300",
};

export default function AdminControl() {
  const supabase = getSupabase();

  const [matches, setMatches] = useState<Match[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const match = matches.find((m) => m.id === activeId) ?? null;

  const addLog = useCallback((text: string, type: LogEntry["type"] = "info") => {
    setLog((prev) =>
      [{ id: crypto.randomUUID(), ts: Date.now(), text, type }, ...prev].slice(0, 200),
    );
  }, []);

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of votes) counts[v.command] = (counts[v.command] ?? 0) + 1;
    return counts;
  }, [votes]);

  /* ── Init: load matches ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      const rows = (data as Match[]) ?? [];
      setMatches(rows);
      if (rows.length > 0) {
        const first = rows[0];
        setActiveId((prev) => prev ?? first.id);
        addLog(`Loaded ${rows.length} match(es)`);
      } else {
        addLog("No matches found — create one to start", "info");
      }
    })();
    return () => { cancelled = true; };
  }, [supabase, addLog]);

  /* ── Load match data + subscribe ── */
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
      addLog(`Subscribed to match ${activeId.slice(0, 8)}`);
    })();

    const ch = supabase
      .channel(`admin-${activeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, (p) => {
        const row = p.new as Match;
        setMatches((prev) => prev.map((m) => (m.id === row.id ? row : m)));
        if (row.active_modifier !== "none") {
          addLog(`Modifier fired: ${row.active_modifier.replace(/-/g, " ").toUpperCase()}`, "modifier");
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, (p) => {
        const row = p.new as Player;
        setPlayers((prev) => {
          const idx = prev.findIndex((c) => c.id === row.id);
          return idx >= 0 ? prev.map((c, i) => (i === idx ? row : c)) : [...prev, row];
        });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, (p) => {
        const row = p.new as Vote;
        setVotes((prev) => [...prev, row]);
        addLog(`Vote received: !${row.command}`, "vote");
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [activeId, supabase, loadMatchData, addLog]);

  /* ── Actions ── */
  async function createMatch() {
    setLoading(true);
    const { data, error } = await supabase
      .from("matches")
      .insert({ status: "lobby" })
      .select()
      .single();
    setLoading(false);
    if (error) {
      addLog(`Create failed: ${error.message}`, "error");
      return;
    }
    const m = data as Match;
    setMatches((prev) => [m, ...prev]);
    setActiveId(m.id);
    addLog(`Match created: ${m.id.slice(0, 8)}`);
  }

  async function triggerModifier(modId: string) {
    if (!activeId) return;
    setLoading(true);
    addLog(`Executing DB mutation → ${modId}...`, "modifier");
    const { error } = await supabase
      .from("matches")
      .update({ active_modifier: modId })
      .eq("id", activeId);
    setLoading(false);
    if (error) {
      addLog(`Trigger failed: ${error.message}`, "error");
    }
  }

  async function updateMatch(fields: Partial<Match>) {
    if (!activeId) return;
    const { error } = await supabase.from("matches").update(fields).eq("id", activeId);
    if (error) addLog(`Update failed: ${error.message}`, "error");
  }

  async function updateScore(playerId: string, playerName: string, delta: number) {
    const p = players.find((pl) => pl.id === playerId);
    if (!p) return;
    const newScore = Math.max(0, p.score + delta);
    await supabase.from("players").update({ score: newScore }).eq("id", p.id);
    addLog(`${playerName} score → ${newScore}`, "score");
  }

  async function generateCommentary() {
    if (!activeId) return;
    setLoading(true);
    addLog("Calling AI commentary endpoint...", "info");
    try {
      const res = await fetch("/api/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: activeId }),
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`AI: "${data.body}"`, "info");
      } else {
        addLog("Commentary endpoint returned error", "error");
      }
    } catch {
      addLog("Failed to reach commentary endpoint", "error");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-black p-6 font-mono text-white md:p-8">
      {/* ── Header ── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#39FF14]">
            <Zap className="size-7 fill-[#39FF14]" />
            KILLSWITCH CONTROL
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Producer dashboard — hidden route, not indexed
          </p>
        </div>
        <div className="flex items-center gap-3">
          {match && (
            <span className="flex items-center gap-1.5 rounded bg-slate-800 px-3 py-1.5 text-xs">
              <Radio className="size-3 text-[#39FF14]" />
              {match.status.toUpperCase()} — R{match.round}/{match.best_of}
            </span>
          )}
          <a
            href="/live"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-slate-800 px-3 py-1.5 text-xs text-[#39FF14] hover:bg-slate-700"
          >
            Open /live &rarr;
          </a>
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* ── Match Selector ── */}
          <section className="rounded-lg border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Match
              </h2>
              <button
                type="button"
                onClick={createMatch}
                disabled={loading}
                className="rounded bg-[#39FF14]/15 px-3 py-1.5 text-xs font-bold text-[#39FF14] ring-1 ring-[#39FF14]/30 transition hover:bg-[#39FF14]/25 disabled:opacity-50"
              >
                + New match
              </button>
            </div>
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setMatchOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded border border-slate-700 bg-black px-3 py-2 text-sm text-white"
              >
                {match ? (
                  <span>
                    {match.id.slice(0, 8)} — {match.status} — R{match.round}
                  </span>
                ) : (
                  <span className="text-slate-600">Select a match</span>
                )}
                <ChevronDown className="size-4 text-slate-500" />
              </button>
              {matchOpen && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded border border-slate-700 bg-black py-1">
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setActiveId(m.id);
                        setMatchOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs transition hover:bg-slate-800 ${
                        m.id === activeId ? "text-[#39FF14]" : "text-slate-300"
                      }`}
                    >
                      {m.id.slice(0, 8)} — {m.status} — R{m.round}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {match && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(["lobby", "active", "finished"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateMatch({ status: s })}
                    className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                      match.status === s
                        ? "bg-[#39FF14]/20 text-[#39FF14] ring-1 ring-[#39FF14]/40"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateMatch({ timer: 600, status: "active" })}
                    className="rounded bg-slate-800 p-1.5 text-slate-400 hover:text-[#39FF14]"
                    title="Start 10m timer"
                  >
                    <Play className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMatch({ status: "lobby" })}
                    className="rounded bg-slate-800 p-1.5 text-slate-400 hover:text-amber-300"
                    title="Pause"
                  >
                    <Pause className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMatch({ round: match.round + 1 })}
                    className="rounded bg-slate-800 p-1.5 text-slate-400 hover:text-[#8A2BE2]"
                    title="Next round"
                  >
                    <SkipForward className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ── Modifier Grid (the chaos buttons) ── */}
          <section className="rounded-lg border border-slate-800 bg-slate-950 p-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              Trigger modifier
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {MODIFIERS.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => triggerModifier(mod.id)}
                  disabled={loading}
                  className={`${mod.color} rounded-lg p-5 text-sm font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50`}
                >
                  {mod.label}
                </button>
              ))}
            </div>
            {match && (
              <p className="mt-3 text-xs text-slate-600">
                Current modifier:{" "}
                <span className="font-bold text-[#39FF14]">
                  {match.active_modifier === "none"
                    ? "NONE"
                    : match.active_modifier.replace(/-/g, " ").toUpperCase()}
                </span>
              </p>
            )}
          </section>

          {/* ── Player Slots ── */}
          {match && (
            <section className="rounded-lg border border-slate-800 bg-slate-950 p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                Players
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((slot) => {
                  const p = players.find((pl) => pl.slot === slot);
                  return (
                    <div
                      key={slot}
                      className="rounded-lg border border-slate-800 bg-black p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Slot {slot}
                        </span>
                        {p && (
                          <span className="font-mono text-lg font-black text-white">
                            {p.score}
                          </span>
                        )}
                      </div>
                      {p ? (
                        <>
                          <p className="mt-1 text-sm font-bold">{p.name}</p>
                          {p.language && (
                            <p className="text-[10px] text-slate-500">{p.language}</p>
                          )}
                          <div className="mt-2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateScore(p.id, p.name, -1)}
                              className="rounded bg-slate-800 p-1 text-slate-400 hover:text-red-400"
                            >
                              <Minus className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => updateScore(p.id, p.name, 1)}
                              className="rounded bg-slate-800 p-1 text-slate-400 hover:text-[#39FF14]"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="mt-2 text-xs text-slate-700">Empty</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Quick Vote Buttons (replaces Twitch bot for MVP) ── */}
          {match && (
            <section className="rounded-lg border border-dashed border-[#2979FF]/30 bg-slate-950 p-5">
              <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-[#2979FF]">
                Simulate chat votes
              </h2>
              <p className="mb-4 text-[10px] text-slate-600">
                No Twitch bot needed — click to cast votes directly into Supabase.
                Use during the stream to simulate audience interaction.
              </p>
              <div className="flex flex-wrap gap-2">
                {MODIFIERS.filter((m) => m.id !== "none").map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={async () => {
                      if (!activeId) return;
                      await supabase.from("votes").insert({ match_id: activeId, command: mod.id });
                      addLog(`Manual vote: !${mod.id}`, "vote");
                    }}
                    className="rounded border border-[#2979FF]/30 bg-[#2979FF]/10 px-3 py-2 text-xs font-bold text-[#2979FF] transition hover:bg-[#2979FF]/20"
                  >
                    !{mod.id}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={async () => {
                    if (!activeId) return;
                    const mods = MODIFIERS.filter((m) => m.id !== "none");
                    const random = mods[Math.floor(Math.random() * mods.length)];
                    const rows = Array.from({ length: 10 }, () => ({
                      match_id: activeId,
                      command: random.id,
                    }));
                    await supabase.from("votes").insert(rows);
                    addLog(`Spam 10x: !${random.id}`, "vote");
                  }}
                  className="rounded border border-[#8A2BE2]/30 bg-[#8A2BE2]/10 px-3 py-2 text-xs font-bold text-[#8A2BE2] transition hover:bg-[#8A2BE2]/20"
                >
                  Spam 10 random
                </button>
              </div>
            </section>
          )}

          {/* ── Vote Tally ── */}
          {votes.length > 0 && (
            <section className="rounded-lg border border-slate-800 bg-slate-950 p-5">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                Vote tally ({votes.length} total)
              </h2>
              <div className="grid gap-2 sm:grid-cols-3">
                {Object.entries(voteCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cmd, count]) => {
                    const pct = Math.round((count / votes.length) * 100);
                    return (
                      <div key={cmd} className="rounded bg-black p-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="uppercase text-slate-400">
                            {cmd.replace(/-/g, " ")}
                          </span>
                          <span className="font-mono text-[#39FF14]">{count}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-[#39FF14] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          {/* ── AI Commentary ── */}
          <section className="rounded-lg border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2979FF]">
                <Brain className="size-3.5" /> AI Commentary
              </h2>
              <button
                type="button"
                onClick={generateCommentary}
                disabled={loading}
                className="flex items-center gap-1.5 rounded bg-[#2979FF]/15 px-3 py-1.5 text-xs font-bold text-[#2979FF] ring-1 ring-[#2979FF]/30 transition hover:bg-[#2979FF]/25 disabled:opacity-50"
              >
                <Sparkles className="size-3" />
                Generate
              </button>
            </div>
          </section>
        </div>

        {/* ── Right Column: Live Log ── */}
        <div className="flex flex-col rounded-lg border border-dashed border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Live Match Logs
            </h3>
            <button
              type="button"
              onClick={() => setLog([])}
              className="rounded p-1 text-slate-600 hover:text-red-400"
              title="Clear logs"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto p-4 text-xs leading-relaxed"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {log.length === 0 ? (
              <p className="text-slate-700">No events yet...</p>
            ) : (
              log.map((entry) => (
                <div key={entry.id} className="mb-1">
                  <span className="text-slate-600">[{new Date(entry.ts).toLocaleTimeString("en-US", { hour12: false })}]</span>{" "}
                  <span className={LOG_COLORS[entry.type]}>{entry.text}</span>
                </div>
              ))
            )}
            {loading && (
              <div className="mt-2 animate-pulse text-[#39FF14] underline">
                Executing DB Mutation...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
