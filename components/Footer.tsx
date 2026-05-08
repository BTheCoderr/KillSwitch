import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { navItems } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neon-green/10 bg-slate-dark/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm space-y-3">
          <BrandMark />
          <p className="font-body text-sm leading-relaxed text-highlight-dim">
            Code under pressure. One battle. Infinite pressure. Applications
            opening soon for competitors and partners.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/60 uppercase">
              Arena
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/arena">
                  Live demo
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
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/60 uppercase">
              Compete
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-highlight-dim hover:text-neon-green" href="/apply">
                  Apply
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold tracking-wider text-highlight-dim/60 uppercase">
              Explore
            </p>
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
        &copy; {new Date().getFullYear()} KILLSWITCH. Code under pressure.
      </div>
    </footer>
  );
}
