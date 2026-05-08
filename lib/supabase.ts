import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function isValidUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const safePlaceholder = "https://placeholder.supabase.co";

export function getSupabase() {
  return createBrowserClient(
    isValidUrl(url) ? url : safePlaceholder,
    key || "placeholder-key",
  );
}

export function getSupabaseServer() {
  return createClient(
    isValidUrl(url) ? url : safePlaceholder,
    key || "placeholder-key",
  );
}

/**
 * Supabase admin client — **SERVER-ONLY.** Uses `SUPABASE_SERVICE_ROLE_KEY`; never import from client bundles.
 *
 * Use in Route Handlers / Server Actions for privileged writes (e.g. waitlist inserts).
 */
export function getSupabaseAdmin() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!isValidUrl(url) || !serviceRole) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

