# Killswitch

[![Validation](https://github.com/BTheCoderr/KillSwitch/actions/workflows/validate.yml/badge.svg)](https://github.com/BTheCoderr/KillSwitch/actions/workflows/validate.yml)
[![Dependency audit](https://github.com/BTheCoderr/KillSwitch/actions/workflows/dependency-audit.yml/badge.svg)](https://github.com/BTheCoderr/KillSwitch/actions/workflows/dependency-audit.yml)

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
| Audience | Producer/Twitch-ingested votes + show-rule modifiers |
| Producer | Protected control room, simulator, readiness gate |
| State | Supabase Postgres + Realtime |
| Security | Server-only producer mutations, Basic-auth protected admin surfaces, embed allowlist |
| Timing | Server-anchored countdown support for synchronized clients |
| Intake | Competitor, waitlist, and sponsor requests persisted server-side |

### Why this is more than a landing page

Killswitch treats the **broadcast itself as the product UI**. The public arena, producer controls, match state, votes, timer, commentary, contestant embeds, and OBS workflow are designed together rather than bolting streaming onto a normal web dashboard later.

The current explainer is deterministic and match-aware; an optional LLM commentary layer can be added later without making the live show dependent on an AI provider.
<!-- portfolio-refresh:end -->

> Code Under Pressure. A producer-run competitive coding broadcast — 4 contestants, one problem, controlled audience modifiers.

Public pages ship a **front-end MVP**: OBS/stream-first arena UI—not a hosted code execution engine yet. Contestants use embeddable editors; Killswitch owns the broadcast shell.

---

## Product boundary

Season Zero is intentionally a **broadcast product**, not a self-service multiplayer coding platform.

- Four third-party editor embeds
- Producer-controlled synchronized timer and scoring
- Show-rule modifiers and controlled vote ingestion
- Match-aware deterministic explanation
- OBS-first live, overlay, and grid surfaces
- Server-persisted competitor, waitlist, and sponsor intake

Not part of Season Zero: hosted code execution, viewer/player accounts, payments, room join/rejoin flows, or a mobile spectator app.

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
| `/control`       | **Protected** legacy alias that redirects to `/admin/control`          |
| `/sim`           | **Protected** producer/dev vote simulator                              |
| `/grid`          | Standalone 2×2 embed grid                                               |
| `/arena`         | Clearly labeled four-slot format preview; not a live-match surface       |
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
#    For a brand-new local project, the original bootstrap SQL is archived under:
#    supabase/legacy/001_schema.sql
#    supabase/legacy/002_applications.sql
#    supabase/legacy/003_waitlist_subscribers.sql
#
#    Those legacy bootstraps are intentionally OUTSIDE the managed migration
#    chain because production predates Supabase migration tracking for them.
#    The exact tracked production history lives under supabase/migrations/.

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

Legacy bootstrap schema: `supabase/legacy/001_schema.sql`, `002_applications.sql`, and `003_waitlist_subscribers.sql`. Managed production migrations live only under `supabase/migrations/`.

- `matches` — `status`, `round`, `best_of`, `timer`, optional `timer_started_at`, `active_modifier`, `problem_*`
- `players` — slot 1–4, legacy `replit_url` column (validated editor embed URL), `language`, `score`
- `votes` — `command` (e.g. `darkmode`, `no-backspace`); public clients are read-only
- `applications` — competitor `/apply` submissions; server-only service-role writes
- `waitlist_subscribers` — early-access intake; server-only service-role writes
- `sponsor_leads` — sponsor deck requests; server-only service-role writes

`supabase/legacy/001_schema.sql` is the original sprint bootstrap and contains intentionally permissive policies. **Do not treat those policies as production-safe or replay it against production.** The managed migrations reduce browser database access to public reads only; vote inserts and all producer mutations go through the protected server API. The canonical production project is already hardened.

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

### Fresh project import

1. In Vercel, create a new project and import `BTheCoderr/KillSwitch`.
2. Keep the default Next.js framework detection, repository root, install command, and build command.
3. Add the required production environment variables from `.env.local.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `KILLSWITCH_ADMIN_USER`
   - `KILLSWITCH_ADMIN_PASSWORD`
4. Deploy once, then set `NEXT_PUBLIC_SITE_URL` to the canonical production origin and redeploy so metadata/social previews use the final URL.
5. Verify `/api/health` reports ready before the dress rehearsal.
6. Use the production `/live` URL as the OBS Browser Source.

Do not create a second GitHub repository for this import; the canonical source remains `BTheCoderr/KillSwitch`.

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

For the first rehearsal, operate `/admin/control` to fire modifiers and inject votes. When enabled, `scripts/twitch-bot/` reads the active match with the public Supabase key but submits vote writes through the protected producer API. It uses the producer Basic-auth credentials, a per-viewer cooldown, and never receives the service-role key.

---

## Production hardening status

- **Producer route protection** — implemented with fail-closed HTTP Basic auth in `proxy.ts` for `/admin`, `/control`, `/sim`, and `/api/admin`.
- **Producer writes** — routed through `POST /api/admin/mutate` using the server-only Supabase service role.
- **Public database permissions** — production is verified read-only for public match/vote state; anonymous/authenticated vote inserts are revoked and the atomic score RPC is service-role-only.
- **Countdown synchronization** — code supports a server-written `timer_started_at` anchor and remains backward-compatible before the column exists. `timer_started_at` is now live in production and tracked by `20260930183603_add_authoritative_timer_anchor.sql` for authoritative cross-client timing.
- **Embed safety** — producer writes and arena rendering restrict editor iframes to an HTTPS allowlist.
- **Intake** — `/apply`, waitlist, and sponsor requests only show success after server-side persistence succeeds.
- **Live explainer** — commentary is generated deterministically from real match, score, modifier, and vote state instead of random canned lines.
- **Launch tooling** — `/api/health`, protected `/admin/readiness`, the Season Zero seed command, dynamic social card, and an operator dress-rehearsal runbook are included.
- **CI** — GitHub Actions runs clean install, lint, and production build on PRs and pushes to `main`.

## Not built yet
- **Optional LLM commentary layer** — the current explainer is deterministic and match-aware; an LLM can be added later without being required for the show.
- **Pro tier ($10/mo) weighted votes** — schema and Stripe integration still TODO.
- **`replit_url` → `embed_url` rename** — the column name remains legacy even though stored values are now validated editor embed URLs.
