import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase";

type Check = {
  label: string;
  ok: boolean;
  detail: string;
};

async function databaseCheck(): Promise<Check> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { label: "Supabase public connection", ok: false, detail: "Missing public Supabase environment." };
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("matches").select("id").limit(1);
    return {
      label: "Supabase public connection",
      ok: !error,
      detail: error ? error.message : "Database reachable.",
    };
  } catch (error) {
    return {
      label: "Supabase public connection",
      ok: false,
      detail: error instanceof Error ? error.message : "Database unreachable.",
    };
  }
}

export default async function ReadinessPage() {
  const checks: Check[] = [
    await databaseCheck(),
    {
      label: "Service-role producer access",
      ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      detail: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "Server-only producer key is configured."
        : "SUPABASE_SERVICE_ROLE_KEY is missing.",
    },
    {
      label: "Producer username",
      ok: Boolean(process.env.KILLSWITCH_ADMIN_USER),
      detail: process.env.KILLSWITCH_ADMIN_USER
        ? "Producer username configured."
        : "KILLSWITCH_ADMIN_USER is missing.",
    },
    {
      label: "Producer password",
      ok: Boolean(process.env.KILLSWITCH_ADMIN_PASSWORD),
      detail: process.env.KILLSWITCH_ADMIN_PASSWORD
        ? "Producer password configured."
        : "KILLSWITCH_ADMIN_PASSWORD is missing.",
    },
    {
      label: "Production site URL",
      ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL),
      detail: process.env.NEXT_PUBLIC_SITE_URL
        ? "Explicit production site URL configured."
        : process.env.VERCEL_URL
          ? "Using Vercel deployment URL."
          : "NEXT_PUBLIC_SITE_URL / VERCEL_URL is missing.",
    },
  ];

  const passed = checks.filter((check) => check.ok).length;
  const ready = passed === checks.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-neon-green">
          Producer launch console
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Season Zero readiness</h1>
        <p className="mt-4 max-w-2xl text-sm text-white/55">
          This page never displays secret values. It only confirms whether the deployment has the
          minimum environment and database connectivity required to operate a live show.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Launch gate</p>
            <p className={`mt-1 text-2xl font-black ${ready ? "text-neon-green" : "text-yellow-300"}`}>
              {ready ? "Environment ready" : `${passed}/${checks.length} checks passing`}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/control" className="rounded bg-neon-green px-4 py-2 text-sm font-black text-black">
              Producer controls
            </Link>
            <Link href="/live" className="rounded border border-white/15 px-4 py-2 text-sm font-bold text-white">
              Live arena
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {checks.map((check) => (
          <div key={check.label} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div
              className={`mt-1 size-3 shrink-0 rounded-full ${
                check.ok ? "bg-neon-green shadow-[0_0_16px_#39FF14]" : "bg-yellow-300"
              }`}
            />
            <div>
              <h2 className="font-bold">{check.label}</h2>
              <p className="mt-1 text-sm text-white/45">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/55">
        <p className="font-bold text-white">Before a public episode</p>
        <p className="mt-2">
          Apply the reviewed Supabase hardening and timer migrations, verify Realtime from two
          browsers, seed a rehearsal match, and complete the full dress rehearsal in
          <code className="mx-1 text-neon-green">docs/SEASON_ZERO_RUNBOOK.md</code>.
        </p>
      </div>
    </div>
  );
}
