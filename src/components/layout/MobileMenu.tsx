"use client";

import { motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/utils/constants";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onClick={onClose}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="font-display text-4xl font-bold text-white hover:text-[var(--accent-cyan)] transition-colors"
          >
            {link.label}
          </motion.a>
        ))}
        <motion.a
          href="#contact"
          onClick={onClose}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, delay: NAV_LINKS.length * 0.1 }}
          className="mt-4 font-body text-lg px-8 py-3 border border-[var(--accent-cyan)] rounded-full text-[var(--accent-cyan)]"
        >
          Let&apos;s Talk
        </motion.a>
      </div>
    </motion.div>
  );
}
