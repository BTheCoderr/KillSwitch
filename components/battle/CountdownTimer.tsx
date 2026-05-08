"use client";

import { cn } from "@/lib/utils";

type CountdownTimerProps = {
  seconds: number;
  className?: string;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CountdownTimer({ seconds, className }: CountdownTimerProps) {
  const urgent = seconds <= 30;

  return (
    <div
      className={cn(
        "font-mono text-3xl font-black tabular-nums tracking-wider md:text-5xl",
        urgent ? "animate-pulse text-red-400" : "text-neon-green",
        className,
      )}
    >
      {formatTime(seconds)}
    </div>
  );
}
