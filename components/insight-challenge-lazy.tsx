"use client";

import dynamic from "next/dynamic";

export const InsightChallengeLazy = dynamic(
  () => import("@/components/insight-challenge").then((m) => m.InsightChallenge),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--bg-secondary)]" /> }
);
