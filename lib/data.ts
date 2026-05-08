export type NavItem = { href: string; label: string };

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/arena", label: "Arena" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/apply", label: "Apply" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/replays", label: "Replays" },
  { href: "/control", label: "Control" },
  { href: "/grid", label: "Grid" },
  { href: "/live", label: "Live" },
];

export type VoteOption = { id: string; label: string; short: string };

export const audienceVoteOptions: VoteOption[] = [
  { id: "reverse-iteration", label: "Reverse Iteration", short: "Reverse" },
  { id: "time-crunch", label: "Time Crunch", short: "Crunch" },
  { id: "memory-limit", label: "Memory Limit", short: "Mem Limit" },
  { id: "no-backspace", label: "No Backspace", short: "No BS" },
];

export const liveMatch = {
  contestantA: "LUNA",
  contestantB: "REX",
  round: 3,
  timer: "04:37",
  bestOf: 5,
  viewers: 12_842,
  prizePool: "$1,000",
  problem: "Minimum Operations to Sort",
  difficulty: "Medium" as const,
  sponsorLine: "KILLSWITCH",
  analystSnippet:
    "Luna uses selection sort O(n^2). Rex uses index mapping to minimize swaps. Rex's approach is more optimal on large inputs.",
  languageA: "Python",
  languageB: "Python",
};

export type TournamentStatus = "Applications Open" | "Coming Soon";

export type Tournament = {
  id: string;
  title: string;
  description: string;
  contestants?: number;
  prize: string;
  status: TournamentStatus;
};

export const tournaments: Tournament[] = [
  {
    id: "launch-001",
    title: "Launch Bracket 001",
    description: "Beginner-friendly battle royale",
    contestants: 4,
    prize: "$250",
    status: "Applications Open",
  },
  {
    id: "frontend-frenzy",
    title: "Frontend Frenzy",
    description: "React speed-build under pressure",
    prize: "$500",
    status: "Coming Soon",
  },
  {
    id: "algorithm-arena",
    title: "Algorithm Arena",
    description: "Data structures and pure algorithmic skill",
    prize: "$1,000",
    status: "Coming Soon",
  },
];

export type ReplayCard = { id: string; title: string; subtitle: string };

export const replays: ReplayCard[] = [
  { id: "r1", title: "Launch Bracket 001", subtitle: "Coming Soon" },
  { id: "r2", title: "Best Compile Moments", subtitle: "Coming Soon" },
  {
    id: "r3",
    title: "AI Breakdown: Winning Solutions",
    subtitle: "Coming Soon",
  },
];

export type SponsorPackage = {
  id: string;
  name: string;
  price: string;
  bullets: string[];
};

export const sponsorPackages: SponsorPackage[] = [
  {
    id: "launch",
    name: "Launch Sponsor",
    price: "$500",
    bullets: [
      "Your logo on one event stream, overlay, and replay page.",
    ],
  },
  {
    id: "event",
    name: "Event Sponsor",
    price: "$1,500",
    bullets: [
      "Presented-by placement, shoutouts, logo in arena, and recap post.",
    ],
  },
  {
    id: "tournament",
    name: "Tournament Sponsor",
    price: "$5,000",
    bullets: [
      "Category exclusivity, branded challenge, replay integration, and audience report.",
    ],
  },
];

export const sponsorPageCopy = {
  headline: "Reach developers while they are actually paying attention.",
  body: "KILLSWITCH turns developer attention into a live competitive event: real-time coding, audience modifiers, AI commentary, and replayable moments built for technical audiences.",
};

export const howItWorks = [
  {
    title: "Enter the arena",
    body: "Developers face off live with real stakes, a visible clock, and problems tuned for broadcast clarity.",
  },
  {
    title: "Crowd controls chaos",
    body: "Chat commands reshape the match — time crunch, memory limits, and reversed iteration on demand.",
  },
  {
    title: "AI explains the fight",
    body: "An on-screen analyst breaks down tactics and complexity so viewers never lose the thread.",
  },
];

export const audiencePowers = [
  {
    title: "Reverse Iteration",
    body: "Force contestants to flip their loop logic under pressure.",
    optionId: "reverse-iteration",
  },
  {
    title: "Time Crunch",
    body: "Slash the clock — survivors separate from pretenders.",
    optionId: "time-crunch",
  },
  {
    title: "Memory Limit",
    body: "Cap allocations and expose who writes lean code.",
    optionId: "memory-limit",
  },
  {
    title: "No Backspace",
    body: "Type once, type right. Every keystroke is permanent.",
    optionId: "no-backspace",
  },
] as const;

export const codeSamples: Record<string, string> = {
  LUNA: `class Solution:
    def minOperations(self, nums: List[int]) -> int:
        n = len(nums)
        ans = 0
        for i in range(n):
            min_idx = i
            for j in range(i + 1, n):
                if nums[j] < nums[min_idx]:
                    min_idx = j
            nums[i], nums[min_idx] = nums[min_idx], nums[i]
            ans += min_idx - i
        return ans`,
  REX: `class Solution:
    def minOperations(self, nums: List[int]) -> int:
        sorted_nums = sorted(nums)
        pos = {v: i for i, v in enumerate(nums)}
        ans = 0
        for i in range(len(nums)):
            if nums[i] != sorted_nums[i]:
                j = pos[sorted_nums[i]]
                nums[i], nums[j] = nums[j], nums[i]
                pos[nums[j]] = j
                pos[nums[i]] = i
                ans += 1
        return ans`,
};
