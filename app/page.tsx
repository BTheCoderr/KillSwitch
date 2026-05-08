"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Eye, Flame, MessageSquare, PackageX, Timer, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { ArenaPreview } from "@/components/ArenaPreview";
import { Hero } from "@/components/Hero";
import { SponsorCTA } from "@/components/SponsorCTA";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { TournamentCard } from "@/components/TournamentCard";
import { WaitlistForm } from "@/components/WaitlistForm";
import { conversionCopy } from "@/lib/conversionCopy";
import { audiencePowers, audienceVoteOptions, howItWorks, mvpLiveCodingPositioning, tournaments } from "@/lib/data";

const iconByVoteId: Record<string, typeof Flame> = {
  "add-time-pressure": Timer,
  "reveal-hidden-test": Eye,
  "force-explanation": MessageSquare,
  "no-built-ins": PackageX,
};

const sectionGap = "px-4 py-14 md:px-8 md:py-16 lg:px-10";

export default function Home() {
  const upcoming = tournaments[0];

  return (
    <>
      <Hero />
      <ArenaPreview />
      <section className={sectionGap}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="ks-panel relative overflow-hidden rounded-2xl p-7 md:p-10 lg:p-11"
          >
            <div className="pointer-events-none absolute right-0 top-0 size-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-neon-green/8 blur-[100px]" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <SeasonZeroBadge />
                <p className="text-xs font-semibold tracking-[0.24em] text-electric-blue uppercase">
                  Roadmap · Live coding MVP
                </p>
              </div>
              <h2 className="mt-4 max-w-3xl font-heading text-2xl font-bold leading-tight text-white md:text-3xl lg:text-[2rem] lg:leading-snug">
                {mvpLiveCodingPositioning.headline}
              </h2>
              <p className="mt-5 max-w-3xl border-l-2 border-neon-green/40 pl-4 font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
                {mvpLiveCodingPositioning.scopeNote}
              </p>
              <ul className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:gap-x-10">
                {mvpLiveCodingPositioning.pillars.map((pillar, i) => (
                  <motion.li
                    key={pillar}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="flex gap-3 text-sm md:text-[15px]"
                  >
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-neon-green shadow-[0_0_12px_rgb(57_255_20_/_0.45)]" />
                    <span className="font-medium text-highlight/95">{pillar}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="mt-10 text-xs leading-relaxed text-highlight-dim/65 md:text-sm"
              >
                Season Zero concentrates on spectacle, early-access intake, and a stream-ready arena—auth,
                payments, and hosted runners layer in as the first launch bracket scales.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
      <section className={sectionGap}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-neon-green uppercase">
              How it works
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-white md:text-4xl md:leading-tight">
              Same roadmap, tighter rounds.
            </h2>
            <p className="mt-3 max-w-2xl font-body text-sm font-medium leading-relaxed text-highlight md:text-[15px]">
              Three beats choreographed for launch: duel-ready rooms, audience payloads, AI match narration,
              bracket arcs, and replay energy—all shipping as an early-access, livestream-ready MVP while founding
              competitors and sponsors onboard.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {howItWorks.map((step, i) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="ks-panel rounded-xl p-6 md:p-7"
              >
                <span className="font-mono text-[11px] font-bold text-neon-green">0{i + 1}</span>
                <h3 className="mt-3 font-heading text-lg font-bold text-white md:text-xl">{step.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-highlight-dim">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionGap}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-electric-blue uppercase">
              Audience powers
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-white md:text-4xl md:leading-tight">
              They vote. The matchup warps.
            </h2>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
              Not vanity polls—these payloads hit timing, tooling, and televised nerve.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {audiencePowers.map((power, i) => {
              const Icon = iconByVoteId[power.optionId] ?? Zap;
              const label =
                audienceVoteOptions.find((v) => v.id === power.optionId)?.label ?? power.title;
              return (
                <motion.div
                  key={power.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6"
                >
                  <div className="flex size-11 items-center justify-center rounded-lg border border-neon-green/35 bg-black/50 text-neon-green">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-electric-blue/90">{label}</p>
                  <h3 className="mt-2 font-heading text-base font-bold text-white">{power.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-highlight-dim">{power.body}</p>
                </motion.div>
              );
            })}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/arena"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-neon-green px-8 py-3 text-sm font-bold text-blackout shadow-[0_0_40px_rgb(57_255_20_/_0.25)] hover:brightness-110"
            >
              Enter the Arena
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#early-access"
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-neon-green/45 bg-neon-green/10 px-7 py-3 text-sm font-bold text-neon-green hover:bg-neon-green/16"
            >
              Join Early Access
            </a>
            <Link
              href="/apply"
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/16 bg-black/35 px-7 py-3 text-sm font-semibold text-white hover:border-neon-green/35"
            >
              Apply to Compete
            </Link>
          </motion.div>
        </div>
      </section>

      <section className={sectionGap}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="ks-panel overflow-hidden rounded-2xl p-8 md:p-10"
          >
            <div className="flex flex-wrap items-center gap-2">
              <SeasonZeroBadge />
              <p className="text-xs font-semibold tracking-[0.24em] text-electric-blue uppercase">
                Community · Early access funnel
              </p>
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-white md:text-3xl">Stay in the signal</h2>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
              {conversionCopy.newsletterBlurb}
            </p>
            <div className="mt-8 max-w-xl">
              <WaitlistForm source="newsletter-home" variant="compact" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className={sectionGap}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.22em] text-volt-purple uppercase">
                Opening bracket spotlight
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-white md:text-3xl">{upcoming.title}</h2>
              <p className="mt-3 max-w-xl font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neon-green/90 md:text-xs">
                {conversionCopy.launchBracketApplicationsOpen}
              </p>
            </div>
            <Link
              href="/tournaments"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg border border-white/16 bg-black/35 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-neon-green/40"
            >
              View brackets
            </Link>
          </motion.div>
          <motion.div
            className="mt-10 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <TournamentCard tournament={upcoming} />
          </motion.div>
        </div>
      </section>

      <section className={sectionGap}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="ks-panel rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-center gap-2 text-neon-green">
              <Trophy className="size-5 shrink-0" />
              <p className="text-xs font-semibold tracking-[0.22em] uppercase">Developers</p>
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-white md:text-2xl md:leading-snug">
              Want your compile moments treated like ESPN highlights?
            </h3>
            <ul className="mt-5 space-y-3 font-body text-sm leading-relaxed text-highlight-dim">
              <li>— Transparent clocks, ruthless optics, overlays that amplify every keystroke drama.</li>
              <li>— Audiences cheering narrative, not just green checkmarks flashed offline.</li>
              <li>— Replays built to flex—not buried in repos nobody opens.</li>
            </ul>
            <p className="mt-4 text-sm font-medium text-highlight">{conversionCopy.foundingCompetitors}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/arena"
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-neon-green px-5 py-3 text-center text-sm font-bold text-blackout shadow-[0_0_32px_rgb(57_255_20_/_0.28)] hover:brightness-110"
              >
                Enter the Arena
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#early-access"
                className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-lg border border-neon-green/45 bg-neon-green/10 px-5 py-3 text-center text-sm font-bold text-neon-green hover:bg-neon-green/16 sm:max-w-none"
              >
                Join Early Access
              </a>
              <Link
                href="/apply"
                className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-lg border border-white/18 px-5 py-3 text-center text-sm font-semibold text-white hover:border-neon-green/35"
              >
                Apply to Compete
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="ks-panel rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-center gap-2 text-volt-purple">
              <Brain className="size-5 shrink-0" />
              <p className="text-xs font-semibold tracking-[0.22em] uppercase">Partners</p>
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-white md:text-2xl md:leading-snug">
              Own an attention graph that skips the sleepy webinar slump.
            </h3>
            <ul className="mt-5 space-y-3 font-body text-sm leading-relaxed text-highlight-dim">
              <li>— Brand payloads fused into arenas, overlays, recap drops.</li>
              <li>— Technical fluency preserved—credibility-first sponsorship grammar.</li>
              <li>— Signals your field teams actually forward downstream.</li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/sponsor"
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-volt-purple px-6 py-3 text-center text-sm font-bold text-white shadow-[0_0_36px_rgb(138_43_226_/_0.33)] hover:brightness-110"
              >
                <Zap className="size-4" aria-hidden />
                Sponsor an Event
              </Link>
              <Link
                href="/sponsor"
                className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-lg border border-volt-purple/45 px-6 py-3 text-center text-sm font-semibold text-violet-200 hover:bg-volt-purple/10"
              >
                View packages →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SponsorCTA />

      <section className="px-4 pb-24 pt-4 md:px-8 lg:px-10 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-6xl overflow-hidden rounded-[1.65rem] border border-neon-green/18 bg-[linear-gradient(160deg,rgb(57_255_20_/_0.08)_0%,rgb(21_28_40_/_0.95)_45%,rgb(5_7_10_/_0.98)_100%)] p-8 text-center md:p-14"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neon-green/90 uppercase">
            Season Zero · Launch lane
          </p>
          <div className="mt-3 flex justify-center">
            <SeasonZeroBadge />
          </div>
          <h2 className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-bold text-white md:text-4xl md:leading-tight">
            The arena fires when you&apos;re ready to step in.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
            Stream the Season Zero HUD, reserve early access invites, drop a competitor application, or pull
            sponsor inventory before brackets lock.
          </p>
          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/arena"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-black text-blackout shadow-[0_0_40px_rgb(57_255_20_/_0.32)] hover:brightness-110 sm:min-w-[140px]"
            >
              Enter the Arena
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#early-access"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-neon-green/45 bg-neon-green/12 px-6 py-3 text-sm font-black text-neon-green hover:bg-neon-green/18 sm:min-w-[140px]"
            >
              Join Early Access
            </a>
            <Link
              href="/apply"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-white/22 bg-black/30 px-6 py-3 text-sm font-semibold text-white hover:border-neon-green/35 sm:min-w-[140px]"
            >
              Apply to Compete
            </Link>
          </div>
          <div className="mx-auto mt-10 max-w-md px-1 text-left sm:px-0 md:mx-auto md:text-center">
            <WaitlistForm variant="compact" source="newsletter-home" className="max-w-none" />
          </div>
          <Link
            href="/sponsor"
            className="mx-auto mt-8 inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-bold text-volt-purple underline-offset-4 hover:text-neon-green hover:underline"
          >
            Sponsor an Event
            <span className="text-neon-green" aria-hidden>
              →
            </span>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
