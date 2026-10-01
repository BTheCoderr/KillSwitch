"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Match, Player, Vote } from "@/lib/types";

type LiveMatchState = {
  match: Match | null;
  players: Player[];
  votes: Vote[];
  refreshing: boolean;
};

export function useLiveMatch(explicitMatchId?: string): LiveMatchState {
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const selectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;
    let playerChannel: ReturnType<typeof supabase.channel> | null = null;
    let voteChannel: ReturnType<typeof supabase.channel> | null = null;

    async function loadMatchData(matchId: string) {
      const [pRes, vRes] = await Promise.all([
        supabase
          .from("players")
          .select("*")
          .eq("match_id", matchId)
          .order("slot", { ascending: true }),
        supabase
          .from("votes")
          .select("*")
          .eq("match_id", matchId)
          .order("created_at", { ascending: true }),
      ]);
      if (cancelled || selectedIdRef.current !== matchId) return;
      setPlayers((pRes.data as Player[]) ?? []);
      setVotes((vRes.data as Vote[]) ?? []);
    }

    async function bindMatchData(matchId: string) {
      if (playerChannel) await supabase.removeChannel(playerChannel);
      if (voteChannel) await supabase.removeChannel(voteChannel);

      selectedIdRef.current = matchId;
      setPlayers([]);
      setVotes([]);
      await loadMatchData(matchId);

      playerChannel = supabase
        .channel(`live-match-players-${matchId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "players",
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            const row = (payload.new || payload.old) as Player;
            if (!row || row.match_id !== matchId) return;
            if (payload.eventType === "DELETE") {
              setPlayers((prev) => prev.filter((p) => p.id !== row.id));
              return;
            }
            setPlayers((prev) => {
              const idx = prev.findIndex((p) => p.id === row.id);
              return idx >= 0
                ? prev.map((p, i) => (i === idx ? row : p))
                : [...prev, row].sort((a, b) => a.slot - b.slot);
            });
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") void loadMatchData(matchId);
        });

      voteChannel = supabase
        .channel(`live-match-votes-${matchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "votes",
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            const row = payload.new as Vote;
            if (row.match_id !== matchId) return;
            setVotes((prev) => [...prev, row]);
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") void loadMatchData(matchId);
        });
    }

    async function refreshMatch() {
      setRefreshing(true);
      let query = supabase.from("matches").select("*");

      if (explicitMatchId) {
        const { data } = await query.eq("id", explicitMatchId).maybeSingle();
        if (cancelled) return;
        const next = (data as Match | null) ?? null;
        setMatch(next);
        if (next && selectedIdRef.current !== next.id) {
          await bindMatchData(next.id);
        }
        setRefreshing(false);
        return;
      }

      const { data } = await query
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      const next = (data as Match | null) ?? null;
      setMatch(next);
      if (next && selectedIdRef.current !== next.id) {
        await bindMatchData(next.id);
      }
      setRefreshing(false);
    }

    void refreshMatch();

    const matchChannel = supabase
      .channel(`live-match-record-${explicitMatchId ?? "latest"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        (payload) => {
          const row = (payload.new || payload.old) as Match;
          if (!row) return;

          if (explicitMatchId) {
            if (row.id === explicitMatchId) setMatch(row);
            return;
          }

          if (row.id === selectedIdRef.current) {
            setMatch(row);
            return;
          }

          // A new match can be created while OBS/browser sources stay open.
          // Re-select the newest record so the source moves forward without refresh.
          void refreshMatch();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void refreshMatch();
      });

    function onVisibilityChange() {
      if (document.visibilityState === "visible") void refreshMatch();
    }
    window.addEventListener("focus", refreshMatch);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      selectedIdRef.current = null;
      window.removeEventListener("focus", refreshMatch);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void supabase.removeChannel(matchChannel);
      if (playerChannel) void supabase.removeChannel(playerChannel);
      if (voteChannel) void supabase.removeChannel(voteChannel);
    };
  }, [explicitMatchId]);

  return { match, players, votes, refreshing };
}
