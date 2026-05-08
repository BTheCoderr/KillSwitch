"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { replays } from "@/lib/data";

export default function ReplaysPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/40">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-volt-purple uppercase">
            Replays
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Netflix energy for coding battles
          </h1>
          <p className="mt-3 max-w-2xl font-body text-sm text-highlight-dim">
            Full replay vault ships next—queue the launch moments, mid-match twists,
            and AI narrated breakdowns.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {replays.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="relative aspect-[4/5] w-[72vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-slate-dark/70 shadow-[0_30px_80px_rgb(0_0_0_/_0.55)] md:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/15 via-slate-dark to-black" />
              <div className="absolute inset-0 opacity-40 mix-blend-screen">
                <div className="absolute -right-16 top-10 size-48 rounded-full bg-volt-purple/25 blur-3xl" />
                <div className="absolute bottom-0 left-0 size-56 rounded-full bg-neon-green/10 blur-3xl" />
              </div>
              <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-highlight-dim uppercase ring-1 ring-white/10">
                  {r.subtitle}
                </span>
                <h2 className="mt-3 font-heading text-xl font-bold text-white md:text-2xl">{r.title}</h2>
                <p className="mt-2 font-body text-sm text-highlight-dim">
                  Full bleed replays, multi-cam IDE, and analyst overlays land here.
                </p>
                <div className="mt-5 flex items-center gap-2 text-highlight-dim/50">
                  <span className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/50">
                    <Play className="size-4 fill-highlight-dim/80 text-highlight-dim/80" />
                  </span>
                  <span className="text-xs font-medium">Queued for launch</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
