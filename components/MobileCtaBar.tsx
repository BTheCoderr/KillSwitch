"use client";

import Link from "next/link";

/**
 * Thumb-zone CTAs — hidden on md+ breakpoints. Join links to homepage waitlist (`#early-access`).
 */
export function MobileCtaBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-black/80 backdrop-blur-2xl md:hidden"
      aria-label="Quick actions"
      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-1.5 px-3 pt-1.5 pb-1">
        <Link
          href="/arena"
          className="flex min-h-[42px] min-w-0 flex-1 items-center justify-center rounded-lg bg-neon-green text-[10px] font-black uppercase tracking-[0.14em] text-blackout shadow-[0_0_18px_rgb(57_255_20_/_0.22)] transition active:scale-[0.98]"
        >
          Arena
        </Link>
        <Link
          href="/#early-access"
          className="flex min-h-[42px] min-w-0 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-black uppercase tracking-[0.14em] text-neon-green backdrop-blur-sm transition active:scale-[0.98]"
        >
          Join
        </Link>
        <Link
          href="/apply"
          className="flex min-h-[42px] min-w-0 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.12em] text-highlight/95 transition active:scale-[0.98]"
        >
          Apply
        </Link>
      </div>
    </nav>
  );
}
