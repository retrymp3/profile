"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function MagneticLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
    </motion.a>
  );
}
