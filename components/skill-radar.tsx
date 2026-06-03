"use client";

import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { SkillGroup } from "@/lib/profile";

export function SkillRadar({ skills }: { skills: SkillGroup[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const topSkills = skills
    .flatMap((g) =>
      g.items.slice(0, 2).map((item) => ({
        skill: item.name.length > 14 ? `${item.name.slice(0, 12)}…` : item.name,
        level: item.level,
        fullMark: 100,
      }))
    )
    .slice(0, 8);

  return (
    <div className="apple-card p-6 md:p-8">
      <p className="section-eyebrow">Skills</p>
      <h2 className="section-title mt-2">Capability overview</h2>
      <p className="section-subtitle">Self-assessed proficiency across core domains.</p>
      <div className="mt-6 h-72 min-h-[288px] w-full min-w-0">
        {mounted ? (
          <ResponsiveContainer width="100%" height={288}>
            <RadarChart data={topSkills}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              />
              <Radar
                name="Level"
                dataKey="level"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-[var(--radius)] bg-[var(--bg-secondary)]" />
        )}
      </div>
    </div>
  );
}
