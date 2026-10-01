/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: "../../.env.local" });
const tmi = require("tmi.js");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const ADMIN_USER = process.env.KILLSWITCH_ADMIN_USER;
const ADMIN_PASSWORD = process.env.KILLSWITCH_ADMIN_PASSWORD;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL;
const TWITCH_USERNAME = process.env.TWITCH_BOT_USERNAME;
const TWITCH_OAUTH = process.env.TWITCH_OAUTH_TOKEN || process.env.TWITCH_BOT_OAUTH;
const VOTE_COOLDOWN_MS = 10_000;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing public Supabase env vars in .env.local");
  process.exit(1);
}

if (!SITE_URL || !ADMIN_USER || !ADMIN_PASSWORD) {
  console.error(
    "Missing NEXT_PUBLIC_SITE_URL / KILLSWITCH_ADMIN_USER / KILLSWITCH_ADMIN_PASSWORD. " +
      "Votes must go through the protected producer API.",
  );
  process.exit(1);
}

if (!TWITCH_CHANNEL || !TWITCH_OAUTH) {
  console.error(
    "Missing TWITCH_CHANNEL / TWITCH_OAUTH_TOKEN in .env.local — " +
      "set them when you have credentials. Use /sim in the browser for now.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const basicAuth = Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64");
const lastVoteAt = new Map();

const VALID_COMMANDS = [
  "reverse-iteration",
  "time-crunch",
  "memory-limit",
  "bright-pink",
  "no-backspace",
  "darkmode",
];

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: TWITCH_USERNAME || "KillswitchBot",
    password: TWITCH_OAUTH,
  },
  channels: [TWITCH_CHANNEL],
});

let activeMatchId = null;

async function findActiveMatch() {
  const { data, error } = await supabase
    .from("matches")
    .select("id")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(`Could not read active match: ${error.message}`);
    activeMatchId = null;
    return;
  }

  activeMatchId = data?.[0]?.id ?? null;
  if (activeMatchId) console.log(`Active match: ${activeMatchId}`);
  else console.log("No active match — will retry on next command");
}

function isCoolingDown(viewerKey) {
  const now = Date.now();
  const previous = lastVoteAt.get(viewerKey) || 0;
  if (now - previous < VOTE_COOLDOWN_MS) return true;
  lastVoteAt.set(viewerKey, now);
  return false;
}

async function castVote(command) {
  if (!activeMatchId) await findActiveMatch();
  if (!activeMatchId) return;

  const response = await fetch(`${SITE_URL}/api/admin/mutate`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "castVotes",
      matchId: activeMatchId,
      command,
      times: 1,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error(`Vote rejected: ${command} — ${data.error || response.status}`);
    if (response.status === 404 || response.status === 400) activeMatchId = null;
    return;
  }

  console.log(`Vote cast: ${command}`);
}

client.on("message", (_channel, tags, message, self) => {
  if (self) return;

  const trimmed = message.trim().toLowerCase();
  if (!trimmed.startsWith("!")) return;

  const parts = trimmed.slice(1).split(/\s+/);
  const cmd = parts[0];
  const command =
    VALID_COMMANDS.includes(cmd)
      ? cmd
      : cmd === "vote" && VALID_COMMANDS.includes(parts[1])
        ? parts[1]
        : null;

  if (!command) return;

  const viewerKey =
    tags["user-id"] || tags.username || tags["display-name"] || "anonymous-viewer";
  if (isCoolingDown(viewerKey)) return;

  void castVote(command);
});

client.on("connected", () => {
  console.log(`Connected to #${TWITCH_CHANNEL}`);
  void findActiveMatch();
});

client.connect().catch(console.error);
