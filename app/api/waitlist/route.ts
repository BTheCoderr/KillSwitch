import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_SOURCES = new Set(["hero", "footer", "replays", "tournaments", "newsletter-home"]);

type Body = {
  firstName?: string;
  first_name?: string;
  email?: string;
  source?: string;
  interest_type?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    console.warn("[waitlist] Invalid JSON body");
    return NextResponse.json(
      { ok: false as const, error: "Invalid JSON body", code: "validation" },
      { status: 400 },
    );
  }

  const rawFirst =
    typeof body.firstName === "string"
      ? body.firstName
      : typeof body.first_name === "string"
        ? body.first_name
        : "";
  const firstName = rawFirst.trim();
  const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
  const email = emailRaw.toLowerCase();

  if (!firstName || firstName.length > 200) {
    console.warn("[waitlist] Validation failed: first_name");
    return NextResponse.json(
      { ok: false as const, error: "Please enter a valid first name (1–200 characters).", code: "validation" },
      { status: 400 },
    );
  }

  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    console.warn("[waitlist] Validation failed: email");
    return NextResponse.json(
      { ok: false as const, error: "Please enter a valid email address.", code: "validation" },
      { status: 400 },
    );
  }

  const sourceRaw = typeof body.source === "string" ? body.source.trim().slice(0, 80) : "";
  const source = ALLOWED_SOURCES.has(sourceRaw) ? sourceRaw : "unknown";

  const interestRaw =
    typeof body.interest_type === "string" ? body.interest_type.trim().slice(0, 80) : "";
  const interest_type = interestRaw || "launch_waitlist";

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (e) {
    console.error("[waitlist] Supabase admin not configured:", e);
    return NextResponse.json(
      { ok: false as const, error: "Waitlist is temporarily unavailable.", code: "server" },
      { status: 503 },
    );
  }

  // TODO · Resend — send welcome / double opt-in on successful insert (template + suppression list).
  // TODO · Discord — webhook or bot onboarding after verified signup.
  // TODO · referral — optional `referral_code` column + attribution on insert.
  // TODO · sponsor segmentation — derive `interest_type` or sibling table from funnel page (future).
  // TODO · tournament invites — sync to bracket applicant lists or dedicated `tournament_intent` joins.

  const { data: row, error } = await admin
    .from("waitlist_subscribers")
    .insert({
      first_name: firstName,
      email,
      source,
      interest_type,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    const isDup = error.code === "23505" || /duplicate|unique/i.test(error.message ?? "");
    if (isDup) {
      console.warn("[waitlist] Duplicate email:", email);
      return NextResponse.json(
        {
          ok: false as const,
          error: "You're already on the list — we'll ping you before the launch bracket fires.",
          code: "duplicate" as const,
        },
        { status: 409 },
      );
    }
    console.error("[waitlist] Insert failed:", error.code, error.message);
    return NextResponse.json(
      { ok: false as const, error: "Something went wrong. Try again shortly.", code: "server" },
      { status: 500 },
    );
  }

  console.log("[waitlist] signup success:", { email, source, interest_type, id: row?.id });

  return NextResponse.json(
    {
      ok: true as const,
      id: row?.id ?? null,
      message: "Subscribed.",
    },
    { status: 201 },
  );
}
