import { NextResponse } from "next/server";
import { allowedEmbedHosts, normalizeEmbedUrl } from "@/lib/embed";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getRemainingSeconds } from "@/lib/timer";
import { MODIFIER_OPTIONS } from "@/lib/types";

const MODIFIERS = new Set(["none", ...MODIFIER_OPTIONS.map((item) => item.id)]);
const MATCH_STATUSES = new Set(["lobby", "active", "finished"]);
const PLAYER_FIELDS = new Set(["name", "replit_url", "language"]);

function uuidLike(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f-]{32,36}$/i.test(value);
}

function clampInt(value: unknown, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function sanitizeMatchFields(input: unknown) {
  if (!input || typeof input !== "object") return {};
  const source = input as Record<string, unknown>;
  const out: Record<string, string | number | null> = {};

  if (typeof source.status === "string" && MATCH_STATUSES.has(source.status)) {
    out.status = source.status;
  }
  if ("round" in source) {
    const value = clampInt(source.round, 1, 99);
    if (value !== null) out.round = value;
  }
  if ("best_of" in source) {
    const value = clampInt(source.best_of, 1, 99);
    if (value !== null) out.best_of = value;
  }
  if ("timer" in source) {
    const value = clampInt(source.timer, 0, 60 * 60);
    if (value !== null) out.timer = value;
  }
  if (typeof source.active_modifier === "string" && MODIFIERS.has(source.active_modifier)) {
    out.active_modifier = source.active_modifier;
  }
  if ("problem_title" in source) {
    out.problem_title =
      typeof source.problem_title === "string"
        ? source.problem_title.trim().slice(0, 180) || null
        : null;
  }
  if ("problem_difficulty" in source) {
    out.problem_difficulty =
      typeof source.problem_difficulty === "string"
        ? source.problem_difficulty.trim().slice(0, 40) || null
        : null;
  }

  return out;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = body.action;
  if (typeof action !== "string") {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Producer database access is not configured" },
      { status: 503 },
    );
  }

  if (action === "createMatch") {
    const { data, error } = await supabase
      .from("matches")
      .insert({ status: "lobby" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "updateMatch") {
    if (!uuidLike(body.matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }
    const fields = sanitizeMatchFields(body.fields);
    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "No valid fields supplied" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("matches")
      .update(fields)
      .eq("id", body.matchId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "startTimer") {
    if (!uuidLike(body.matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }
    const seconds = clampInt(body.seconds ?? 600, 1, 60 * 60) ?? 600;
    const { data, error } = await supabase
      .from("matches")
      .update({
        status: "active",
        timer: seconds,
        timer_started_at: new Date().toISOString(),
      })
      .eq("id", body.matchId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "pauseTimer") {
    if (!uuidLike(body.matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }

    const { data: match, error: loadError } = await supabase
      .from("matches")
      .select("id, status, timer, timer_started_at")
      .eq("id", body.matchId)
      .single();

    if (loadError || !match) {
      return NextResponse.json({ error: loadError?.message ?? "Match not found" }, { status: 404 });
    }

    const remaining = getRemainingSeconds(
      Number(match.timer ?? 0),
      match.timer_started_at,
      match.status === "active",
    );

    const { data, error } = await supabase
      .from("matches")
      .update({
        status: "lobby",
        timer: remaining,
        timer_started_at: null,
      })
      .eq("id", body.matchId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "advanceRound") {
    if (!uuidLike(body.matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }

    const { data: match, error: loadError } = await supabase
      .from("matches")
      .select("round")
      .eq("id", body.matchId)
      .single();

    if (loadError || !match) {
      return NextResponse.json({ error: loadError?.message ?? "Match not found" }, { status: 404 });
    }

    const seconds = clampInt(body.seconds ?? 600, 1, 60 * 60) ?? 600;
    const { data, error } = await supabase
      .from("matches")
      .update({
        round: Math.max(1, Number(match.round ?? 1) + 1),
        status: "lobby",
        timer: seconds,
        timer_started_at: null,
        active_modifier: "none",
      })
      .eq("id", body.matchId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "updateScore") {
    if (!uuidLike(body.playerId)) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
    }
    const delta = clampInt(body.delta, -100, 100);
    if (delta === null) {
      return NextResponse.json({ error: "Invalid score delta" }, { status: 400 });
    }

    const { data: player, error: loadError } = await supabase
      .from("players")
      .select("id, score")
      .eq("id", body.playerId)
      .single();

    if (loadError || !player) {
      return NextResponse.json({ error: loadError?.message ?? "Player not found" }, { status: 404 });
    }

    const score = Math.max(0, Number(player.score ?? 0) + delta);
    const { data, error } = await supabase
      .from("players")
      .update({ score })
      .eq("id", body.playerId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "upsertPlayer") {
    if (!uuidLike(body.matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }
    const slot = clampInt(body.slot, 1, 4);
    const field = typeof body.field === "string" ? body.field : "";
    if (slot === null || !PLAYER_FIELDS.has(field)) {
      return NextResponse.json({ error: "Invalid player update" }, { status: 400 });
    }

    const rawValue = body.value;
    let value = typeof rawValue === "string" ? rawValue.trim().slice(0, 500) : "";

    if (field === "replit_url" && value) {
      const normalized = normalizeEmbedUrl(value);
      if (!normalized) {
        return NextResponse.json(
          {
            error: `Unsupported embed host. Use HTTPS from: ${allowedEmbedHosts().join(", ")}`,
          },
          { status: 400 },
        );
      }
      value = normalized;
    }

    const { data: existing, error: existingError } = await supabase
      .from("players")
      .select("id")
      .eq("match_id", body.matchId)
      .eq("slot", slot)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      const { data, error } = await supabase
        .from("players")
        .update({ [field]: value || null })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }

    const row = {
      match_id: body.matchId,
      slot,
      name: field === "name" && value ? value : `Player ${slot}`,
      ...(field !== "name" ? { [field]: value || null } : {}),
    };

    const { data, error } = await supabase.from("players").insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === "castVotes") {
    if (!uuidLike(body.matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }
    const command = typeof body.command === "string" ? body.command : "";
    if (!MODIFIERS.has(command) || command === "none") {
      return NextResponse.json({ error: "Invalid vote command" }, { status: 400 });
    }
    const times = clampInt(body.times ?? 1, 1, 25) ?? 1;
    const rows = Array.from({ length: times }, () => ({
      match_id: body.matchId,
      command,
    }));

    const { error } = await supabase.from("votes").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: { inserted: times } });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
