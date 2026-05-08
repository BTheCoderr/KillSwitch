"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ReplitGrid } from "@/components/battle/ReplitGrid";
import { getSupabase } from "@/lib/supabase";
import type { Match, Player } from "@/lib/types";

export function GridContent() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player");
  const soloSlot = playerParam ? parseInt(playerParam, 10) : null;

  const [players, setPlayers] = useState<Player[]>([]);
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;

    async function init() {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const m = (data?.[0] as Match) ?? null;
      if (!m) return;
      setMatchId(m.id);

      const { data: pData } = await supabase
        .from("players")
        .select("*")
        .eq("match_id", m.id);
      if (cancelled) return;
      setPlayers((pData as Player[]) ?? []);
    }

    init();

    const ch = supabase
      .channel("grid-players")
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, (p) => {
        const row = p.new as Player;
        setPlayers((prev) => {
          const idx = prev.findIndex((c) => c.id === row.id);
          return idx >= 0 ? prev.map((c, i) => (i === idx ? row : c)) : [...prev, row];
        });
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, []);

  if (!matchId) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-heading text-lg text-highlight-dim/40">
        Waiting for an active match...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] p-3 md:p-4">
      <ReplitGrid
        players={players}
        soloSlot={soloSlot && soloSlot >= 1 && soloSlot <= 4 ? soloSlot : null}
      />
    </div>
  );
}
