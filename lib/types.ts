export type Match = {
  id: string;
  status: "lobby" | "active" | "finished";
  round: number;
  best_of: number;
  timer: number;
  active_modifier: string;
  problem_title: string | null;
  problem_difficulty: string | null;
  created_at: string;
};

export type Player = {
  id: string;
  match_id: string;
  slot: number;
  name: string;
  replit_url: string | null;
  language: string | null;
  score: number;
};

export type Vote = {
  id: string;
  match_id: string;
  command: string;
  created_at: string;
};

export const MODIFIER_OPTIONS = [
  { id: "reverse-iteration", label: "Reverse Iteration", icon: "RotateCcw" },
  { id: "time-crunch", label: "Time Crunch", icon: "Timer" },
  { id: "memory-limit", label: "Memory Limit", icon: "HardDrive" },
  { id: "bright-pink", label: "Bright Pink Theme", icon: "Palette" },
  { id: "no-backspace", label: "No Backspace", icon: "Delete" },
  { id: "darkmode", label: "Dark Mode", icon: "Moon" },
] as const;
