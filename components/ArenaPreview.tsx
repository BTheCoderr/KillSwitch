"use client";

import { motion } from "framer-motion";
import { ArrowRight, Monitor, Radio, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { mvpLiveCodingPositioning } from "@/lib/data";

const slotAccents = [
  "border-neon-green/35 text-neon-green",
  "border-electric-blue/35 text-electric-blue",
  "border-volt-purple/35 text-volt-purple",
  "border-amber-400/35 text-amber-300",
];

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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-green">
              Broadcast preview
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl md:leading-tight">
              Four feeds. One clock. One producer.
            </h2>
            <p className="mt-3 max-w-2xl font-body text-sm font-semibold leading-relaxed text-highlight md:text-[15px]">
              {mvpLiveCodingPositioning.headline}
            </p>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
              This is a format preview, not a live match. Real shows load approved contestant editor embeds into
              the four slots below and synchronize them through the producer-controlled match state.
            </p>
          </div>
          <Link
            href="/arena"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-neon-green px-5 py-2.5 text-sm font-bold text-blackout shadow-[0_0_32px_rgb(57_255_20_/_0.28)] transition hover:brightness-110 lg:self-end"
          >
            Preview the Format
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="ks-panel scanlines relative mt-8 overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
          <div className="relative p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-highlight-dim ring-1 ring-white/10">
                  <Radio className="size-3" />
                  Simulated layout
                </span>
                <span className="font-mono text-xs uppercase tracking-wide text-highlight-dim/60">
                  Round 1 of 3
                </span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-neon-green">
                <Timer className="size-4" />
                10:00
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[1, 2, 3, 4].map((slot, index) => (
                <div
                  key={slot}
                  className={`relative min-h-36 overflow-hidden rounded-xl border bg-black/55 p-4 ${slotAccents[index]}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-black uppercase tracking-[0.2em]">
                      Slot {slot}
                    </span>
                    <Monitor className="size-4 opacity-60" />
                  </div>
                  <div className="mt-8 space-y-2 opacity-30">
                    <div className="h-2 w-3/4 rounded bg-current" />
                    <div className="h-2 w-1/2 rounded bg-current" />
                    <div className="h-2 w-2/3 rounded bg-current" />
                  </div>
                  <p className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wide text-highlight-dim/45">
                    Approved third-party editor embed
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/45 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neon-green">
                  Modifier
                </p>
                <p className="mt-1 text-sm font-semibold text-white">No Backspace</p>
                <p className="mt-1 text-xs text-highlight-dim/55">Producer-enforced show rule</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/45 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-electric-blue">
                  Score
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Manual + atomic updates</p>
                <p className="mt-1 text-xs text-highlight-dim/55">Visible to every broadcast source</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/45 p-4">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-volt-purple">
                  <Zap className="size-3" /> Audience input
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Show-controlled</p>
                <p className="mt-1 text-xs text-highlight-dim/55">Not an open anonymous write path</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
