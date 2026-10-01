"use client";

import { useSearchParams } from "next/navigation";
import { ReplitGrid } from "@/components/battle/ReplitGrid";
import { useLiveMatch } from "@/lib/useLiveMatch";

export function GridContent() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player");
  const soloSlot = playerParam ? parseInt(playerParam, 10) : null;
  const { match, players, refreshing } = useLiveMatch();

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center font-heading text-lg text-highlight-dim/40">
        {refreshing ? "Connecting to match…" : "Waiting for a match…"}
      </div>
    );
  }

  return (
    <div className="h-screen p-3 md:p-4">
      <ReplitGrid
        players={players}
        soloSlot={soloSlot && soloSlot >= 1 && soloSlot <= 4 ? soloSlot : null}
      />
    </div>
  );
}
