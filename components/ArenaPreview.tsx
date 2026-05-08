"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Zap } from "lucide-react";
import Link from "next/link";
import { StatPill } from "@/components/StatPill";
import { liveMatch } from "@/lib/data";

export function ArenaPreview() {
  return (
    <section className="relative px-4 py-12 md:px-6 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-6xl"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-neon-green uppercase">
              Live arena preview
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
              Real-time HUD. Real tension. Crowd-powered modifiers.
            </h2>
            <p className="mt-2 max-w-xl font-body text-sm text-highlight-dim">
              Split editors, AI explainer overlay, and audience modifier votes
              shaping every round.
            </p>
          </div>
          <Link
            href="/arena"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-neon-green/30 bg-slate-dark/80 px-4 py-2.5 text-sm font-semibold text-neon-green transition hover:bg-slate-dark md:self-auto"
          >
            Open full dashboard
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="ks-panel relative mt-8 overflow-hidden rounded-2xl">
          <div className="relative grid gap-6 p-5 md:grid-cols-3 md:p-8">
            <div className="flex flex-col gap-4 md:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-red-300 uppercase ring-1 ring-red-400/40">
                  <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
                  Live
                </span>
                <StatPill label="Round" value={`${liveMatch.round} of ${liveMatch.bestOf}`} />
                <StatPill label="Clock" value={liveMatch.timer} tone="green" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-neon-green/25 bg-slate-dark px-3 py-2">
                    <p className="font-mono text-sm font-bold text-neon-green">
                      {liveMatch.contestantA}
                    </p>
                  </div>
                  <span className="font-heading text-2xl font-black text-white">VS</span>
                  <div className="rounded-lg border border-electric-blue/25 bg-slate-dark px-3 py-2">
                    <p className="font-mono text-sm font-bold text-electric-blue">
                      {liveMatch.contestantB}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatPill
                    label="Viewers"
                    value={liveMatch.viewers.toLocaleString()}
                    icon={Users}
                  />
                </div>
              </div>
              <div className="grid gap-3 rounded-xl border border-dashed border-white/15 bg-slate-dark/40 p-4 md:grid-cols-2">
                <div className="h-24 rounded-lg bg-black/45 ring-1 ring-inset ring-neon-green/10" />
                <div className="h-24 rounded-lg bg-black/45 ring-1 ring-inset ring-electric-blue/10" />
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-volt-purple/20 bg-black/40 p-4">
              <p className="text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">
                <Zap className="mr-1 inline size-3.5 text-neon-green" />
                Modifier lane
              </p>
              <p className="font-body text-sm leading-relaxed text-highlight-dim">
                Chat votes trigger modifiers — time crunch, memory limits, and
                reversed iteration reshape each round live.
              </p>
              <div className="mt-auto rounded-lg border border-white/10 bg-slate-dark/70 p-3 text-xs text-highlight-dim/65">
                <span className="font-heading font-bold text-neon-green">
                  KILLSWITCH
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
