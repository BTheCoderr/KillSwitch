import type { Player } from "@/lib/types";

export function describeMatchOutcome(players: Player[]) {
  if (players.length === 0) {
    return { label: "FINAL", detail: "No scores recorded" };
  }

  const highest = Math.max(...players.map((player) => Number(player.score) || 0));
  const leaders = players.filter((player) => (Number(player.score) || 0) === highest);

  if (leaders.length === 1) {
    return {
      label: "FINAL",
      detail: `${leaders[0].name} wins · ${highest} pts`,
    };
  }

  return {
    label: "FINAL · TIE",
    detail: `${leaders.map((player) => player.name).join(" / ")} · ${highest} pts`,
  };
}
