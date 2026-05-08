"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio, Users, Zap } from "lucide-react";
import Link from "next/link";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { WaitlistForm } from "@/components/WaitlistForm";
import { conversionCopy } from "@/lib/conversionCopy";
import { liveMatch, mvpLiveCodingPositioning } from "@/lib/data";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-6 md:pb-24 md:pt-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgb(57_255_20_/_0.03)_50%,transparent_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-4 size-[420px] rounded-full bg-neon-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-32 size-[400px] rounded-full bg-electric-blue/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-[320px] rounded-full bg-volt-purple/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        <div className="relative rounded-2xl border border-white/[0.08] bg-black/25 p-px shadow-[0_0_80px_-20px_rgb(57_255_20_/_0.35)] md:rounded-[1.75rem]">
          <div className="rounded-[calc(1rem-1px)] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent px-5 py-10 md:rounded-[calc(1.75rem-1px)] md:px-10 md:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <SeasonZeroBadge />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-neon-green/35 bg-neon-green/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-green md:text-xs md:tracking-[0.22em]"
                >
                  <Radio className="size-3.5 shrink-0 animate-pulse" aria-hidden />
                  <span>Beta access · Livestream-ready MVP</span>
                </motion.div>
              </div>

              <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-electric-blue/90">
                {conversionCopy.launchBracketApplicationsOpen}
              </p>

              <motion.p
                className="mx-auto mt-5 max-w-md font-heading text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight/70 md:text-xs"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ duration: 0.45, delay: 0.04 }}
              >
                The live coding battle arena
              </motion.p>

              <motion.h1
                className="mt-4 bg-gradient-to-b from-highlight via-highlight to-highlight-dim bg-clip-text font-heading text-5xl font-bold tracking-tight text-transparent md:text-7xl md:leading-[1.04]"
                transition={{ duration: 0.5, delay: 0.06 }}
                initial={fadeUp.initial}
                animate={fadeUp.animate}
              >
                Killswitch
              </motion.h1>

              <motion.p
                className="mt-5 font-heading text-xl font-semibold tracking-wide text-neon-green md:text-2xl md:tracking-[0.02em]"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Code under pressure.
              </motion.p>

              <motion.p
                className="mx-auto mt-5 max-w-xl font-body text-[15px] leading-relaxed text-highlight-dim md:text-lg md:leading-relaxed"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ duration: 0.55, delay: 0.14 }}
              >
                Devs duel live on stream. Crowds weaponize clocks, tests, and constraints. AI keeps viewers
                inside the matchup—no glossary required.
              </motion.p>

              <motion.p
                className="mx-auto mt-4 max-w-lg font-body text-sm font-medium leading-snug text-highlight md:text-[15px]"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ duration: 0.5, delay: 0.16 }}
              >
                {conversionCopy.foundingCompetitors}
              </motion.p>

              <motion.p
                className="mx-auto mt-6 max-w-2xl border-y border-white/[0.08] px-4 py-4 font-body text-[13px] font-medium leading-snug text-highlight md:text-[15px]"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ duration: 0.5, delay: 0.18 }}
              >
                <span className="text-highlight/95">{mvpLiveCodingPositioning.headline}</span>{" "}
                <span className="mt-2 block font-normal text-highlight-dim/75 md:inline md:mt-0 md:before:mx-2 md:before:content-['·']">
                  Livestream-ready Season Zero HUD—hosted execution tiers follow the founding launch bracket.
                </span>
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href="/arena"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-bold text-blackout shadow-[0_0_48px_rgb(57_255_20_/_0.35)] transition hover:brightness-110 active:brightness-95"
                >
                  Enter the Arena
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#early-access"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neon-green/45 bg-neon-green/10 px-6 py-3 text-sm font-bold text-neon-green transition hover:bg-neon-green/18"
                >
                  Join Early Access
                </a>
                <Link
                  href="/apply"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/18 bg-slate-dark/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-neon-green/40 hover:bg-slate-dark"
                >
                  Apply to Compete
                </Link>
                <Link
                  href="/sponsor"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-volt-purple/50 bg-volt-purple/12 px-6 py-3 text-sm font-semibold text-volt-purple transition hover:bg-volt-purple/20"
                >
                  <Zap className="size-4" />
                  Sponsor an Event
                </Link>
              </motion.div>

              <motion.div
                className="mx-auto mt-8 w-full max-w-xl text-left"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
              >
                <WaitlistForm id="early-access" source="hero" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 md:gap-4"
              >
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 font-mono text-[11px] text-highlight-dim md:text-xs">
                  <Users className="size-3.5 text-electric-blue" aria-hidden />
                  <span className="text-highlight/90">{liveMatch.viewers.toLocaleString()}</span>
                  <span className="text-highlight-dim/75">watching · Beta Access</span>
                </span>
                <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
                <span className="font-mono text-[11px] text-neon-green/90 md:text-xs">{liveMatch.timer}</span>
                <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
                <span className="font-mono text-[11px] text-highlight-dim md:text-xs">
                  {liveMatch.prizePool} pool
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
