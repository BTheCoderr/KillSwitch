"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

type ModifierAlertProps = {
  modifierType: string | null;
  active: boolean;
};

export function ModifierAlert({ modifierType, active }: ModifierAlertProps) {
  const visible = active && modifierType && modifierType !== "none";
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.6 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.6 }}
          transition={{ duration: 0.3 }}
          className="glitch-alert flex items-center justify-center gap-3 rounded-xl border border-neon-green/50 bg-gradient-to-r from-volt-purple/25 via-neon-green/15 to-electric-blue/20 px-6 py-4 text-center shadow-[0_0_60px_rgb(57_255_20_/_0.2)]"
        >
          <Zap className="size-6 fill-neon-green text-neon-green" />
          <span className="font-heading text-lg font-black tracking-wider text-white uppercase md:text-xl">
            CHAT VOTED: {modifierType?.replace(/-/g, " ")}
          </span>
          <Zap className="size-6 fill-neon-green text-neon-green" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
