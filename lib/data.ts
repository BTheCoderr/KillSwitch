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
  headline: "Develop a livestream-ready MVP with live coding battle rooms.",
  scopeNote:
    "Contestants work in embeddable surfaces (Replit, StackBlitz, etc.); this release is the broadcast cockpit—dual code panels, audience votes, and AI narration—wired for stream—not a sandbox execution core.",
  pillars: [
    "Live coding battle rooms",
    "Real-time contestant code panels",
    "Audience voting during matches",
    "AI match explanation",
    "Tournament and replay flow",
  ],
} as const;

export type VoteOption = { id: string; label: string; short: string };

export const audienceVoteOptions: VoteOption[] = [
  { id: "add-time-pressure", label: "Add Time Pressure", short: "Time" },
  { id: "reveal-hidden-test", label: "Reveal Hidden Test", short: "Test" },
  { id: "force-explanation", label: "Force Explanation", short: "Explain" },
  { id: "no-built-ins", label: "No Built-ins", short: "No lib" },
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
    prize: "$250",
    status: "Applications Open",
  },
  {
    id: "frontend-frenzy",
    title: "Frontend Frenzy",
    description: "React speed-build melee for UI engineers wired for chaos.",
    prize: "$500",
    status: "Early Access",
  },
  {
    id: "algorithm-arena",
    title: "Algorithm Arena",
    description: "DS&A gauntlet for operators who breathe Big-O aloud.",
    prize: "$1,000",
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
    title: "Lights on. Clock’s live.",
    body: "Battle rooms are built for OBS: dual feeds, ruthless clocks, and layouts that survive 1080p blow-ups.",
  },
  {
    title: "Votes detonate twists",
    body: "The crowd jams new constraints mid-round—nothing theoretical, everything visceral.",
  },
  {
    title: "AI keeps everyone sharp",
    body: "Match explanation stitches tactics for chat and co-streams—framed alongside tournament rails and replay drops so the season reads as one arc.",
  },
];

export const audiencePowers = [
  {
    title: "Bleed the clock",
    body: "Crush their breathing room until fundamentals surface.",
    optionId: "add-time-pressure",
  },
  {
    title: "Drop the veil",
    body: "Surface a stealth test—the arena watches the pivot live.",
    optionId: "reveal-hidden-test",
  },
  {
    title: "Force narration",
    body: "No silent refactoring—explain the gambit before the next compile.",
    optionId: "force-explanation",
  },
  {
    title: "Kill the cheats",
    body: "Strip cuddly builtins; raw logic earns the handshake.",
    optionId: "no-built-ins",
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
