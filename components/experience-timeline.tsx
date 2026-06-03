"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown } from "lucide-react";
import { useClearanceContext } from "@/components/providers";
import type { Experience } from "@/lib/profile";
import { formatPeriod } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <div className="relative space-y-0">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border)]" aria-hidden />
      {experience.map((exp, i) => (
        <CaseFile key={exp.id} exp={exp} index={i} />
      ))}
    </div>
  );
}

function CaseFile({ exp, index }: { exp: Experience; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const { addXP } = useClearanceContext();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) addXP(15);
  };

  return (
    <article className="relative pl-8 pb-8">
      <div
        className={cn(
          "absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-[var(--bg-elevated)]",
          exp.current ? "border-[var(--accent)]" : "border-[var(--border)]"
        )}
      >
        <Briefcase className="h-3 w-3 text-[var(--accent)]" />
      </div>

      <button
        type="button"
        onClick={toggle}
        className="w-full apple-card apple-card-hover p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[var(--accent)]">
              {exp.current ? "Current role" : "Previous role"}
            </span>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">{exp.role}</h2>
            <p className="text-[var(--text-muted)]">
              {exp.company} · {exp.location}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {formatPeriod(exp.start, exp.end)}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 text-[10px] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-2 overflow-hidden border-l-2 border-[var(--accent)] pl-4"
          >
            {exp.highlights.map((h, i) => (
              <li key={i} className="text-sm text-[var(--text-muted)] leading-relaxed">
                {h}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </article>
  );
}
