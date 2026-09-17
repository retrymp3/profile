"use client";

import type { SkillGroup } from "@/lib/profile";

export function SkillMarquee({ skills }: { skills: SkillGroup[] }) {
  const items = skills.flatMap((g) => g.items.map((i) => i.name));
  const doubled = [...items, ...items];

  return (
    <section className="glass-card overflow-hidden py-8">
      <p className="section-eyebrow text-center">Expertise</p>
      <div className="relative mt-4 flex">
        <div className="animate-marquee flex shrink-0 gap-3 px-4">
          {doubled.map((name, i) => (
            <span key={`${name}-${i}`} className="glass-chip shrink-0">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
