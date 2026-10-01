"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Monitor,
  Radio,
  ShieldCheck,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { MODIFIER_OPTIONS } from "@/lib/types";
import { mvpLiveCodingPositioning } from "@/lib/data";

const slots = [
  { n: 1, accent: "border-neon-green/35 text-neon-green" },
  { n: 2, accent: "border-electric-blue/35 text-electric-blue" },
  { n: 3, accent: "border-volt-purple/35 text-volt-purple" },
  { n: 4, accent: "border-amber-400/35 text-amber-300" },
];

export default function ArenaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-white/[0.07] bg-slate-dark/35 px-4 py-12 md:px-8 md:py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 bg-neon-green/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-3">
            <SeasonZeroBadge />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-highlight-dim">
              Format preview · not a live match
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-black leading-tight text-white md:text-6xl">
            The broadcast cockpit is the product.
          </h1>
          <p className="mt-5 max-w-3xl font-body text-base leading-relaxed text-highlight-dim md:text-lg">
            {mvpLiveCodingPositioning.scopeNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-black text-blackout hover:brightness-110"
            >
              Apply to Compete
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#early-access"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/15 bg-black/35 px-6 py-3 text-sm font-semibold text-white hover:border-neon-green/35"
            >
              Join Early Access
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="ks-panel overflow-hidden rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/45 px-5 py-4 md:px-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-highlight-dim ring-1 ring-white/10">
                <Radio className="size-3" />
                Simulated layout
              </span>
              <span className="font-mono text-xs text-highlight-dim/55">ROUND 1 OF 3</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-2xl font-black text-neon-green">
              <Timer className="size-5" />
              10:00
            </div>
          </div>

          <div className="grid gap-3 p-4 md:grid-cols-2 md:p-6">
            {slots.map((slot) => (
              <motion.div
                key={slot.n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative min-h-64 overflow-hidden rounded-xl border-2 bg-black/60 ${slot.accent}`}
              >
                <div className="absolute left-0 top-0 flex items-center gap-2 border-b border-r border-current/30 bg-slate-950/90 px-3 py-2">
                  <span className="font-mono text-xs font-black uppercase tracking-[0.18em]">
                    Slot {slot.n}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-highlight-dim/50">
                    contestant feed
                  </span>
                </div>
                <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
                  <Monitor className="size-8 opacity-35" />
                  <p className="text-sm font-semibold text-highlight/75">Approved editor embed loads here</p>
                  <p className="max-w-xs text-xs leading-relaxed text-highlight-dim/45">
                    Replit, StackBlitz, Playcode, or CodeSandbox. Killswitch does not execute contestant code.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-3 border-t border-white/10 bg-black/25 p-4 sm:grid-cols-3 md:p-6">
            <div className="rounded-xl border border-neon-green/20 bg-neon-green/5 p-4">
              <Zap className="size-4 text-neon-green" />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-neon-green">
                Active modifier
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-white">No Backspace</p>
              <p className="mt-1 text-xs leading-relaxed text-highlight-dim/55">
                A show rule contestants follow; the external editor is not technically locked.
              </p>
            </div>
            <div className="rounded-xl border border-electric-blue/20 bg-electric-blue/5 p-4">
              <Trophy className="size-4 text-electric-blue" />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-electric-blue">
                Scoring
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-white">Producer controlled</p>
              <p className="mt-1 text-xs leading-relaxed text-highlight-dim/55">
                Score changes are manual, synchronized, and rendered to every broadcast source.
              </p>
            </div>
            <div className="rounded-xl border border-volt-purple/20 bg-volt-purple/5 p-4">
              <ShieldCheck className="size-4 text-volt-purple" />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-volt-purple">
                Audience input
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-white">Controlled ingestion</p>
              <p className="mt-1 text-xs leading-relaxed text-highlight-dim/55">
                Votes enter through show controls or the rate-limited Twitch bot, not an open browser write path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-8 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-neon-green">
              What the show actually does
            </p>
            <h2 className="mt-3 font-heading text-3xl font-black text-white">
              Simple enough to run. Clear enough to trust.
            </h2>
            <div className="mt-7 space-y-3">
              {mvpLiveCodingPositioning.pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon-green" />
                  <span className="text-sm text-highlight">{pillar}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ks-panel rounded-2xl p-6 md:p-7">
            <div className="flex items-center gap-2">
              <Code2 className="size-5 text-electric-blue" />
              <h3 className="font-heading text-xl font-bold text-white">Modifier vocabulary</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-highlight-dim">
              These are the real Season Zero commands used by the show state.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {MODIFIER_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="rounded-lg border border-white/8 bg-black/35 px-3 py-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wide text-neon-green/75">
                    !{option.id}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{option.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
