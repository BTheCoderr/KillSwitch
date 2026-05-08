"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { sponsorPackages, sponsorPageCopy } from "@/lib/data";

export default function SponsorPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/40">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-volt-purple uppercase">
            Sponsors
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-bold text-white md:text-4xl">
            {sponsorPageCopy.headline}
          </h1>
          <p className="mt-4 max-w-3xl font-body text-sm leading-relaxed text-highlight-dim">
            {sponsorPageCopy.body}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {sponsorPackages.map((pkg, i) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="ks-panel flex flex-col rounded-2xl p-6"
            >
              <p className="text-xs font-semibold tracking-wide text-highlight-dim/55 uppercase">{pkg.name}</p>
              <p className="mt-3 text-3xl font-bold text-neon-green">{pkg.price}</p>
              <ul className="mt-4 flex-1 space-y-2 font-body text-sm text-highlight-dim">
                {pkg.bullets.map((b) => (<li key={b}>— {b}</li>))}
              </ul>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="ks-panel mx-auto mt-12 max-w-3xl rounded-2xl p-6 md:p-8"
        >
          <h2 className="font-heading text-xl font-bold text-white">Request sponsor deck</h2>
          <p className="mt-2 font-body text-sm text-highlight-dim/65">
            Tell us who should receive the deck—still static in this MVP.
          </p>

          {sent ? (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-neon-green/30 bg-neon-green/10 p-4 text-neon-green">
              <CheckCircle2 className="size-5 shrink-0" />
              <div>
                <p className="font-semibold">Deck request logged.</p>
                <p className="mt-1 text-sm text-neon-green/80">Thanks for the signal.</p>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">Name</label>
                  <input name="name" required className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-neon-green/40 focus:ring-2 focus:ring-neon-green/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">Work email</label>
                  <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-neon-green/40 focus:ring-2 focus:ring-neon-green/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">Company</label>
                <input name="company" required className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-neon-green/40 focus:ring-2 focus:ring-neon-green/30" />
              </div>
              <button type="submit" className="rounded-lg bg-neon-green px-8 py-3 text-sm font-bold text-stealth">
                Request Sponsor Deck
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
