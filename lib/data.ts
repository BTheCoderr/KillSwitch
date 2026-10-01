export type NavItem = { href: string; label: string };

/** Main marketing nav — Season Zero funnel (marketing shell; integrations ship alongside launch). */
export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/arena", label: "Arena" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/apply", label: "Apply" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/replays", label: "Replays" },
];

/**
 * Live coding = stream-ready arena (OBS panels, votes, AI copy)—not a hosted runner yet.
 */
export const mvpLiveCodingPositioning = {
  headline: "Four builders. One producer-run broadcast. Controlled chaos on stream.",
  scopeNote:
    "Season Zero is a broadcast format, not a hosted coding platform. Contestants use approved third-party editor embeds while the producer controls timing, scoring, modifiers, and the final result.",
  pillars: [
    "Four contestant editor feeds",
    "Synchronized producer-controlled timer",
    "Audience modifier intake through show controls",
    "Deterministic match explanation",
    "OBS-first broadcast layouts",
  ],
} as const;

export type VoteOption = { id: string; label: string; short: string };

export const audienceVoteOptions: VoteOption[] = [
  { id: "reverse-iteration", label: "Reverse Iteration", short: "Reverse" },
  { id: "time-crunch", label: "Time Crunch", short: "Time" },
  { id: "memory-limit", label: "Memory Limit", short: "Memory" },
  { id: "no-backspace", label: "No Backspace", short: "Keys" },
];

export const liveMatch = {
  contestantA: "LUNA",
  contestantB: "REX",
  round: 2,
  timer: "18:42",
  bestOf: 3,
  viewers: 12_458,
  prizePool: "$25,000",
  problem: "Min Operations",
  difficulty: "Medium" as const,
  sponsorBrand: "DEVFORGE",
  analystSnippet:
    "Luna is brute-forcing swaps with selection-style scans. Rex is parking indices—if judges stress massive inputs, Rex’s swaps likely stay leaner.",
  languageA: "Python",
  languageB: "Python",
};

export type TournamentStatus = "Applications Open" | "Early Access";

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
    description: "Beginner-friendly opener—four builders, zero hand-holding edits.",
    contestants: 4,
    prize: "Prize TBD",
    status: "Applications Open",
  },
  {
    id: "frontend-frenzy",
    title: "Frontend Frenzy",
    description: "React speed-build melee for UI engineers wired for chaos.",
    prize: "Prize TBD",
    status: "Early Access",
  },
  {
    id: "algorithm-arena",
    title: "Algorithm Arena",
    description: "DS&A gauntlet for operators who breathe Big-O aloud.",
    prize: "Prize TBD",
    status: "Early Access",
  },
];

export type ReplayCard = { id: string; title: string; subtitle: string };

export const replays: ReplayCard[] = [
  { id: "r1", title: "Launch Bracket 001", subtitle: "Season Zero" },
  { id: "r2", title: "Best Compile Moments", subtitle: "Beta access" },
  {
    id: "r3",
    title: "AI Breakdown: Winning Solutions",
    subtitle: "Season Zero",
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
      "Your logo on one event page, stream overlay, and replay page.",
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
  body: "Killswitch turns developer attention into a live competitive event: real-time coding, audience voting, AI commentary, and replayable moments built for technical audiences.",
};

export const howItWorks = [
  {
    title: "Producer loads four builders",
    body: "Approved third-party editor embeds, names, languages, and the challenge are loaded before the round.",
  },
  {
    title: "The show runs from one control room",
    body: "A synchronized clock, manual scoring, and audience modifiers drive the broadcast state seen by OBS.",
  },
  {
    title: "The result is called on screen",
    body: "The producer finishes the match and the broadcast renders the final score, winner, or tie without a manual refresh.",
  },
];

export const audiencePowers = [
  {
    title: "Reverse the plan",
    body: "The producer calls Reverse Iteration and contestants adapt on the honor system.",
    optionId: "reverse-iteration",
  },
  {
    title: "Compress the clock",
    body: "Time Crunch raises the pressure without changing the underlying editor.",
    optionId: "time-crunch",
  },
  {
    title: "Work inside a limit",
    body: "Memory Limit becomes a show constraint contestants are expected to follow.",
    optionId: "memory-limit",
  },
  {
    title: "Lose the backspace",
    body: "No Backspace is a producer-enforced challenge rule, not an editor lockout.",
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
