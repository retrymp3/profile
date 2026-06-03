"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useClearanceContext } from "@/components/providers";
import { cn } from "@/lib/utils";

export function ClearanceChip() {
  const { xp, level, progress, hydrated, trackPageVisit } = useClearanceContext();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && pathname) trackPageVisit(pathname);
  }, [pathname, hydrated, trackPageVisit]);

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 right-5 z-30 hidden rounded-full apple-card px-4 py-2.5 shadow-lg sm:block"
      title="Explore the site to progress"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-[88px]">
          <p className="text-[10px] text-[var(--text-subtle)]">Explorer</p>
          <p className="text-xs font-medium text-[var(--text)]">{level}</p>
        </div>
        <div className="h-8 w-px bg-[var(--border)]" />
        <div className="w-16">
          <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
            <div
              className={cn("h-full rounded-full bg-[var(--accent)] transition-all duration-500")}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
