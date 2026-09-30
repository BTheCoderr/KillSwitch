import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const existing = await supabase
  .from("matches")
  .select("id,status,created_at")
  .in("status", ["lobby", "active"])
  .order("created_at", { ascending: false })
  .limit(1);

if (existing.error) {
  console.error("Could not inspect matches:", existing.error.message);
  process.exit(1);
}

if (existing.data?.length) {
  console.log("A lobby/active match already exists:", existing.data[0].id);
  console.log("No new Season Zero rehearsal match was created.");
  process.exit(0);
}

const { data: match, error: matchError } = await supabase
  .from("matches")
  .insert({
    status: "lobby",
    round: 1,
    best_of: 3,
    timer: 600,
    active_modifier: "none",
    problem_title: "Two Sum — Broadcast Rehearsal",
    problem_difficulty: "Warm-up",
  })
  .select()
  .single();

if (matchError || !match) {
  console.error("Could not create rehearsal match:", matchError?.message ?? "unknown error");
  process.exit(1);
}

const contestants = [
  { slot: 1, name: "Contestant 1", language: "TypeScript", score: 0 },
  { slot: 2, name: "Contestant 2", language: "Python", score: 0 },
  { slot: 3, name: "Contestant 3", language: "Go", score: 0 },
  { slot: 4, name: "Contestant 4", language: "Rust", score: 0 },
].map((player) => ({
  ...player,
  match_id: match.id,
  replit_url: null,
}));

const { error: playerError } = await supabase.from("players").insert(contestants);

if (playerError) {
  console.error("Match created but players failed:", playerError.message);
  process.exit(1);
}

console.log("Season Zero rehearsal match created.");
console.log("Match ID:", match.id);
console.log("Next: open /admin/control, add supported HTTPS editor URLs, then open /live in OBS.");
