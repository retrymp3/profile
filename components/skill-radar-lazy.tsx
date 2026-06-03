"use client";

import dynamic from "next/dynamic";
import type { SkillGroup } from "@/lib/profile";

function SkillRadarSkeleton() {
  return (
    <div className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]" />
  );
}

const SkillRadar = dynamic(
  () => import("@/components/skill-radar").then((m) => m.SkillRadar),
  { ssr: false, loading: () => <SkillRadarSkeleton /> }
);

export function SkillRadarLazy({ skills }: { skills: SkillGroup[] }) {
  return <SkillRadar skills={skills} />;
}
