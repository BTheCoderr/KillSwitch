"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

type CommentaryTickerProps = {
  text: string | null;
};

export function CommentaryTicker({ text }: CommentaryTickerProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-volt-purple/25 bg-black/60 px-4 py-3">
      <div className="flex items-start gap-2">
        <Brain className="mt-0.5 size-4 shrink-0 text-volt-purple" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-volt-purple/80 uppercase">
            AI Explainer <span className="text-highlight-dim/40">BETA</span>
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={text ?? "idle"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="mt-1 font-body text-sm leading-relaxed text-highlight/85"
            >
              {text ?? "Waiting for analyst input..."}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
