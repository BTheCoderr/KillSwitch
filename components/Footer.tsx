import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { WaitlistForm } from "@/components/WaitlistForm";
import { conversionCopy } from "@/lib/conversionCopy";
import { navItems } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neon-green/10 bg-stealth/80">
      <div className="border-b border-neon-green/10 bg-[linear-gradient(180deg,rgb(57_255_20_/_0.06)_0%,transparent_50%)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-end md:justify-between md:gap-12 md:px-6">
          <div className="min-w-0 max-w-lg space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <SeasonZeroBadge />
              <span className="rounded-full border border-white/14 bg-black/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-highlight-dim">
                Beta Access
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed text-highlight-dim">{conversionCopy.newsletterBlurb}</p>
          </div>
          <WaitlistForm variant="compact" source="footer" className="max-w-full md:max-w-sm" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 border-t border-white/[0.06] px-4 py-4 text-center text-xs font-semibold md:justify-start md:px-6 md:text-left">
          <Link href="/arena" className="text-neon-green hover:underline">
            Enter the Arena
          </Link>
          <Link href="/#early-access" className="text-neon-green hover:underline">
            Join Early Access
          </Link>
          <Link href="/apply" className="text-highlight hover:text-white">
            Apply to Compete
          </Link>
          <Link href="/sponsor" className="text-volt-purple hover:underline">
            Sponsor an Event
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm space-y-3">
          <BrandMark />
          <p className="font-heading text-xs font-semibold tracking-wide text-electric-blue/90">
            The live coding battle arena.
          </p>
          <p className="font-body text-sm leading-relaxed text-highlight-dim">
            Code under pressure — Killswitch wires live competitive dev battles for stream-native audiences.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/60 uppercase">Arena</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/arena">
                  Stream-ready HUD
                </Link>
              </li>
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/replays">
                  Replays
                </Link>
              </li>
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/tournaments">
                  Tournaments
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/60 uppercase">Compete</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/apply">
                  Apply
                </Link>
              </li>
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/sponsor">
                  Sponsor
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/60 uppercase">Explore</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:block sm:space-y-2">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link className="text-highlight-dim hover:text-neon-green" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neon-green/5 py-6 text-center text-xs text-highlight-dim/45">
        &copy; {new Date().getFullYear()} Killswitch. Code under pressure.
      </div>
    </footer>
  );
}
