import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatPillProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  className?: string;
  tone?: "default" | "green" | "blue" | "purple";
};

const toneStyles = {
  default:
    "border-white/10 bg-slate-dark/80 text-highlight shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]",
  green: "border-neon-green/35 bg-neon-green/10 text-neon-green",
  blue: "border-electric-blue/35 bg-electric-blue/10 text-electric-blue",
  purple: "border-volt-purple/35 bg-volt-purple/10 text-volt-purple",
} as const;

export function StatPill({
  label,
  value,
  icon: Icon,
  className,
  tone = "default",
}: StatPillProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs md:text-sm",
        toneStyles[tone],
        className,
      )}
    >
      {Icon && <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />}
      <span className="text-[10px] font-semibold tracking-wide text-highlight-dim/60 uppercase md:text-xs">
        {label}
      </span>
      <span className="font-mono text-[11px] font-semibold text-white md:text-sm">
        {value}
      </span>
    </div>
  );
}
