"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarClock, Radar } from "lucide-react";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { TournamentCard } from "@/components/TournamentCard";
import { WaitlistForm } from "@/components/WaitlistForm";
import { conversionCopy } from "@/lib/conversionCopy";
import { mvpLiveCodingPositioning, tournaments } from "@/lib/data";

export default function TournamentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/45">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2"
          >
            <SeasonZeroBadge />
            <span className="text-[10px] font-bold uppercase tracking-wide text-electric-blue">Beta Access</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 text-xs font-semibold tracking-[0.28em] text-neon-green uppercase"
          >
            Tournaments
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="mt-5 font-heading text-3xl font-bold leading-tight text-white md:text-5xl"
          >
            Brackets built like title fights.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]"
          >
            Season Zero brackets are published here first—cards below reflect live launch planning, not
            placeholder filler. Early access waitlists stay open until studios lock.
          </motion.p>
          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neon-green/90 md:text-xs">
            {conversionCopy.launchBracketApplicationsOpen}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-2 pt-6 md:px-8 md:pb-6 md:pt-8">
        <div className="ks-panel rounded-2xl px-7 py-8 md:flex md:flex-wrap md:items-start md:justify-between md:gap-10 md:px-10 md:py-9">
          <div className="flex max-w-2xl flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-neon-green/35 bg-black/55 text-neon-green md:size-14">
              <Radar className="size-8" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-highlight-dim/55">
                Launch plan · MVP live coding lane
              </p>
              <p className="mt-5 font-heading text-lg font-bold text-white md:text-xl md:leading-snug">
                {mvpLiveCodingPositioning.headline}
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-highlight-dim">
                Tournament shells and replay rows follow the arena build: ship the spectator shell (what you&apos;re
                previewing below), overlay voting + AI narration, drop calendar holds last.
              </p>
            </div>
          </div>
          <ul className="mt-8 shrink-0 space-y-3 border-t border-white/10 pt-7 font-body text-[13px] text-highlight md:mt-0 md:w-[min(100%,260px)] md:border-l md:border-t-0 md:pl-8 md:pt-0">
            {mvpLiveCodingPositioning.pillars.slice(0, 4).map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-electric-blue" />
                <span>{p}</span>
              </li>
            ))}
            <li className="flex gap-3 text-highlight-dim">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-volt-purple" />
              <span>{mvpLiveCodingPositioning.pillars[4]}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-7 px-4 py-10 md:grid-cols-3 md:gap-8 md:px-8 md:py-12">
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

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8 md:pb-20">
        <div className="ks-panel flex flex-col items-center rounded-2xl border border-white/[0.07] px-6 py-10 text-center md:flex-row md:justify-between md:gap-10 md:p-12 md:text-left">
          <div className="flex max-w-lg flex-col items-center md:flex-row md:items-start md:gap-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-electric-blue/35 bg-black/55 text-electric-blue">
              <CalendarClock className="size-8" aria-hidden />
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-highlight-dim/55">
                Season Zero scheduling
              </p>
              <p className="mt-4 font-heading text-lg font-bold text-white md:text-xl">
                Dates lock after tech rehearsals—with you on the early list.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-highlight-dim">
                Grab early access invites for calendar drops + bracket reveals. Applying to compete also flags you
                for producer outreach.
              </p>
              <div className="mx-auto mt-6 max-w-sm md:mx-0 md:max-w-md">
                <WaitlistForm source="tournaments" variant="compact" />
              </div>
              <p className="mt-5 text-xs leading-relaxed text-highlight-dim md:text-sm">
                {conversionCopy.foundingCompetitors}
              </p>
              <Link
                href="/apply"
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neon-green/35 px-5 py-2.5 text-sm font-semibold text-neon-green hover:bg-neon-green/10"
              >
                Start competitor application →
              </Link>
            </div>
          </div>
          <Link
            href="/arena"
            className="mt-8 inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-neon-green px-7 py-3 text-sm font-black text-blackout hover:brightness-110 md:mt-0"
          >
            Enter the Arena
          </Link>
        </div>
      </div>
    </div>
  );
}
