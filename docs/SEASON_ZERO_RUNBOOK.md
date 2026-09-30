# Season Zero Operator Runbook

This is the shortest path from a clean deployment to a complete Killswitch rehearsal.

## 1. Infrastructure gate

Before touching OBS, confirm:

- `GET /api/health` returns `status: "ready"`.
- `/admin/control` prompts for producer credentials.
- The connected Supabase project has:
  - `matches`
  - `players`
  - `votes`
  - `applications`
  - `waitlist_subscribers`
- Apply generated Supabase migrations equivalent to:
  - `supabase/security_hardening.sql`
  - `supabase/timer_upgrade.sql`
- Re-run Supabase security/performance advisors after the migration.

Do not run a public show with the original permissive `001_schema.sql` policies still active.

## 2. Create the rehearsal match

With production Supabase variables available locally:

```bash
npm run seed:season-zero
```

The command is idempotent for active/lobby matches: if one already exists it will not create another.

It creates:

- 1 lobby match
- Round 1 / best of 3
- 10-minute starting timer
- 4 placeholder contestants
- A warm-up rehearsal problem

## 3. Producer setup

Open `/admin/control`.

For each slot:

1. Replace the placeholder name.
2. Choose the contestant language.
3. Add a supported HTTPS editor embed:
   - Playcode
   - StackBlitz
   - Replit
   - CodeSandbox
4. Verify the embed appears in `/live`.

Set the real problem title and difficulty before broadcast.

## 4. OBS setup

Add a Browser Source:

- URL: `https://YOUR_DOMAIN/live`
- Width: 1920
- Height: 1080

Optional second Browser Source:

- URL: `https://YOUR_DOMAIN/overlay`
- Use when the code feeds are composed elsewhere.

## 5. Full dress rehearsal

Run this exact sequence without refreshing any client:

1. Start the round at 10:00.
2. Verify the timer ticks on producer and live views.
3. Add a point to Contestant 1.
4. Fire one modifier.
5. Add audience votes.
6. Call the Live Explainer and verify it references current scores/votes/modifier.
7. Pause the timer.
8. Resume the timer.
9. Advance to Round 2.
10. Confirm the modifier resets.
11. Finish the match.
12. Confirm public views settle into the finished state.

If any view requires a manual refresh to catch match state, do not launch publicly yet.

## 6. Audience-vote rehearsal

For the first rehearsal, producer-injected votes are enough.

When Twitch voting is enabled:

```bash
cd scripts/twitch-bot
npm install
npm start
```

Required bot variables:

- `TWITCH_BOT_USERNAME`
- `TWITCH_OAUTH_TOKEN`
- `TWITCH_CHANNEL`
- root Supabase URL + anon key

The bot should use only the public vote-insert policy. Never give the Twitch process the Supabase service-role key.

## 7. Go / no-go checklist

Go live only when all are true:

- Health endpoint ready
- Producer routes require auth
- Public users cannot mutate matches or players
- Four editor embeds load reliably
- Timer stays synchronized across two different browsers
- Scores update through Realtime
- Votes appear through Realtime
- Modifier animation/effect is visible
- Application form persists a test application
- OBS browser source survives a full round
- Production dependency audit is green

## 8. After rehearsal

Delete or finish rehearsal matches, remove fake applications, and replace placeholder contestant information before sharing the production URL publicly.
