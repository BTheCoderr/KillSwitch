"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio, Zap } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 md:px-6 md:pb-24 md:pt-12">
      <div className="pointer-events-none absolute -left-24 top-10 size-[420px] rounded-full bg-neon-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 size-[380px] rounded-full bg-volt-purple/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 rounded-full border border-neon-green/25 bg-slate-dark/70 px-3 py-1 text-xs font-medium text-neon-green"
        >
          <Radio className="size-3.5 animate-pulse" aria-hidden />
          Live competitive coding platform
        </motion.div>
        <motion.h1
          className="mt-6 font-heading text-5xl font-bold tracking-tight text-white uppercase md:text-7xl"
          transition={{ duration: 0.5, delay: 0.05 }}
          initial={fadeUp.initial}
          animate={fadeUp.animate}
        >
          KILL<span className="text-neon-green">SWITCH</span>
        </motion.h1>
        <motion.p
          className="mt-4 font-heading text-xl font-medium tracking-wide text-highlight-dim md:text-2xl"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          Code Under Pressure
        </motion.p>
        <motion.p
          className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-highlight-dim/75 md:text-lg"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          The premier live competitive coding platform where developers go
          head-to-head in real time. Live stream. Crowd power. AI insight.{" "}
          <strong className="text-neon-green">One battle. Infinite pressure.</strong>
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
        >
          <Link
            href="/arena"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-bold text-stealth shadow-[0_0_40px_rgb(57_255_20_/_0.3)] transition hover:brightness-110"
          >
            Enter the Arena
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-dark/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-neon-green/30 hover:bg-slate-dark"
          >
            Apply to Compete
          </Link>
          <Link
            href="/sponsor"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-volt-purple/40 bg-volt-purple/10 px-6 py-3 text-sm font-semibold text-volt-purple transition hover:bg-volt-purple/15"
          >
            <Zap className="size-4" />
            Sponsor an Event
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
