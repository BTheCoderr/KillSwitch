# Killswitch

<!-- repo-intro:start -->
**Project snapshot:** Killswitch is a livestream-first competitive coding show platform with four-person battle rooms, audience modifiers and voting, producer controls, and an OBS-ready arena interface.

**What it demonstrates:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase Realtime · broadcast/product UX.
<!-- repo-intro:end -->

> Code Under Pressure. A live competitive coding show — 4 contestants, one problem, audience-controlled chaos.

Public pages ship a **front-end MVP**: OBS/stream-first arena UI—not a hosted code execution engine yet. Contestants use embeddable editors; Killswitch owns the broadcast shell.

---

## Roadmap

**Develop a livestream-ready MVP with live coding battle rooms.**

The **current MVP** messaging and UI center on:

- Live coding battle rooms  
- Real-time contestant code panels  
- Audience voting during matches  
- AI match explanation  
- Tournament and replay flow  

**Explicitly not in this MVP pass:** hosted code execution, viewer auth, payments, or new persistence beyond what is already wired elsewhere in the repo.

A real-time broadcast surface for OBS (plus optional Supabase-backed producer routes): 2×2 grid of live code editors, HUD with timer and modifiers, and producer tools for modifiers and votes. Built for the camera first.

### Open Graph image (TODO)

There is **no** `public/` directory or share image in-repo yet, so `app/layout.tsx` does not define `openGraph.images`. For launch link previews, add e.g. `public/og.png` (recommended **1200×630**), then wire it in metadata:

```ts
// app/layout.tsx — openGraph / twitter
images: [{ url: "/og.png", width: 1200, height: 630, alt: "Killswitch" }],
```

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase (Postgres + Realtime) · Framer Motion · Lucide.

---

## Routes

| Path             | Purpose                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `/`              | Marketing landing                                                       |
| `/live`          | **OBS Browser Source** — full ArenaGrid (2×2 iframes + HUD + glitch)    |
| `/overlay`       | Lighter transparent overlay layout for OBS                              |
| `/admin/control` | **Protected producer panel** — modifiers, votes, scores, match control  |
| `/control`       | **Protected** alternate match-control UI                                |
| `/sim`           | **Protected** producer/dev vote simulator                              |
| `/grid`          | Standalone 2×2 embed grid                                               |
| `/arena`         | Stream-ready **Season Zero HUD** (beta panels—embed integrations roll out alongside launch brackets) |
| `/apply`         | Competitor form (MVP UX only — client state, wire storage separately) |
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
#    supabase/migrations/002_applications.sql
#    (001: matches/players/votes + Realtime; 002: applications intake, insert-only RLS)

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
| `SUPABASE_SERVICE_ROLE_KEY`      | server    | yes*     | Producer mutations; server-only, never expose to client    |
| `KILLSWITCH_ADMIN_USER`          | server    | yes*     | HTTP Basic username for producer-only surfaces              |
| `KILLSWITCH_ADMIN_PASSWORD`      | server    | yes*     | Long random password for producer-only surfaces             |

`*` Required when running producer controls. Public marketing/broadcast pages can still build without using producer actions.

---

## Supabase

Schema files: `supabase/migrations/001_schema.sql`, `002_applications.sql`.

- `matches` — `status`, `round`, `best_of`, `timer`, `active_modifier`, `problem_*`
- `players` — slot 1–4, `replit_url` (any embed URL), `language`, `score`
- `votes` — `command` (e.g. `darkmode`, `no-backspace`)
- `applications` — competitor `/apply` submissions; **INSERT-only** for `anon` (no public `SELECT`; review in Supabase **Table Editor**)

`001` is the original sprint schema and contains intentionally permissive policies. **Do not treat those policies as production-safe.** The repo now includes `supabase/security_hardening.sql`, which reduces browser access to public reads plus valid vote inserts and moves producer mutations to the protected server API. The correct live Supabase project is not currently connected to this workspace, so that SQL is review-ready but has **not** been applied to production yet.

`applications` keeps its insert-only public form model: visitors can submit but cannot read rows through the anon API.

---

## OBS setup

1. **Browser Source** → URL: `https://<your-domain>/live` → 1920×1080.
2. (Optional) Add a second Browser Source on `https://<your-domain>/overlay` for a transparent HUD layered over a different layout.
3. Set `KILLSWITCH_ADMIN_USER`, `KILLSWITCH_ADMIN_PASSWORD`, and `SUPABASE_SERVICE_ROLE_KEY` on the server.
4. Open `https://<your-domain>/admin/control` on a separate machine/window and authenticate — that's where you fire modifiers and inject votes during the stream.

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

## Production hardening status

- **Producer route protection** — implemented with fail-closed HTTP Basic auth in `proxy.ts` for `/admin`, `/control`, `/sim`, and `/api/admin`.
- **Producer writes** — routed through `POST /api/admin/mutate` using the server-only Supabase service role.
- **Public database permissions** — reviewed least-privilege SQL is in `supabase/security_hardening.sql`; it still needs to be applied to the correct live Supabase project once that project is connected.
- **CI** — GitHub Actions runs clean install, lint, and production build on PRs and pushes to `main`.

## Not built yet
- **Real LLM in `/api/commentary`** — placeholder lines today; swap in Anthropic when `ANTHROPIC_API_KEY` is set.
- **Pro tier ($10/mo) weighted votes** — schema and Stripe integration still TODO.
- **Synced countdown timer** — `matches.timer` exists but isn't authoritative across clients yet.
- **`replit_url` → `embed_url` rename** — column name is legacy; the field already holds any embed URL.
