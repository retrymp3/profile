"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SpringButton } from "@/components/spring-button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const LINES = [
  "$ whoami",
  "achuth_vp — application security",
  "$ cat clearance.txt",
  "SDLC · threat modeling · secure code review",
  "$ ls ./focus/",
  "automation/  api-security/  supply-chain/",
  "$ echo $STATUS",
  "Available for advisory engagements",
];

export function TerminalHero({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState<string[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplayed(LINES);
      return;
    }

    const currentLine = LINES[lineIndex];
    if (!currentLine) return;

    if (charIndex < currentLine.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 28);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setDisplayed((d) => [...d, currentLine]);
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, 400);

    return () => clearTimeout(t);
  }, [lineIndex, charIndex, reduced]);

  const partial =
    lineIndex < LINES.length
      ? LINES[lineIndex]?.slice(0, charIndex) ?? ""
      : "";

  return (
    <section className="advisory-grid relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_8%,transparent)] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--accent)]">
          Advisory Brief · Classified Open Source
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--text)] md:text-4xl">
          {name}
        </h1>
        <p className="mt-1 text-lg text-[var(--text-muted)]">{title}</p>

        <div
          className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 font-[family-name:var(--font-mono)] text-sm leading-relaxed"
          aria-label="Terminal introduction"
        >
          {displayed.map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith("$")
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] pl-2"
              }
            >
              {line}
            </div>
          ))}
          {partial && (
            <div className="text-[var(--accent)]">
              {partial}
              <span className="animate-pulse">▌</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/experience">
            <SpringButton>View case files</SpringButton>
          </Link>
          <Link href="/about">
            <SpringButton variant="outline">Full dossier</SpringButton>
          </Link>
        </div>

        <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">
          Press <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5">⌘K</kbd> for
          command palette
        </p>
      </motion.div>
    </section>
  );
}
