"use client";

import { motion } from "framer-motion";
import { Brain, Flame, HardDrive, Link2, RotateCcw, Timer, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { ArenaPreview } from "@/components/ArenaPreview";
import { Hero } from "@/components/Hero";
import { SponsorCTA } from "@/components/SponsorCTA";
import { TournamentCard } from "@/components/TournamentCard";
import { audiencePowers, audienceVoteOptions, howItWorks, tournaments } from "@/lib/data";

const iconByVoteId: Record<string, typeof Flame> = {
  "reverse-iteration": RotateCcw,
  "time-crunch": Timer,
  "memory-limit": HardDrive,
  "no-backspace": Link2,
};

export default function Home() {
  const upcoming = tournaments[0];

  return (
    <>
      <Hero />
      <ArenaPreview />
      <section className="px-4 py-16 md:px-6 md:py-20">
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
            <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
              Three beats. One broadcast.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="ks-panel rounded-xl p-6"
              >
                <span className="font-mono text-xs text-neon-green">0{i + 1}</span>
                <h3 className="mt-3 font-heading text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-highlight-dim">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-electric-blue uppercase">
              Audience modifiers
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
              The crowd doesn&apos;t just watch — they arm the twists
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="rounded-xl border border-white/10 bg-slate-dark/60 p-5"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-neon-green/25 bg-black/40 text-neon-green">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-electric-blue">{label}</p>
                  <h3 className="mt-1 font-heading text-base font-bold text-white">{power.title}</h3>
                  <p className="mt-2 font-body text-sm text-highlight-dim">{power.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-volt-purple uppercase">
                Upcoming tournament
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
                {upcoming.title}
              </h2>
            </div>
            <Link
              href="/tournaments"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-dark/80 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-neon-green/30"
            >
              View all brackets
            </Link>
          </motion.div>
          <motion.div
            className="mt-8 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <TournamentCard tournament={upcoming} />
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="ks-panel rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 text-neon-green">
              <Trophy className="size-5" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase">For developers</p>
            </div>
            <h3 className="mt-3 font-heading text-xl font-bold text-white">
              Want your solves under stadium lights?
            </h3>
            <ul className="mt-4 space-y-3 font-body text-sm text-highlight-dim">
              <li>— Live IDE, on-screen diagnostics, and pressure you can feel.</li>
              <li>— Audiences that reward clarity, not just accepted answers.</li>
              <li>— Replay-ready storylines for your portfolio and community.</li>
            </ul>
            <Link
              href="/apply"
              className="mt-6 inline-flex rounded-lg bg-neon-green px-5 py-2.5 text-sm font-bold text-stealth"
            >
              Apply to compete
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="ks-panel rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 text-volt-purple">
              <Brain className="size-5" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase">For sponsors</p>
            </div>
            <h3 className="mt-3 font-heading text-xl font-bold text-white">
              Attention that&apos;s visible, nerdy, and measurable
            </h3>
            <ul className="mt-4 space-y-3 font-body text-sm text-highlight-dim">
              <li>— Technical reach without the sleepy webinar vibe.</li>
              <li>— Brand moments fused into challenges and overlays.</li>
              <li>— Recaps engineers actually forward internally.</li>
            </ul>
            <Link
              href="/sponsor"
              className="mt-6 inline-flex rounded-lg border border-volt-purple/40 bg-volt-purple/10 px-5 py-2.5 text-sm font-semibold text-volt-purple"
            >
              Explore sponsor tiers
            </Link>
          </motion.div>
        </div>
      </section>

      <SponsorCTA />

      <section className="px-4 pb-20 md:px-6 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-neon-green/15 bg-slate-dark/80 p-8 text-center md:p-12"
        >
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            The arena opens soon.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-body text-sm text-highlight-dim">
            Check out the live dashboard mock, browse brackets, and join the
            waitlist for competitors or sponsor packages.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/arena"
              className="inline-flex items-center justify-center rounded-lg bg-neon-green px-6 py-3 text-sm font-bold text-stealth"
            >
              Watch the demo HUD
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white"
            >
              Save a competitor slot
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
