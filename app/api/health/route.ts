import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    producerUser: Boolean(process.env.KILLSWITCH_ADMIN_USER),
    producerPassword: Boolean(process.env.KILLSWITCH_ADMIN_PASSWORD),
  };

  let database = false;
  let databaseMessage = "not checked";

  if (env.supabaseUrl && env.supabaseAnonKey) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from("matches").select("id").limit(1);
      database = !error;
      databaseMessage = error ? error.message : "reachable";
    } catch (error) {
      databaseMessage = error instanceof Error ? error.message : "unreachable";
    }
  } else {
    databaseMessage = "missing public Supabase environment";
  }

  const producerConfigured =
    env.serviceRole && env.producerUser && env.producerPassword;

  const ready = database && producerConfigured;

  return NextResponse.json(
    {
      status: ready ? "ready" : "partial",
      checks: {
        database,
        producerConfigured,
        publicSupabaseConfigured: env.supabaseUrl && env.supabaseAnonKey,
      },
      databaseMessage,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
