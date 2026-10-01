"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { sponsorPackages, sponsorPageCopy } from "@/lib/data";

export default function SponsorPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Request could not be saved.");
      }

      form.reset();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request could not be saved.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/45">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <p className="text-xs font-semibold tracking-[0.28em] text-volt-purple uppercase">
            Sponsors
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-3xl font-bold leading-tight text-white md:text-5xl">
            {sponsorPageCopy.headline}
          </h1>
          <p className="mt-5 max-w-3xl font-body text-sm leading-relaxed text-highlight-dim md:text-[15px] md:leading-relaxed">
            {sponsorPageCopy.body}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14">
        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {sponsorPackages.map((pkg, i) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="ks-panel flex h-full flex-col rounded-2xl p-7"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-highlight-dim/55">
                {pkg.name}
              </p>
              <p className="mt-5 text-3xl font-black text-neon-green md:text-[2.125rem]">{pkg.price}</p>
              <ul className="mt-5 flex-1 space-y-3 border-t border-white/8 pt-5 font-body text-sm leading-relaxed text-highlight-dim">
                {pkg.bullets.map((b) => (
                  <li key={b}>— {b}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="ks-panel mx-auto mt-14 max-w-3xl rounded-2xl p-7 md:p-10"
        >
          <h2 className="font-heading text-xl font-bold text-white md:text-2xl">Request sponsor deck</h2>
          <p className="mt-3 text-sm leading-relaxed text-highlight-dim">
            Tell us where to send the sponsor deck and event details. Your request is saved only after the server confirms it.
          </p>

          {sent ? (
            <div className="mt-10 rounded-xl border border-volt-purple/35 bg-volt-purple/10 p-6 text-center text-violet-100 md:p-8">
              <CheckCircle2 className="mx-auto size-11 text-neon-green" />
              <p className="mt-4 font-heading text-lg font-bold text-white">Request received.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-highlight-dim">
                Your sponsor request was saved successfully. The team can follow up with the current Season Zero deck and event details.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm font-semibold hover:border-neon-green/35"
                >
                  Send another
                </button>
                <Link
                  href="/arena"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-bold text-blackout hover:brightness-110"
                >
                  Stream-ready arena →
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-9 space-y-6" onSubmit={onSubmit}>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    className="mt-2 w-full min-h-[44px] rounded-lg border border-white/11 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-neon-green/45 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
                    Work email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full min-h-[44px] rounded-lg border border-white/11 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-neon-green/45 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-highlight-dim/65 uppercase">
                  Company
                </label>
                <input
                  name="company"
                  required
                  className="mt-2 w-full min-h-[44px] rounded-lg border border-white/11 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-neon-green/45 focus:ring-2"
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="min-h-[44px] rounded-lg bg-volt-purple px-8 py-3.5 text-sm font-black text-white shadow-[0_0_36px_rgb(138_43_226_/_0.28)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Saving…" : "Request Sponsor Deck"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
