"use client";

import { motion } from "framer-motion";

export function AudiencePulseBar() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] font-semibold tracking-wide text-highlight-dim/55 uppercase">
        <span>Audience pulse</span>
        <span className="font-mono text-neon-green">72%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/55 ring-1 ring-inset ring-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon-green via-electric-blue to-volt-purple"
          initial={{ width: "18%" }}
          animate={{ width: ["28%", "72%", "46%", "72%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
