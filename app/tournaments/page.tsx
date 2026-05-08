"use client";

import { motion } from "framer-motion";
import { TournamentCard } from "@/components/TournamentCard";
import { tournaments } from "@/lib/data";

export default function TournamentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/40">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-[0.25em] text-neon-green uppercase"
          >
            Tournaments
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl"
          >
            Brackets launching across skill bands
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-3 max-w-2xl font-body text-sm text-highlight-dim"
          >
            Static schedule for the MVP—applications open on the first card;
            the rest are on deck for the season.
          </motion.p>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-10 md:grid-cols-3 md:px-6 md:py-14">
        {tournaments.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <TournamentCard tournament={t} className="h-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
