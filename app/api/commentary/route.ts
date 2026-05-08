import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import type { Player } from "@/lib/types";

const PLACEHOLDER_LINES = [
  "Player 1 just refactored mid-match — bold move or wasted clock? The audience is leaning into it.",
  "Two contestants chose the same algorithm but wildly different implementations. Style points matter.",
  "The modifier is burning through focus — you can see Slot 3 scrambling to re-read their own code.",
  "Someone forgot to handle the edge case. Chat is going to feast on this.",
  "Slot 2 is writing surprisingly clean code under pressure — the audience smells a dark-horse run.",
  "This round is closer than it looks. One hidden test could flip the leaderboard.",
  "Luna uses selection sort O(n^2). Rex uses index mapping to minimize swaps. Rex's approach is more optimal on large inputs.",
  "The No Backspace modifier just fired — watch for the typo tax in the next 30 seconds.",
];

export async function POST(request: Request) {
  const supabase = getSupabaseServer();

  let matchId: string | undefined;
  try {
    const body = await request.json();
    matchId = body.matchId;
  } catch {
    // no body — find the active match
  }

  if (!matchId) {
    const { data } = await supabase
      .from("matches")
      .select("id")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
    matchId = data?.[0]?.id;
  }

  if (!matchId) {
    return NextResponse.json({ error: "No active match found" }, { status: 404 });
  }

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("match_id", matchId);

  const context = (players as Player[] | null)
    ?.map((p) => `Slot ${p.slot}: ${p.name} (${p.language ?? "unknown"}) — score ${p.score}`)
    .join("; ") ?? "no players";

  // TODO: Swap for LLM call when ANTHROPIC_API_KEY is set
  void context;
  const body = PLACEHOLDER_LINES[Math.floor(Math.random() * PLACEHOLDER_LINES.length)];

  return NextResponse.json({ body });
}
