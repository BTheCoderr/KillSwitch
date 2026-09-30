import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import type { Match, Player, Vote } from "@/lib/types";

function buildCommentary(match: Match, players: Player[], votes: Vote[]) {
  const ranked = [...players].sort((a, b) => b.score - a.score);
  const leader = ranked[0];
  const runnerUp = ranked[1];

  const counts = new Map<string, number>();
  for (const vote of votes) counts.set(vote.command, (counts.get(vote.command) ?? 0) + 1);
  const topVote = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  const parts: string[] = [];

  if (match.problem_title) {
    parts.push(
      `Round ${match.round} is on ${match.problem_title}${match.problem_difficulty ? ` (${match.problem_difficulty})` : ""}.`,
    );
  } else {
    parts.push(`Round ${match.round} is live.`);
  }

  if (leader) {
    if (runnerUp) {
      const gap = leader.score - runnerUp.score;
      parts.push(
        gap === 0
          ? `${leader.name} and ${runnerUp.name} are tied at ${leader.score}.`
          : `${leader.name} leads ${runnerUp.name} by ${gap} point${gap === 1 ? "" : "s"}.`,
      );
    } else {
      parts.push(`${leader.name} leads with ${leader.score} point${leader.score === 1 ? "" : "s"}.`);
    }
  } else {
    parts.push("No contestants are loaded yet.");
  }

  if (match.active_modifier && match.active_modifier !== "none") {
    parts.push(`${match.active_modifier.replace(/-/g, " ")} is active, so the next clean move matters more than raw speed.`);
  }

  if (topVote) {
    parts.push(
      `The audience is pushing ${topVote[0].replace(/-/g, " ")} with ${topVote[1]} vote${topVote[1] === 1 ? "" : "s"}.`,
    );
  } else {
    parts.push("The audience vote is still wide open.");
  }

  return parts.join(" ");
}

export async function POST(request: Request) {
  const supabase = getSupabaseServer();

  let matchId: string | undefined;
  try {
    const body = (await request.json()) as { matchId?: string };
    matchId = body.matchId;
  } catch {
    // Fall through to most recent active match.
  }

  let match: Match | null = null;

  if (matchId) {
    const { data } = await supabase.from("matches").select("*").eq("id", matchId).single();
    match = (data as Match | null) ?? null;
  } else {
    const { data } = await supabase
      .from("matches")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
    match = (data?.[0] as Match | undefined) ?? null;
  }

  if (!match) {
    return NextResponse.json({ error: "No active match found" }, { status: 404 });
  }

  const [playersRes, votesRes] = await Promise.all([
    supabase.from("players").select("*").eq("match_id", match.id),
    supabase.from("votes").select("*").eq("match_id", match.id),
  ]);

  const players = (playersRes.data as Player[] | null) ?? [];
  const votes = (votesRes.data as Vote[] | null) ?? [];

  return NextResponse.json({
    body: buildCommentary(match, players, votes),
    source: "live-match-state",
  });
}
