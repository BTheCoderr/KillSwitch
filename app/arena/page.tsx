"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, Cpu, DollarSign, Radio, Sparkles, Trophy, Twitch, Users, Youtube } from "lucide-react";
import { AudiencePulseBar } from "@/components/AudiencePulseBar";
import { AudienceVotePanel } from "@/components/AudienceVotePanel";
import { CodePanel } from "@/components/CodePanel";
import { StatPill } from "@/components/StatPill";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { codeSamples, liveMatch, mvpLiveCodingPositioning } from "@/lib/data";
import { conversionCopy } from "@/lib/conversionCopy";

const fade = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

export default function ArenaPage() {
  return (
    <div className="relative flex min-h-[70vh] flex-1 flex-col overflow-hidden bg-blackout">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 85% 60% at 50% -20%, rgb(57 255 20 / 0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 0%, rgb(39 151 255 / 0.1), transparent 50%), radial-gradient(ellipse 40% 35% at 0% 20%, rgb(138 43 226 / 0.09), transparent 50%)",
        }}
      />

      <div className="relative border-b border-white/[0.07] bg-slate-dark/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-between">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neon-green/90">
              <Cpu className="size-3.5 shrink-0" aria-hidden />
              Stream-ready MVP
            </span>
            <span className="mx-2 hidden h-px w-8 bg-white/10 md:inline" aria-hidden />
            <span className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-highlight-dim/75">
              Beta HUD · OBS browser source
            </span>
            <Link
              href="/"
              className="basis-full pt-3 text-center text-[10px] text-electric-blue/90 underline-offset-4 hover:text-neon-green hover:underline sm:basis-auto sm:ml-auto sm:pt-0 md:text-[11px]"
            >
              Back to landing
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <SeasonZeroBadge />
            <span className="rounded-full border border-electric-blue/35 bg-electric-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-electric-blue">
              Beta Access
            </span>
          </div>
          <div className="mt-4 space-y-3 rounded-lg border border-white/[0.06] bg-black/40 px-4 py-3 text-highlight md:text-left">
            <p className="text-center font-body text-[13px] font-semibold leading-snug md:text-left md:text-sm">
              {mvpLiveCodingPositioning.headline}{" "}
              <span className="font-normal text-highlight-dim">
                Stream-first battle panels are live in beta—cloud compile hooks land in a later drop; embed feeds
                wire as integrations go out.
              </span>
            </p>
            <p className="text-center text-xs font-medium text-highlight md:text-left">
              {conversionCopy.foundingCompetitors}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pb-1 md:justify-start">
              <Link
                href="/apply"
                className="text-xs font-bold uppercase tracking-wide text-neon-green underline underline-offset-4 hover:brightness-110"
              >
                Apply · Season Zero bracket
              </Link>
              <Link href="/#early-access" className="text-xs font-semibold text-electric-blue hover:underline">
                Join Early Access →
              </Link>
            </div>
            <ul className="mx-auto max-w-xl list-inside list-disc space-y-1 text-left font-body text-[12px] leading-relaxed text-highlight-dim marker:text-neon-green/80 md:text-[13px]">
              {mvpLiveCodingPositioning.pillars.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-b border-neon-green/10 bg-black/55 shadow-[inset_0_-1px_0_0_rgb(57_255_20_/_0.08)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-y-6 md:px-6 md:py-6">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <motion.span
              {...fade}
              transition={{ duration: 0.4 }}
              className="truncate font-heading text-lg font-bold text-white md:text-xl"
            >
              Kill<span className="text-neon-green">switch</span>
            </motion.span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-red/14 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-danger-red uppercase ring-1 ring-danger-red/35">
              <span className="size-1.5 animate-pulse rounded-full bg-danger-red" />
              LIVE BROADCAST
            </span>
          </div>

          <motion.div
            {...fade}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative flex flex-wrap items-center justify-center gap-4 rounded-xl border border-white/[0.09] bg-gradient-to-r from-black/70 via-black/45 to-black/70 px-5 py-3 shadow-[0_24px_60px_-30px_rgb(0_0_0_/_0.9)]">
              <Sparkles className="absolute -left-1 -top-1 size-3 text-neon-green/40" aria-hidden />
              <p className="font-mono text-base font-black text-neon-green md:text-xl">
                {liveMatch.contestantA}
              </p>
              <span className="font-heading text-lg font-black text-highlight md:text-xl">VS</span>
              <p className="font-mono text-base font-black text-electric-blue md:text-xl">
                {liveMatch.contestantB}
              </p>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <StatPill label="Round" value={`${liveMatch.round} · Bo${liveMatch.bestOf}`} tone="purple" />
            <StatPill label="Spectators" value={liveMatch.viewers.toLocaleString()} icon={Users} />
            <StatPill label="Prize pool" value={liveMatch.prizePool} icon={DollarSign} tone="green" />
            <Trophy className="size-5 text-amber-400/90 opacity-70" aria-hidden />
            <Twitch className="size-5 text-volt-purple" aria-hidden />
            <Youtube className="size-5 text-danger-red" aria-hidden />
          </div>
        </div>
      </div>

      <motion.div
        {...fade}
        transition={{ duration: 0.5 }}
        className="relative border-b border-white/[0.06] bg-[linear-gradient(180deg,rgb(5_7_10)_0%,rgb(11_15_23)_55%,rgb(5_7_10)_100%)] py-6 md:py-8"
      >
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.35em] text-highlight-dim/45">
          Match clock
        </p>
        <p className="mt-3 text-center font-mono text-5xl font-black tabular-nums tracking-[0.12em] text-neon-green drop-shadow-[0_0_34px_rgb(57_255_20_/_0.35)] md:text-7xl md:tracking-[0.18em]">
          {liveMatch.timer}
        </p>
        <p className="mt-4 text-center text-xs text-highlight-dim/70 md:text-sm">
          {liveMatch.contestantA} clawing brute swaps ·{" "}
          <span className="text-highlight/90">{liveMatch.contestantB}</span>
          threading index maps
        </p>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-6 md:gap-6 md:px-6 md:py-8 lg:flex-row lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex min-w-0 flex-1 flex-col gap-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CodePanel
              title={liveMatch.contestantA}
              language={liveMatch.languageA}
              code={codeSamples[liveMatch.contestantA]}
              accent="green"
              compileStatus="Compiles · 3.2s"
            />
            <CodePanel
              title={liveMatch.contestantB}
              language={liveMatch.languageB}
              code={codeSamples[liveMatch.contestantB]}
              accent="blue"
              compileStatus="Compiles · 2.7s"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.div {...fade} transition={{ duration: 0.4 }} className="ks-panel rounded-xl p-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-highlight-dim/45 uppercase">
                Current problem
              </p>
              <p className="mt-2 font-heading text-xl font-bold text-white">{liveMatch.problem}</p>
              <p className="mt-2 font-body text-xs leading-relaxed text-highlight-dim">
                Minimum ops showdown—strategy vs brute force framed for camera legibility.
              </p>
              <span className="mt-4 inline-flex items-center rounded border border-volt-purple/35 bg-volt-purple/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-volt-purple">
                {liveMatch.difficulty}
              </span>
            </motion.div>

            <motion.div {...fade} transition={{ duration: 0.4, delay: 0.04 }} className="ks-panel rounded-xl p-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-highlight-dim/45 uppercase">
                Live chatter
              </p>
              <div className="mt-4 space-y-2.5 font-mono text-[11px] leading-snug md:text-xs">
                <p>
                  <span className="font-semibold text-neon-green">byteHype</span>
                  <span className="text-highlight-dim/60">:</span>{" "}
                  <span className="text-highlight-dim">NO BUILT-INS PLEASE</span>
                </p>
                <p>
                  <span className="font-semibold text-electric-blue">streamProof</span>
                  <span className="text-highlight-dim/60">:</span>{" "}
                  <span className="text-highlight-dim">{liveMatch.contestantB} mapping diff is cinematic</span>
                </p>
                <p>
                  <span className="font-semibold text-volt-purple">lunaNation</span>
                  <span className="text-highlight-dim/60">:</span>{" "}
                  <span className="text-highlight-dim">{liveMatch.contestantA} still has runway</span>
                </p>
              </div>
            </motion.div>

            <motion.div {...fade} transition={{ duration: 0.4, delay: 0.08 }} className="ks-panel rounded-xl p-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-highlight-dim/45 uppercase">
                Spectator heat
              </p>
              <p className="mt-3 font-body text-sm text-highlight-dim">Momentum check — who steals this duel?</p>
              <div className="mt-5 space-y-3">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neon-green">{liveMatch.contestantA}</span>
                    <span className="font-mono tabular-nums text-neon-green">58%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/55 ring-1 ring-inset ring-white/5">
                    <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-neon-green to-electric-blue" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-electric-blue">{liveMatch.contestantB}</span>
                    <span className="font-mono tabular-nums text-highlight-dim">42%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/55 ring-1 ring-inset ring-white/5">
                    <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-electric-blue to-volt-purple/90" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative flex w-full shrink-0 flex-col gap-4 lg:w-[22rem]"
        >
          <div className="pointer-events-none absolute -left-24 top-40 hidden size-64 rounded-full bg-volt-purple/10 blur-[100px] lg:block" />

          <AudienceVotePanel />

          <div className="ks-panel rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-volt-purple">
              <Brain className="size-4 shrink-0" />
              AI explainer{" "}
              <span className="rounded bg-violet-500/18 px-1.5 py-0.5 text-[9px] font-semibold lowercase tracking-normal text-highlight-dim/80 ring-1 ring-white/10">
                beta
              </span>
            </div>
            <p className="mt-4 font-body text-sm leading-relaxed text-highlight-dim">{liveMatch.analystSnippet}</p>
            <button
              type="button"
              className="mt-5 w-full rounded-lg border border-volt-purple/35 bg-gradient-to-br from-volt-purple/20 to-transparent py-3 text-[11px] font-bold uppercase tracking-wide text-volt-purple shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.06)] transition hover:bg-violet-500/20"
            >
              Show walkthrough
            </button>
          </div>

          <div className="ks-panel rounded-xl p-5">
            <AudiencePulseBar />
          </div>

          <div className="rounded-xl border border-neon-green/22 bg-[linear-gradient(145deg,rgb(57_255_20_/_0.08)_0%,transparent_60%)] p-6 text-center shadow-[0_0_40px_-12px_rgb(57_255_20_/_0.35)]">
            <Radio className="mx-auto size-6 text-neon-green opacity-95" aria-hidden />
            <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-highlight-dim/55">
              Sponsor slot · live read
            </p>
            <p className="mt-4 font-heading text-lg font-black text-white md:text-xl">
              <span className="text-highlight-dim/80">Sponsored by</span>{" "}
              <span className="text-neon-green">{liveMatch.sponsorBrand}</span>
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
