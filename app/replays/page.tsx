"use client";

import { motion } from "framer-motion";
import { Film, Play } from "lucide-react";
import Link from "next/link";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { WaitlistForm } from "@/components/WaitlistForm";
import { conversionCopy } from "@/lib/conversionCopy";
import { replays } from "@/lib/data";

export default function ReplaysPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/45">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <SeasonZeroBadge />
            <span className="text-[10px] font-bold uppercase tracking-wide text-electric-blue">Beta Access</span>
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.28em] text-volt-purple uppercase">Replays</p>
          <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-white md:text-5xl md:leading-tight">
            Bingeable coding showdowns—engineered like prestige TV.
          </h1>
          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
            Replay vault cues are staged for Season Zero—we&apos;re locking capture + packaging contracts while
            the live HUD runs in beta. Join early access so the first mastered cuts hit your inbox.
          </p>
          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neon-green/90 md:text-xs">
            {conversionCopy.launchBracketApplicationsOpen}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-11 md:px-8 md:py-14">
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:p-0 md:pb-0">
          {replays.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="relative aspect-[4/5] w-[min(78vw,20rem)] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/12 bg-slate-dark/85 shadow-[0_36px_100px_-40px_rgb(0_0_0_/_0.72)] md:w-auto scanlines"
            >
              <div className="absolute inset-0 bg-[linear-gradient(165deg,rgb(57_255_20_/_0.16)_0%,transparent_45%,rgb(5_7_10_/_0.95)_100%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-48 mix-blend-screen">
                <div className="absolute -right-16 top-8 size-48 rounded-full bg-volt-purple/28 blur-[58px]" />
                <div className="absolute bottom-0 left-0 size-[14rem] rounded-full bg-electric-blue/14 blur-[70px]" />
              </div>
              <div className="relative flex h-full flex-col justify-end p-6">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-highlight-dim ring-1 ring-white/14">
                  {r.subtitle}
                </span>
                <h2 className="mt-4 font-heading text-xl font-bold text-white md:text-2xl md:leading-tight">
                  {r.title}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-highlight-dim">
                  Multi-camera IDE choreography, kinetic vote overlays, AI dub narration—as soon as broadcasts go
                  live, mastering passes drop here.
                </p>
                <div className="mt-8 flex items-center gap-3 text-highlight-dim/55">
                  <span className="flex size-11 items-center justify-center rounded-full border border-white/14 bg-black/60">
                    <Play className="size-5 fill-highlight/75 text-highlight/80" aria-hidden />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide md:text-xs">
                    Playback · first season
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="ks-panel mx-auto mt-14 max-w-3xl rounded-2xl px-8 py-10 text-center md:px-12">
          <Film className="mx-auto size-10 text-neon-green/85" aria-hidden />
          <p className="mt-5 font-heading text-lg font-bold text-white md:text-xl">
            First replays finalize with Episode Zero
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-highlight-dim">
            {conversionCopy.newsletterBlurb} You&apos;ll be first when highlight reels ship.
          </p>
          <div className="mx-auto mt-8 max-w-md px-1">
            <WaitlistForm source="replays" variant="compact" />
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/arena"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-neon-green px-8 py-3 text-sm font-bold text-blackout shadow-[0_0_34px_rgb(57_255_20_/_0.35)] hover:brightness-110"
            >
              Enter the Arena
            </Link>
            <Link
              href="/apply"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/22 px-8 py-3 text-sm font-semibold text-white hover:border-neon-green/35"
            >
              Apply to Compete
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
