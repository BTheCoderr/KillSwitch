"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { SeasonZeroBadge } from "@/components/SeasonZeroBadge";
import { conversionCopy } from "@/lib/conversionCopy";

export default function ApplyPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST application payload to `/api/apply` → Supabase `applications` insert, Resend notify, or CRM.
    setSent(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/45">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <SeasonZeroBadge />
            <span className="rounded-full border border-neon-green/35 bg-neon-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neon-green">
              Beta Access
            </span>
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-neon-green uppercase">
            Competitors · Launch bracket
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold text-white md:text-5xl md:leading-tight">
            Apply to compete
          </h1>
          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px]">
            Season Zero is locking early brackets—applications help us prioritize matchups, rehearsals, and
            embed logistics for your lane.
          </p>
          <p className="mt-4 max-w-2xl font-body text-sm font-medium leading-relaxed text-highlight md:text-[15px]">
            {conversionCopy.foundingCompetitors}
          </p>
          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-electric-blue/90 md:text-xs">
            {conversionCopy.launchBracketApplicationsOpen}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-14 pt-10 md:px-8 md:pb-16 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="ks-panel rounded-2xl p-6 md:p-9"
        >
          {!sent ? (
            <div className="rounded-lg border border-neon-green/35 bg-neon-green/12 px-4 py-3.5 text-sm leading-relaxed text-highlight">
              {/* TODO: Backend validation + persistence — anon insert to Supabase once RLS aligns with intake. */}
              <strong className="font-semibold text-neon-green">Early access intake:</strong> submit your
              details below—we&apos;ll follow up via email once review opens for the first bracket. Client-side
              confirmation only for now (no outbound send yet).
            </div>
          ) : null}

          {sent ? (
            <div className="rounded-xl border border-neon-green/35 bg-black/35 p-6 text-neon-green md:p-8">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="size-11 text-neon-green" />
                <p className="mt-5 font-heading text-lg font-bold text-white">Application received</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-highlight-dim">
                  You&apos;re in the Season Zero queue—expect calendar + tech-check details as we staff the
                  first launch bracket.
                </p>
                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/arena"
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-bold text-blackout shadow-[0_0_34px_rgb(57_255_20_/_0.35)] hover:brightness-110"
                  >
                    Enter the Arena
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/#early-access"
                    className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm font-semibold text-white hover:border-neon-green/35"
                  >
                    Join Early Access
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm font-semibold text-white hover:border-neon-green/35"
                  >
                    Submit another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-9 space-y-6" onSubmit={onSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Name" name="name" placeholder="Jordan Vale" required />
                <Field label="Email" name="email" type="email" placeholder="you@build.dev" required />
              </div>
              <Field label="GitHub or portfolio" name="portfolio" placeholder="https://github.com/you" />
              <div className="grid gap-6 md:grid-cols-2">
                <SelectField
                  label="Preferred language"
                  name="language"
                  options={["TypeScript", "JavaScript", "Python", "Go", "Rust", "Other"]}
                />
                <SelectField
                  label="Experience level"
                  name="experience"
                  options={["Student", "Early career", "Mid-level", "Senior+"]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
                  Why compete?
                </label>
                <textarea
                  name="why"
                  required
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-white/11 bg-black/45 px-3 py-3 text-sm text-white outline-none ring-neon-green/25 placeholder:text-highlight-dim/40 focus:border-neon-green/45 focus:ring-2"
                  placeholder="Drop the adrenaline profile—favorite formats, chaotic strengths, hype moments."
                />
              </div>
              <fieldset>
                <legend className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
                  Live-ready?
                </legend>
                <div className="mt-4 flex flex-col gap-4 font-body text-sm text-highlight-dim sm:flex-row sm:flex-wrap">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="live" value="yes" required className="accent-neon-green" />
                    Camera + mic now
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="live" value="voice" className="accent-neon-green" />
                    Voice only
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="live" value="no" className="accent-neon-green" />
                    Not quite yet
                  </label>
                </div>
              </fieldset>
              <button
                type="submit"
                className="w-full rounded-lg bg-neon-green py-3.5 text-sm font-black text-blackout shadow-[0_0_32px_rgb(57_255_20_/_0.26)] hover:brightness-110 md:w-auto md:min-w-[200px] md:px-10"
              >
                Submit Application
              </button>
            </form>
          )}
        </motion.div>

        {!sent ? (
          <p className="mt-10 text-center text-[13px] leading-relaxed text-highlight-dim/55">
            Want the spectator lane first —{" "}
            <Link href="/arena" className="font-semibold text-neon-green hover:underline">
              Enter the Arena
            </Link>{" "}
            or grab{" "}
            <Link href="/#early-access" className="font-semibold text-electric-blue hover:underline">
              early access invites
            </Link>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full min-h-[44px] rounded-lg border border-white/11 bg-black/45 px-3 py-2.5 text-sm text-white outline-none ring-neon-green/25 placeholder:text-highlight-dim/40 focus:border-neon-green/45 focus:ring-2"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required
        className="mt-2 w-full min-h-[44px] rounded-lg border border-white/11 bg-black/45 px-3 py-2.5 text-sm text-white outline-none ring-neon-green/25 focus:border-neon-green/45 focus:ring-2"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
