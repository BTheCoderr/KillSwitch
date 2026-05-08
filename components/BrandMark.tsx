import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 text-highlight transition-colors hover:text-white",
        className,
      )}
    >
      <span className="relative flex size-9 items-center justify-center rounded-md border border-neon-green/40 bg-slate-dark/90 shadow-[0_0_20px_rgb(57_255_20_/_0.25)] neon-glow">
        <Zap
          className="size-5 fill-neon-green text-neon-green"
          strokeWidth={2}
          aria-hidden
        />
      </span>
      {!compact && (
        <span className="font-heading text-xl font-bold tracking-wider text-white uppercase">
          KILL<span className="text-neon-green">SWITCH</span>
        </span>
      )}
    </Link>
  );
}
