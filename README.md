# KILLSWITCH

> Code Under Pressure. A live competitive coding show — 4 contestants, one problem, audience-controlled chaos.

A real-time broadcast surface for OBS: a 2×2 grid of live code editors, an HUD with timer and modifiers, and a producer admin that fires modifiers and counts chat votes. Built for the camera first.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase (Postgres + Realtime) · Framer Motion · Lucide.

---

## Routes

| Path             | Purpose                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `/`              | Marketing landing                                                       |
| `/live`          | **OBS Browser Source** — full ArenaGrid (2×2 iframes + HUD + glitch)    |
| `/overlay`       | Lighter transparent overlay layout for OBS                              |
| `/admin/control` | Producer panel — fires modifiers, simulates votes, match/player view    |
| `/control`       | Alternate match-control UI                                              |
| `/sim`           | Local vote simulator                                                    |
| `/grid`          | Standalone 2×2 embed grid                                               |
| `/arena`         | Static mock dashboard                                                   |
| `/api/commentary`| `POST` → returns a placeholder commentary line (swap for LLM later)     |

The contestant embed field is still called `replit_url` in the DB but holds **any** embed URL — StackBlitz, Playcode, Replit, etc. No viewer auth required.

---

## Quickstart (local)

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.local.example .env.local
# then fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Provision Supabase
#    Open your Supabase project → SQL Editor → paste & run:
#    supabase/migrations/001_schema.sql
#    (creates matches/players/votes, enables Realtime, sets permissive RLS)

# 4. Dev
npm run dev          # http://localhost:3000

# 5. Verify
npm run lint
npm run build
```

---

## Environment variables

| Var                              | Where     | Required | Notes                                                      |
| -------------------------------- | --------- | -------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | client    | yes      | Supabase project URL                                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | client    | yes      | Supabase anon/public key                                   |
| `ANTHROPIC_API_KEY`              | server    | no       | Future — for real LLM in `/api/commentary`                 |
| `TWITCH_BOT_USERNAME`            | bot       | no       | `scripts/twitch-bot/` only                                 |
| `TWITCH_OAUTH_TOKEN`             | bot       | no       | `scripts/twitch-bot/` only                                 |
| `TWITCH_CHANNEL`                 | bot       | no       | `scripts/twitch-bot/` only                                 |
| `SUPABASE_SERVICE_ROLE_KEY`      | bot       | no       | Server-side only — never expose to the client              |

---

## Supabase

Schema lives at `supabase/migrations/001_schema.sql`. Three tables:

- `matches` — `status`, `round`, `best_of`, `timer`, `active_modifier`, `problem_*`
- `players` — slot 1–4, `replit_url` (any embed URL), `language`, `score`
- `votes` — `command` (e.g. `darkmode`, `no-backspace`)

The migration enables Realtime on all three and adds permissive RLS for the MVP. Tighten before opening to the public.

---

## OBS setup

1. **Browser Source** → URL: `https://<your-domain>/live` → 1920×1080.
2. (Optional) Add a second Browser Source on `https://<your-domain>/overlay` for a transparent HUD layered over a different layout.
3. Open `https://<your-domain>/admin/control` on a separate machine/window — that's where you fire modifiers and inject votes during the stream.

The `.glitch-active` / `.glitch-overlay` / `.glitch-alert` / `.scanlines` styles in `app/globals.css` are triggered by `matches.active_modifier` updating via Realtime.

---

## Deploy to Vercel

Vercel auto-detects Next.js — no `vercel.json` needed.

### Option A — GitHub → Vercel dashboard

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Use the production URL as your OBS Browser Source.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

After the first deploy, every push to your default branch ships to production.

---

## Production day flow (ghost chat)

For the launch you read YT/Twitch chat yourself and operate `/admin/control` to fire modifiers and inject votes. After launch, `scripts/twitch-bot/` (tmi.js) can be wired to `INSERT` into `votes` directly from real chat once Twitch env vars are set.

---

## Not built yet

- **Auth on `/admin/control`** — currently open. Lock down before going public.
- **Real LLM in `/api/commentary`** — placeholder lines today; swap in Anthropic when `ANTHROPIC_API_KEY` is set.
- **Pro tier ($10/mo) weighted votes** — schema and Stripe integration still TODO.
- **Synced countdown timer** — `matches.timer` exists but isn't authoritative across clients yet.
- **`replit_url` → `embed_url` rename** — column name is legacy; the field already holds any embed URL.
