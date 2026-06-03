"use client";

import dynamic from "next/dynamic";

function SpotTheBugSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]" />
  );
}

export const SpotTheBugLazy = dynamic(
  () => import("@/components/spot-the-bug").then((m) => m.SpotTheBug),
  { ssr: false, loading: () => <SpotTheBugSkeleton /> }
);
