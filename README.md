# Killswitch

<!-- repo-intro:start -->
**Project snapshot:** Killswitch is a livestream-first competitive coding show platform with four-person battle rooms, audience modifiers and voting, producer controls, and an OBS-ready arena interface.

**What it demonstrates:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase Realtime · broadcast/product UX.
<!-- repo-intro:end -->

<!-- portfolio-refresh:start -->
## Product at a glance

| Area | Current build |
| --- | --- |
| Show format | Four-person livestream coding battle |
| Broadcast | OBS-ready arena, transparent overlay, Season Zero HUD |
| Audience | Live votes + chaos modifiers |
| Producer | Protected control room, simulator, readiness gate |
| State | Supabase Postgres + Realtime |
| Security | Server-only producer mutations, Basic-auth protected admin surfaces, embed allowlist |
| Timing | Server-anchored countdown support for synchronized clients |
| Intake | Real validated competitor applications persisted server-side |

### Why this is more than a landing page

Killswitch treats the **broadcast itself as the product UI**. The public arena, producer controls, match state, votes, timer, commentary, contestant embeds, and OBS workflow are designed together rather than bolting streaming onto a normal web dashboard later.

The current explainer is deterministic and match-aware; an optional LLM commentary layer can be added later without making the live show dependent on an AI provider.
<!-- portfolio-refresh:end -->

> Code Under Pressure. A live competitive coding show — 4 contestants, one problem, audience-controlled chaos.

Public pages ship a **front-end MVP**: OBS/stream-first arena UI—not a hosted code execution engine yet. Contestants use embeddable editors; Killswitch owns the broadcast shell.

---

## Roadmap

**Develop a livestream-ready MVP with live coding battle rooms.**

The **current MVP** messaging and UI center on:

- Live coding battle rooms  
- Real-time contestant code panels  
- Audience voting during matches  
- Match-aware live explanation  
- Tournament and replay flow  

**Explicitly not in this MVP pass:** hosted code execution, viewer auth, payments, or new persistence beyond what is already wired elsewhere in the repo.

A real-time broadcast surface for OBS (plus optional Supabase-backed producer routes): 2×2 grid of live code editors, HUD with timer and modifiers, and producer tools for modifiers and votes. Built for the camera first.

### Social preview

Killswitch now ships a dynamic 1200×630 launch card through `app/opengraph-image.tsx` and reuses it for Twitter/X metadata. No static image file is required.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase (Postgres + Realtime) · Framer Motion · Lucide.

---

## Routes

| Path             | Purpose                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `/`              | Marketing landing                                                       |
| `/live`          | **OBS Browser Source** — full ArenaGrid (2×2 iframes + HUD + glitch)    |
| `/overlay`       | Lighter transparent overlay layout for OBS                              |
| `/admin/control` | **Protected producer panel** — modifiers, votes, scores, match control  |
| `/admin/readiness` | **Protected launch gate** — deployment/database readiness checks      |
| `/control`       | **Protected** alternate match-control UI                                |
| `/sim`           | **Protected** producer/dev vote simulator                              |
| `/grid`          | Standalone 2×2 embed grid                                               |
| `/arena`         | Stream-ready **Season Zero HUD** (beta panels—embed integrations roll out alongside launch brackets) |
| `/apply`         | Competitor form — validated server-side and persisted to `applications` |
| `/api/commentary`| `POST` → match-aware live explainer built from current match state       |
| `/api/health`    | Readiness JSON for deployment/database producer configuration             |

The contestant embed field is still called `replit_url` in the DB. Producer writes now allow only HTTPS editor embeds from Playcode, StackBlitz, Replit, or CodeSandbox; the live arena re-validates the URL before rendering an iframe.

---

## Quickstart (local)

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.local.example .env.local
# then fill in Supabase + producer values and NEXT_PUBLIC_SITE_URL

# 3. Provision Supabase
#    Open your Supabase project → SQL Editor → paste & run:
#    supabase/migrations/001_schema.sql
#    supabase/migrations/002_applications.sql
#    supabase/migrations/003_waitlist_subscribers.sql
#
#    Before public launch, review/apply the generated equivalents of:
#    supabase/security_hardening.sql
#    supabase/timer_upgrade.sql

# 4. Optional: seed one rehearsal match after the database is ready
npm run seed:season-zero

# 5. Dev
npm run dev          # http://localhost:3000

# 6. Verify
npm run lint
npm run build
```

---

## Environment variables

| Var                              | Where     | Required | Notes                                                      |
| -------------------------------- | --------- | -------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | client    | yes      | Supabase project URL                                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | client    | yes      | Supabase anon/public key                                   |
| `NEXT_PUBLIC_SITE_URL`            | metadata  | prod     | Canonical production origin / share-card base URL          |
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

- `matches` — `status`, `round`, `best_of`, `timer`, optional `timer_started_at`, `active_modifier`, `problem_*`
- `players` — slot 1–4, legacy `replit_url` column (validated editor embed URL), `language`, `score`
- `votes` — `command` (e.g. `darkmode`, `no-backspace`)
- `applications` — competitor `/apply` submissions; current app writes through the server-only service-role route

`001` is the original sprint schema and contains intentionally permissive policies. **Do not treat those policies as production-safe.** The repo now includes `supabase/security_hardening.sql`, which reduces browser access to public reads plus valid vote inserts and moves producer mutations to the protected server API. The correct live Supabase project is connected and the hardening migration has been applied to production.

`applications` is now written through `/api/apply` with server-side validation and the service-role client. The hardening SQL removes public application writes entirely.

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

## Season Zero rehearsal

The complete operator checklist lives in [`docs/SEASON_ZERO_RUNBOOK.md`](docs/SEASON_ZERO_RUNBOOK.md).

After the production database is hardened, run `npm run seed:season-zero` to create one safe lobby match with four placeholder contestants. Use `/admin/readiness` as the deployment gate, `/admin/control` as the control room, and `/live` as the OBS Browser Source.

---

## Production day flow (ghost chat)

For the launch you read YT/Twitch chat yourself and operate `/admin/control` to fire modifiers and inject votes. After launch, `scripts/twitch-bot/` (tmi.js) can insert public votes from real chat once Twitch env vars are set. Run it from the repository root with `npm run twitch:bot`. The bot uses `TWITCH_OAUTH_TOKEN` and the public Supabase anon key only—never the service-role key.

---

## Production hardening status

- **Producer route protection** — implemented with fail-closed HTTP Basic auth in `proxy.ts` for `/admin`, `/control`, `/sim`, and `/api/admin`.
- **Producer writes** — routed through `POST /api/admin/mutate` using the server-only Supabase service role.
- **Public database permissions** — least-privilege hardening is applied to the connected production Supabase project and tracked in repository SQL/migration history.
- **Countdown synchronization** — code supports a server-written `timer_started_at` anchor and remains backward-compatible before the column exists. `timer_started_at` is now live in production and tracked by `20260930183603_add_authoritative_timer_anchor.sql` for authoritative cross-client timing.
- **Embed safety** — producer writes and arena rendering restrict editor iframes to an HTTPS allowlist.
- **Competitor intake** — `/apply` persists only after server validation succeeds; the UI no longer fakes success.
- **Live explainer** — commentary is generated deterministically from real match, score, modifier, and vote state instead of random canned lines.
- **Launch tooling** — `/api/health`, protected `/admin/readiness`, the Season Zero seed command, dynamic social card, and an operator dress-rehearsal runbook are included.
- **CI** — GitHub Actions runs clean install, lint, and production build on PRs and pushes to `main`.

## Not built yet
- **Optional LLM commentary layer** — the current explainer is deterministic and match-aware; an LLM can be added later without being required for the show.
- **Pro tier ($10/mo) weighted votes** — schema and Stripe integration still TODO.
- **`replit_url` → `embed_url` rename** — the column name remains legacy even though stored values are now validated editor embed URLs.
