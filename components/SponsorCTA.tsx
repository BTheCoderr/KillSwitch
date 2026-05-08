"use client";

import { motion } from "framer-motion";
import { Megaphone, Zap } from "lucide-react";
import Link from "next/link";

export function SponsorCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="px-4 py-14 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-volt-purple/30 bg-gradient-to-br from-volt-purple/[0.14] via-slate-dark to-blackout p-8 shadow-[0_40px_100px_-30px_rgb(138_43_226_/_0.35)] md:p-11">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-volt-purple uppercase">
              <Megaphone className="size-4" />
              For sponsors
            </p>
            <h2 className="mt-4 font-heading text-2xl font-bold text-highlight md:text-3xl md:leading-tight">
              Be the storyline engineers rewind and forward.
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
              Own overlay moments, presented-by punches, branded tests—presence where devs lock
              in, not skim tab three.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col xl:flex-row">
            <Link
              href="/sponsor"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-volt-purple px-8 py-3 text-sm font-bold text-white shadow-[0_0_40px_rgb(138_43_226_/_0.35)] transition hover:brightness-110"
            >
              <Zap className="size-4" aria-hidden />
              Sponsor an Event
            </Link>
            <Link
              href="/sponsor"
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/15 px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-highlight-dim transition hover:border-white/35 hover:text-white"
            >
              View packages →
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
