import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANGUAGES = new Set(["TypeScript", "JavaScript", "Python", "Go", "Rust", "Other"]);
const EXPERIENCE = new Set(["Student", "Early career", "Mid-level", "Senior+"]);
const LIVE = new Set(["yes", "voice", "no"]);

type Body = {
  name?: string;
  email?: string;
  portfolio?: string;
  language?: string;
  experience?: string;
  why?: string;
  live?: string;
  website?: string;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot for simple bot traffic.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true, message: "Application received." }, { status: 201 });
  }

  const fullName = clean(body.name, 160);
  const email = clean(body.email, 320).toLowerCase();
  const portfolio = clean(body.portfolio, 500);
  const language = clean(body.language, 40);
  const experience = clean(body.experience, 40);
  const motivation = clean(body.why, 2500);
  const liveAvailability = clean(body.live, 20);

  if (fullName.length < 2) {
    return NextResponse.json({ ok: false, error: "Enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }
  if (!LANGUAGES.has(language)) {
    return NextResponse.json({ ok: false, error: "Choose a supported language option." }, { status: 400 });
  }
  if (!EXPERIENCE.has(experience)) {
    return NextResponse.json({ ok: false, error: "Choose an experience level." }, { status: 400 });
  }
  if (motivation.length < 10) {
    return NextResponse.json({ ok: false, error: "Tell us a little more about why you want to compete." }, { status: 400 });
  }
  if (!LIVE.has(liveAvailability)) {
    return NextResponse.json({ ok: false, error: "Choose your live-readiness option." }, { status: 400 });
  }

  let portfolioUrl: string | null = null;
  if (portfolio) {
    try {
      const parsed = new URL(portfolio);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad protocol");
      portfolioUrl = parsed.toString();
    } catch {
      return NextResponse.json({ ok: false, error: "Portfolio URL must be a valid web address." }, { status: 400 });
    }
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Applications are temporarily unavailable." },
      { status: 503 },
    );
  }

  const { data, error } = await admin
    .from("applications")
    .insert({
      full_name: fullName,
      email,
      portfolio_url: portfolioUrl,
      preferred_language: language,
      experience_level: experience,
      motivation,
      live_availability: liveAvailability,
      source: "web",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[apply] insert failed", error.code, error.message);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your application. Try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, id: data.id, message: "Application received." },
    { status: 201 },
  );
}
