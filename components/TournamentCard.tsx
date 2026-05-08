import type { Tournament } from "@/lib/data";
import { cn } from "@/lib/utils";

type TournamentCardProps = {
  tournament: Tournament;
  className?: string;
};

export function TournamentCard({ tournament, className }: TournamentCardProps) {
  const open = tournament.status === "Applications Open";
  const betaWaitlist = tournament.status === "Early Access";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-dark/70 p-6 transition hover:border-neon-green/30 hover:shadow-[0_0_40px_rgb(57_255_20_/_0.08)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 size-52 rounded-full bg-volt-purple/10 blur-2xl" />
        <div className="absolute -right-10 bottom-0 size-40 rounded-full bg-neon-green/5 blur-2xl" />
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ring-1",
              open
                ? "bg-neon-green/15 text-neon-green ring-neon-green/35"
                : betaWaitlist
                  ? "bg-electric-blue/15 text-electric-blue ring-electric-blue/35"
                  : "bg-highlight/10 text-highlight-dim ring-white/15",
            )}
          >
            {open ? tournament.status : betaWaitlist ? "Beta waitlist open" : tournament.status}
          </span>
          {typeof tournament.contestants === "number" && (
            <span className="text-xs text-highlight-dim/55">
              {tournament.contestants} contestants
            </span>
          )}
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-white">{tournament.title}</h3>
          <p className="mt-1 font-body text-sm text-highlight-dim">{tournament.description}</p>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-highlight-dim/45 uppercase">
              Prize
            </p>
            <p className="mt-0.5 text-lg font-semibold text-neon-green">
              {tournament.prize}
            </p>
          </div>
          <span className="rounded-md border border-neon-green/20 bg-neon-green/5 px-2 py-1 font-mono text-xs text-neon-green">
            KS //
          </span>
        </div>
      </div>
    </article>
  );
}
