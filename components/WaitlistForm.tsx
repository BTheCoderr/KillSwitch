"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { conversionCopy } from "@/lib/conversionCopy";
import { cn } from "@/lib/utils";

export type WaitlistFormProps = {
  /** Placement funnel label — must match server allowlist when possible. */
  source?: string;
  className?: string;
  variant?: "default" | "compact";
  id?: string;
};

type ApiOk = { ok: true; id: string | null; message: string };
type ApiErr = { ok: false; error: string; code?: string };

/**
 * Posts to `/api/waitlist` (service-role insert on the server). Same card appears on hero, footer, replays,
 * tournaments, and newsletter blocks.
 */
export function WaitlistForm({
  source = "site",
  className,
  variant = "default",
  id,
}: WaitlistFormProps) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    setDuplicateMessage(null);
    setErrorMessage(null);

    if (!firstName || !email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          source,
          interest_type: "launch_waitlist",
        }),
      });

      const json = (await res.json()) as ApiOk | ApiErr;

      if (res.ok && "ok" in json && json.ok) {
        console.log("[waitlist] client signup success", { source, email });
        setSuccess(true);
        form.reset();
        return;
      }

      const err = json as ApiErr;
      if (err.code === "duplicate") {
        console.warn("[waitlist] client duplicate:", email);
        setDuplicateMessage(err.error ?? "You're already on the list.");
        return;
      }

      console.error("[waitlist] client signup failed", res.status, err);
      setErrorMessage(err.error ?? "Couldn't save your signup. Try again.");
    } catch (caught) {
      console.error("[waitlist] client network error:", caught);
      setErrorMessage("Network error. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  const compact = variant === "compact";

  const shell = cn(
    "relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.07] via-slate-dark/60 to-black/85 p-[1px] shadow-[0_28px_80px_-34px_rgb(0_0_0_/_0.85),inset_0_1px_0_0_rgb(255_255_255_/_0.06)] backdrop-blur-xl",
  );

  const inner = cn(
    "relative rounded-[calc(1rem-1px)] bg-black/58 px-5 py-6 ring-1 ring-inset ring-white/[0.04]",
    compact ? "md:px-5 md:py-5" : "md:px-7 md:py-7",
  );

  if (success) {
    return (
      <div id={id} className={cn("w-full max-w-lg", className)}>
        <div className={shell}>
          <div
            aria-live="polite"
            className={cn(
              inner,
              "border border-neon-green/25 bg-gradient-to-br from-neon-green/12 via-black/65 to-black/85",
            )}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-neon-green/15 blur-3xl" />
            <p className="relative font-body text-sm font-semibold leading-relaxed text-neon-green">
              {conversionCopy.waitlistSuccess}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={cn("w-full max-w-lg", className)}>
      <div className={shell}>
        <div className={inner}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.22] scanlines" aria-hidden />
          <div className="pointer-events-none absolute -left-24 top-0 size-52 rounded-full bg-neon-green/8 blur-[64px]" />
          <div className="relative">
            <p
              className={cn(
                "font-body font-medium leading-snug text-highlight/90 text-balance",
                compact ? "text-xs md:text-[13px]" : "text-sm md:text-[15px]",
              )}
            >
              {conversionCopy.waitlistSupportingCopy}
            </p>

            <form
              className={cn("mt-5 space-y-4", compact && "mt-4 space-y-3")}
              onSubmit={onSubmit}
              data-waitlist-source={source}
            >
              {duplicateMessage ? (
                <p
                  role="status"
                  className="rounded-xl border border-electric-blue/35 bg-electric-blue/10 px-3 py-2.5 font-body text-xs font-medium leading-snug text-electric-blue md:text-[13px]"
                >
                  {duplicateMessage}
                </p>
              ) : null}

              {errorMessage ? (
                <p
                  role="alert"
                  className="rounded-xl border border-danger-red/40 bg-danger-red/10 px-3 py-2.5 font-body text-xs font-medium leading-snug text-danger-red md:text-[13px]"
                >
                  {errorMessage}
                </p>
              ) : null}

              <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "gap-5 sm:grid-cols-2")}>
                <div>
                  <label
                    htmlFor={`waitlist-first-${source}`}
                    className="block text-[10px] font-bold uppercase tracking-[0.18em] text-highlight-dim/75"
                  >
                    First name
                  </label>
                  <input
                    id={`waitlist-first-${source}`}
                    name="firstName"
                    type="text"
                    required
                    disabled={loading}
                    autoComplete="given-name"
                    placeholder="Jordan"
                    className="mt-1.5 w-full min-h-[46px] rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white shadow-inner shadow-black/40 outline-none ring-neon-green/15 backdrop-blur-sm placeholder:text-highlight-dim/45 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`waitlist-email-${source}`}
                    className="block text-[10px] font-bold uppercase tracking-[0.18em] text-highlight-dim/75"
                  >
                    Email
                  </label>
                  <input
                    id={`waitlist-email-${source}`}
                    name="email"
                    type="email"
                    required
                    disabled={loading}
                    autoComplete="email"
                    placeholder="you@build.dev"
                    className="mt-1.5 w-full min-h-[46px] rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white shadow-inner shadow-black/40 outline-none ring-neon-green/15 backdrop-blur-sm placeholder:text-highlight-dim/45 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-neon-green px-4 py-3 text-sm font-black uppercase tracking-wide text-blackout shadow-[0_0_40px_rgb(57_255_20_/_0.35)] transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Locking in…
                  </>
                ) : (
                  <>
                    Enter the Arena
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
