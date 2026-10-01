import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: string;
  email?: string;
  company?: string;
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

  // Honeypot: acknowledge bots without creating a record.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true, message: "Request received." }, { status: 201 });
  }

  const name = clean(body.name, 160);
  const email = clean(body.email, 320).toLowerCase();
  const company = clean(body.company, 200);

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid work email." }, { status: 400 });
  }
  if (company.length < 2) {
    return NextResponse.json({ ok: false, error: "Enter your company." }, { status: 400 });
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Sponsor requests are temporarily unavailable." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("sponsor_leads").insert({
    contact_name: name,
    company_name: company,
    email,
    source: "web",
  });

  if (error) {
    console.error("[sponsor] insert failed", error.code, error.message);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your request. Try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, message: "Request received." },
    { status: 201 },
  );
}
