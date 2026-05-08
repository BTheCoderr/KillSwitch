"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

export default function ApplyPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neon-green/10 bg-slate-dark/40">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-neon-green uppercase">
            Competitors
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Apply to compete
          </h1>
          <p className="mt-3 font-body text-sm text-highlight-dim">
            Premium intake form for the arena. Applications are opening soon—this
            flow captures interest only (no backend in the MVP).
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="ks-panel rounded-2xl p-6 md:p-8"
        >
          <div className="rounded-lg border border-neon-green/30 bg-neon-green/10 px-4 py-3 text-sm text-neon-green">
            Applications will open soon. Submitting this form stores nothing on a
            server—it&apos;s a UI validation pass for now.
          </div>

          {sent ? (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-neon-green/30 bg-neon-green/10 p-4 text-neon-green">
              <CheckCircle2 className="size-5 shrink-0" />
              <div>
                <p className="font-semibold">You&apos;re on the early list.</p>
                <p className="mt-1 text-sm text-neon-green/80">
                  Thanks for raising your hand—we&apos;ll follow up when tryouts open.
                </p>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name" name="name" placeholder="Jordan Vale" required />
                <Field label="Email" name="email" type="email" placeholder="you@build.dev" required />
              </div>
              <Field label="GitHub or portfolio" name="portfolio" placeholder="https://github.com/you" />
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField label="Preferred language" name="language" options={["TypeScript", "JavaScript", "Python", "Go", "Rust", "Other"]} />
                <SelectField label="Experience level" name="experience" options={["Student", "Early career", "Mid-level", "Senior+"]} />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">Why do you want to compete?</label>
                <textarea name="why" required rows={4} className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none ring-neon-green/30 placeholder:text-highlight-dim/35 focus:border-neon-green/40 focus:ring-2" placeholder="Tell us what kind of chaos you want on broadcast..." />
              </div>
              <fieldset>
                <legend className="text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">Can you appear live on stream?</legend>
                <div className="mt-3 flex flex-wrap gap-4 font-body text-sm text-highlight-dim">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="live" value="yes" required className="accent-neon-green" /> Yes, camera + mic ready</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="live" value="voice" className="accent-neon-green" /> Voice only</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="live" value="no" className="accent-neon-green" /> Not yet</label>
                </div>
              </fieldset>
              <button type="submit" className="w-full rounded-lg bg-neon-green py-3 text-sm font-bold text-stealth shadow-[0_0_32px_rgb(57_255_20_/_0.25)] md:w-auto md:px-8">
                Submit Application
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">{label}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none ring-neon-green/30 placeholder:text-highlight-dim/35 focus:border-neon-green/40 focus:ring-2" />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold tracking-wide text-highlight-dim/60 uppercase">{label}</label>
      <select id={name} name={name} required className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none ring-neon-green/30 focus:border-neon-green/40 focus:ring-2">
        <option value="">Select…</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}
