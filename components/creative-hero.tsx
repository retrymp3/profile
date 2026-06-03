"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SpringButton } from "@/components/spring-button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Profile } from "@/lib/profile";

const ROTATING = [
  "application security",
  "secure code review",
  "security automation",
  "threat modeling",
];

export function CreativeHero({ profile }: { profile: Profile }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % ROTATING.length);
    }, 4000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section className="pt-4 pb-8 text-center md:pt-8 md:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="section-eyebrow">{profile.title}</p>

        <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text)]">
          {profile.name}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-[clamp(1.125rem,2.5vw,1.375rem)] leading-snug text-[var(--text-muted)]">
          Focused on{" "}
          <span className="text-[var(--text)]">
            {reduced ? (
              ROTATING[0]
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block"
                >
                  {ROTATING[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            )}
          </span>
          .
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--text-muted)]">
          {profile.summary}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/experience">
            <SpringButton>View experience</SpringButton>
          </Link>
          <Link href="/writing">
            <SpringButton variant="outline">Read writing</SpringButton>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[14px]">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--link)] hover:no-underline"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--link)] hover:no-underline"
          >
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="text-[var(--link)] hover:no-underline">
            Email
          </a>
        </div>
      </motion.div>
    </section>
  );
}
