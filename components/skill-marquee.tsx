"use client";

import type { SkillGroup } from "@/lib/profile";

export function SkillMarquee({ skills }: { skills: SkillGroup[] }) {
  const items = skills.flatMap((g) => g.items.map((i) => i.name));
  const doubled = [...items, ...items];

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] py-8">
      <p className="section-eyebrow text-center">Expertise</p>
      <div className="relative mt-4 flex">
        <div className="animate-marquee flex shrink-0 gap-3 px-4">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 rounded-full bg-[var(--bg-elevated)] px-4 py-2 text-[14px] text-[var(--text-muted)] shadow-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
