"use client";

import { useEffect, useMemo, useState } from "react";
import { getRemainingSeconds } from "@/lib/timer";
import { cn } from "@/lib/utils";

type CountdownTimerProps = {
  seconds: number;
  startedAt?: string | null;
  running?: boolean;
  className?: string;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CountdownTimer({
  seconds,
  startedAt = null,
  running = false,
  className,
}: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  const [localStartedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  const remaining = useMemo(() => {
    if (startedAt) {
      return getRemainingSeconds(seconds, startedAt, running, now);
    }
    if (running) {
      const elapsed = Math.max(0, Math.floor((now - localStartedAt) / 1000));
      return Math.max(0, seconds - elapsed);
    }
    return Math.max(0, seconds);
  }, [seconds, startedAt, running, now, localStartedAt]);

  const urgent = remaining <= 30;

  return (
    <div
      className={cn(
        "font-mono text-3xl font-black tabular-nums tracking-wider md:text-5xl",
        urgent ? "animate-pulse text-red-400" : "text-neon-green",
        className,
      )}
    >
      {formatTime(remaining)}
    </div>
  );
}
