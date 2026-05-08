"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Radio, Send, Zap } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { Match, Vote } from "@/lib/types";
import { MODIFIER_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

type LogEntry = { id: string; text: string; ts: number };

export default function SimPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [cmd, setCmd] = useState("");

  const supabase = getSupabase();

  const addLog = useCallback((text: string) => {
    setLog((prev) => [{ id: crypto.randomUUID(), text, ts: Date.now() }, ...prev].slice(0, 80));
  }, []);

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
        .in("status", ["active", "lobby"])
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const m = (data?.[0] as Match) ?? null;
      setMatch(m);
      if (!m) return;

      const { data: vData } = await supabase.from("votes").select("*").eq("match_id", m.id);
      if (cancelled) return;
      setVotes((vData as Vote[]) ?? []);
      addLog(`Loaded match ${m.id.slice(0, 8)} with ${vData?.length ?? 0} votes`);
    }
    init();

    const ch = supabase
      .channel("sim-votes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, (p) => {
        setVotes((prev) => [...prev, p.new as Vote]);
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function castVote(command: string, times = 1) {
    if (!match) return;
    const rows = Array.from({ length: times }, () => ({
      match_id: match.id,
      command,
    }));
    await supabase.from("votes").insert(rows);
    addLog(`!${command} x${times}`);
  }

  function handleCommand() {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    const command = trimmed.replace(/^!/, "");
    const option = MODIFIER_OPTIONS.find((o) => o.id === command);
    if (option) {
      castVote(option.id);
    } else {
      addLog(`Unknown command: ${trimmed}`);
    }
    setCmd("");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 md:px-6">
      <div className="flex items-center gap-3">
        <Radio className="size-5 text-neon-green" />
        <h1 className="font-heading text-2xl font-bold text-white">Chat Simulator</h1>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/30">
          DEV TOOL
        </span>
      </div>

      {!match ? (
        <div className="ks-panel rounded-xl p-6 text-center text-highlight-dim/50">
          No active match found. Create one in{" "}
          <a href="/control" className="text-neon-green underline">/control</a>{" "}
          first.
        </div>
      ) : (
        <>
          <div className="ks-panel rounded-xl p-5">
            <p className="mb-3 text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
              Match {match.id.slice(0, 8)} — {match.status}
            </p>
            <div className="flex flex-wrap gap-2">
              {MODIFIER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => castVote(opt.id)}
                  className="rounded-md bg-neon-green/15 px-4 py-2.5 text-sm font-bold text-neon-green ring-1 ring-neon-green/30 transition hover:bg-neon-green/25"
                >
                  !{opt.id}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const opt = MODIFIER_OPTIONS[Math.floor(Math.random() * MODIFIER_OPTIONS.length)];
                  castVote(opt.id, 10);
                }}
                className="rounded-md bg-volt-purple/15 px-4 py-2.5 text-sm font-bold text-volt-purple ring-1 ring-volt-purple/30 transition hover:bg-volt-purple/25"
              >
                <Zap className="mr-1 inline size-3.5" /> Spam 10
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {MODIFIER_OPTIONS.map((opt) => {
                const count = voteCounts[opt.id] ?? 0;
                const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                return (
                  <div key={opt.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-highlight-dim uppercase">{opt.label}</span>
                      <span className="font-mono text-neon-green">{count} (+{pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/50 ring-1 ring-inset ring-white/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          "bg-gradient-to-r from-neon-green to-electric-blue",
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ks-panel rounded-xl p-4">
            <div className="flex gap-2">
              <input
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                placeholder="Type a command like !time-crunch or !darkmode"
                className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-highlight-dim/30 focus:border-neon-green/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCommand}
                className="rounded-md bg-neon-green/15 px-4 py-2 text-neon-green ring-1 ring-neon-green/30 hover:bg-neon-green/25"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>

          <div className="ks-panel max-h-64 overflow-y-auto rounded-xl p-4">
            <p className="mb-2 text-xs font-semibold tracking-wider text-highlight-dim/50 uppercase">
              Event log
            </p>
            {log.length === 0 ? (
              <p className="text-xs text-highlight-dim/35">No events yet</p>
            ) : (
              <ul className="space-y-1 font-mono text-xs text-highlight-dim">
                {log.map((entry) => (
                  <li key={entry.id}>
                    <span className="text-highlight-dim/35">
                      {new Date(entry.ts).toLocaleTimeString()}
                    </span>{" "}
                    {entry.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
