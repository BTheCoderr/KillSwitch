import { cn } from "@/lib/utils";

type SeasonZeroBadgeProps = {
  className?: string;
};

/** Global Season Zero strapline — paired with navbar, hero, and footer funnel. */
export function SeasonZeroBadge({ className }: SeasonZeroBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-neon-green/45 bg-neon-green/[0.12] px-2 py-0.5 font-mono text-[9px] font-black tracking-[0.22em] text-neon-green uppercase shadow-[0_0_20px_rgb(57_255_20_/_0.12)]",
        className,
      )}
      aria-label="Season Zero"
    >
      SEASON ZERO
    </span>
  );
}
