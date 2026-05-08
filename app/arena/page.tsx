import { Brain, Radio, Twitch, Users, Youtube } from "lucide-react";
import { AudiencePulseBar } from "@/components/AudiencePulseBar";
import { AudienceVotePanel } from "@/components/AudienceVotePanel";
import { CodePanel } from "@/components/CodePanel";
import { StatPill } from "@/components/StatPill";
import { codeSamples, liveMatch } from "@/lib/data";

export default function ArenaPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <div className="border-b border-neon-green/10 bg-slate-dark/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-bold text-white uppercase">
              KILL<span className="text-neon-green">SWITCH</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-red-300 uppercase ring-1 ring-red-400/40">
              <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
              LIVE
            </span>
            <span className="text-sm text-highlight-dim">
              Round {liveMatch.round} of {liveMatch.bestOf}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-2">
              <div className="text-center">
                <p className="font-mono text-lg font-black text-neon-green">{liveMatch.contestantA}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-heading text-2xl font-black text-white">2 <span className="text-highlight-dim/40">vs</span> 1</span>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-black text-electric-blue">{liveMatch.contestantB}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatPill label="Viewers" value={liveMatch.viewers.toLocaleString()} icon={Users} />
            <Twitch className="size-5 text-volt-purple" />
            <Youtube className="size-5 text-red-400" />
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="flex items-center justify-center border-b border-neon-green/5 bg-black/30 py-2">
        <span className="font-mono text-3xl font-black tabular-nums tracking-wider text-neon-green md:text-4xl">
          {liveMatch.timer}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row">
        {/* Left: Code panels */}
        <div className="flex flex-1 flex-col gap-4 lg:min-w-0">
          <div className="grid gap-4 md:grid-cols-2">
            <CodePanel
              title={`${liveMatch.contestantA}`}
              language={liveMatch.languageA}
              code={codeSamples[liveMatch.contestantA]}
              accent="green"
              compileStatus={`Compiles · 3.2s`}
            />
            <CodePanel
              title={`${liveMatch.contestantB}`}
              language={liveMatch.languageB}
              code={codeSamples[liveMatch.contestantB]}
              accent="blue"
              compileStatus={`Compiles · 2.7s`}
            />
          </div>

          {/* Bottom info row */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Problem */}
            <div className="ks-panel rounded-xl p-4">
              <p className="text-[10px] font-semibold tracking-wider text-highlight-dim/50 uppercase">
                Problem
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-white">
                {liveMatch.problem}
              </p>
              <p className="mt-1 font-body text-xs text-highlight-dim">
                Given an array of integers nums, return the minimum number of swaps
                required to sort the array in ascending order.
              </p>
              <span className="mt-2 inline-block rounded bg-volt-purple/15 px-2 py-0.5 text-[10px] font-bold text-volt-purple ring-1 ring-volt-purple/30 uppercase">
                {liveMatch.difficulty}
              </span>
            </div>

            {/* Live chat mock */}
            <div className="ks-panel rounded-xl p-4">
              <p className="text-[10px] font-semibold tracking-wider text-highlight-dim/50 uppercase">
                Live Chat
              </p>
              <div className="mt-2 space-y-1.5 font-mono text-xs">
                <p><span className="text-neon-green">codeNinja:</span> <span className="text-highlight-dim">REX is cooking</span> <span>🔥</span></p>
                <p><span className="text-electric-blue">DevDiva:</span> <span className="text-highlight-dim">that mapping trick is clean</span></p>
                <p><span className="text-volt-purple">algoLord:</span> <span className="text-highlight-dim">Luna can still comeback</span></p>
                <p><span className="text-amber-400">ByteMe:</span> <span className="text-highlight-dim">modifier going crazy!</span></p>
              </div>
            </div>

            {/* Spectator poll */}
            <div className="ks-panel rounded-xl p-4">
              <p className="text-[10px] font-semibold tracking-wider text-highlight-dim/50 uppercase">
                Spectator Poll
              </p>
              <p className="mt-1 font-body text-sm text-highlight-dim">
                Who will win this round?
              </p>
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neon-green">{liveMatch.contestantA}</span>
                    <span className="font-mono text-neon-green">61%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/40">
                    <div className="h-full w-[61%] rounded-full bg-gradient-to-r from-neon-green to-electric-blue" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-electric-blue">{liveMatch.contestantB}</span>
                    <span className="font-mono text-red-400">39%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/40">
                    <div className="h-full w-[39%] rounded-full bg-gradient-to-r from-red-500 to-red-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
          <AudienceVotePanel />

          {/* AI Explainer */}
          <div className="ks-panel rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-volt-purple uppercase">
              <Brain className="size-4" />
              AI Explainer <span className="text-highlight-dim/40 normal-case">BETA</span>
            </div>
            <p className="mt-3 font-body text-sm leading-relaxed text-highlight-dim">
              {liveMatch.analystSnippet}
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-volt-purple/30 bg-volt-purple/10 py-2 text-xs font-bold text-volt-purple uppercase transition hover:bg-volt-purple/20"
            >
              Show Walkthrough
            </button>
          </div>

          <div className="ks-panel rounded-xl p-4">
            <AudiencePulseBar />
          </div>

          <div className="rounded-xl border border-neon-green/15 bg-black/30 p-3 text-center">
            <Radio className="mx-auto size-4 text-neon-green" />
            <p className="mt-1 font-heading text-sm font-bold text-neon-green uppercase">
              {liveMatch.sponsorLine}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
