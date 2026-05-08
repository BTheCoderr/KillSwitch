"use client";

import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import Link from "next/link";

export function SponsorCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="px-4 py-16 md:px-6"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-neon-green/25 bg-gradient-to-br from-neon-green/10 via-slate-dark to-slate-dark p-8 md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-neon-green uppercase">
              <Megaphone className="size-4" />
              For sponsors
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-white md:text-3xl">
              Own a moment developers actually watch
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-highlight-dim">
              Logos on stream, presented-by placement, branded challenges, and
              replay-ready clips built for technical audiences.
            </p>
          </div>
          <Link
            href="/sponsor"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-neon-green px-6 py-3 text-sm font-bold text-stealth shadow-[0_0_40px_rgb(57_255_20_/_0.25)] transition hover:brightness-110"
          >
            Request packages
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
