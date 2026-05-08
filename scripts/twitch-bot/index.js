/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: "../../.env.local" });
const tmi = require("tmi.js");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL;
const TWITCH_USERNAME = process.env.TWITCH_BOT_USERNAME;
const TWITCH_OAUTH = process.env.TWITCH_BOT_OAUTH;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE env vars in .env.local");
  process.exit(1);
}

if (!TWITCH_CHANNEL || !TWITCH_OAUTH) {
  console.error(
    "Missing TWITCH_CHANNEL / TWITCH_BOT_OAUTH in .env.local — " +
      "set them when you have credentials. Use /sim in the browser for now.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  const { data } = await supabase
    .from("matches")
    .select("id")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);
  activeMatchId = data?.[0]?.id ?? null;
  if (activeMatchId) console.log(`Active match: ${activeMatchId}`);
  else console.log("No active match — will retry on next command");
}

async function castVote(command) {
  if (!activeMatchId) await findActiveMatch();
  if (!activeMatchId) return;

  await supabase.from("votes").insert({
    match_id: activeMatchId,
    command,
  });
  console.log(`Vote cast: ${command}`);
}

client.on("message", (_channel, _tags, message, self) => {
  if (self) return;
  const trimmed = message.trim().toLowerCase();
  if (!trimmed.startsWith("!")) return;

  const cmd = trimmed.slice(1).split(/\s+/)[0];

  if (VALID_COMMANDS.includes(cmd)) {
    castVote(cmd);
  } else if (cmd === "vote") {
    const target = trimmed.slice(1).split(/\s+/)[1];
    if (target && VALID_COMMANDS.includes(target)) {
      castVote(target);
    }
  }
});

client.on("connected", () => {
  console.log(`Connected to #${TWITCH_CHANNEL}`);
  findActiveMatch();
});

client.connect().catch(console.error);
