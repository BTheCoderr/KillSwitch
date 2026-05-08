"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Users, Zap } from "lucide-react";
import Link from "next/link";
import { StatPill } from "@/components/StatPill";
import { conversionCopy } from "@/lib/conversionCopy";
import { liveMatch, mvpLiveCodingPositioning } from "@/lib/data";

export function ArenaPreview() {
  return (
    <section className="relative px-4 py-14 md:px-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-6xl"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-neon-green uppercase">
              Arena snapshot
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl md:leading-tight">
              The HUD teams wish shipped day one.
            </h2>
            <p className="mt-3 max-w-2xl font-body text-sm font-semibold leading-relaxed text-highlight md:text-[15px] md:leading-relaxed">
              {mvpLiveCodingPositioning.headline}
            </p>
            <p className="mt-2 max-w-2xl text-xs font-medium text-highlight md:text-[13px]">
              {conversionCopy.foundingCompetitors}
            </p>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
              Split IDEs, live vote momentum, pulse telemetry, sponsor beats—stream-ready chrome before hosted
              execution lands.
            </p>
          </div>
          <Link
            href="/arena"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-neon-green px-5 py-2.5 text-sm font-bold text-blackout shadow-[0_0_32px_rgb(57_255_20_/_0.28)] transition hover:brightness-110 lg:self-end"
          >
            Enter the Arena
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="ks-panel scanlines relative mt-8 overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
          <div className="relative grid gap-6 p-5 md:grid-cols-3 md:p-8">
            <div className="relative flex flex-col gap-4 md:col-span-2">
              <div className="pointer-events-none absolute -right-16 top-0 size-52 rounded-full bg-neon-green/6 blur-3xl" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-red/15 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-danger-red uppercase ring-1 ring-danger-red/35">
                  <span className="size-1.5 animate-pulse rounded-full bg-danger-red" />
                  LIVE
                </span>
                <StatPill label="Round" value={`${liveMatch.round} of ${liveMatch.bestOf}`} />
                <StatPill label="Clock" value={liveMatch.timer} tone="green" />
                <StatPill label="Prize" value={liveMatch.prizePool} icon={DollarSign} tone="purple" />
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/12 bg-gradient-to-br from-black/65 to-black/35 px-4 py-3.5 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-lg border border-neon-green/35 bg-black/40 px-3 py-2">
                    <p className="font-mono text-sm font-bold uppercase tracking-wide text-neon-green">
                      {liveMatch.contestantA}
                    </p>
                  </div>
                  <span className="font-heading text-lg font-black text-highlight md:text-xl">VS</span>
                  <div className="rounded-lg border border-electric-blue/35 bg-black/40 px-3 py-2">
                    <p className="font-mono text-sm font-bold uppercase tracking-wide text-electric-blue">
                      {liveMatch.contestantB}
                    </p>
                  </div>
                </div>
                <StatPill label="Spectators" value={liveMatch.viewers.toLocaleString()} icon={Users} />
              </div>
              <div className="grid gap-3 rounded-xl border border-dashed border-white/14 bg-black/35 p-3 md:grid-cols-2 md:p-4">
                <div className="relative h-28 overflow-hidden rounded-lg bg-black/65 ring-1 ring-inset ring-neon-green/15">
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-neon-green/14 to-transparent" />
                  <p className="absolute bottom-2 left-3 font-mono text-[10px] tracking-wide text-highlight-dim/55">
                    FEED · {liveMatch.contestantA}
                  </p>
                </div>
                <div className="relative h-28 overflow-hidden rounded-lg bg-black/65 ring-1 ring-inset ring-electric-blue/15">
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-electric-blue/14 to-transparent" />
                  <p className="absolute bottom-2 left-3 font-mono text-[10px] tracking-wide text-highlight-dim/55">
                    FEED · {liveMatch.contestantB}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col gap-4 rounded-xl border border-volt-purple/25 bg-gradient-to-b from-black/55 to-black/35 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-highlight-dim/70 uppercase">
                <Zap className="mr-1 inline size-4 text-neon-green" aria-hidden />
                Vote telemetry
              </p>
              <p className="font-body text-sm leading-relaxed text-highlight-dim">
                Time clamps, rogue tests, forced explainers, built-in bans—votes hit the matchup,
                not a suggestion box.
              </p>
              <div className="mt-auto rounded-lg border border-white/12 bg-black/45 p-3 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-highlight-dim/55">
                  Presented by
                </p>
                <p className="font-heading text-sm font-bold tracking-wide text-neon-green">
                  {liveMatch.sponsorBrand}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
