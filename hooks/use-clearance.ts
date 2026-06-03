"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "advisory-clearance";

export type ClearanceLevel = "Visitor" | "Explorer" | "Regular" | "Insider";

const LEVEL_THRESHOLDS: { level: ClearanceLevel; minXp: number }[] = [
  { level: "Insider", minXp: 400 },
  { level: "Regular", minXp: 200 },
  { level: "Explorer", minXp: 50 },
  { level: "Visitor", minXp: 0 },
];

export function xpToLevel(xp: number): ClearanceLevel {
  for (const { level, minXp } of LEVEL_THRESHOLDS) {
    if (xp >= minXp) return level;
  }
  return "Visitor";
}

export function levelProgress(xp: number): { current: number; next: number; percent: number } {
  const sorted = [...LEVEL_THRESHOLDS].sort((a, b) => a.minXp - b.minXp);
  let current = 0;
  let next = sorted[1]?.minXp ?? 400;
  for (let i = 0; i < sorted.length; i++) {
    if (xp >= sorted[i].minXp) {
      current = sorted[i].minXp;
      next = sorted[i + 1]?.minXp ?? sorted[i].minXp + 100;
    }
  }
  const range = next - current;
  const percent = range > 0 ? Math.min(100, ((xp - current) / range) * 100) : 100;
  return { current, next, percent };
}

type ClearanceState = {
  xp: number;
  visitedPages: string[];
};

function loadState(): ClearanceState {
  if (typeof window === "undefined") return { xp: 0, visitedPages: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { xp: 0, visitedPages: [] };
    return JSON.parse(raw) as ClearanceState;
  } catch {
    return { xp: 0, visitedPages: [] };
  }
}

function saveState(state: ClearanceState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useClearance() {
  const [xp, setXp] = useState(0);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const state = loadState();
    setXp(state.xp);
    setVisitedPages(state.visitedPages);
    setHydrated(true);
  }, []);

  const addXP = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      saveState({ xp: next, visitedPages: loadState().visitedPages });
      return next;
    });
  }, []);

  const trackPageVisit = useCallback((path: string, bonus = 10) => {
    setVisitedPages((prev) => {
      if (prev.includes(path)) return prev;
      const next = [...prev, path];
      setXp((x) => {
        const newXp = x + bonus;
        saveState({ xp: newXp, visitedPages: next });
        return newXp;
      });
      return next;
    });
  }, []);

  const level = xpToLevel(xp);
  const progress = levelProgress(xp);

  return {
    xp,
    level,
    progress,
    visitedPages,
    hydrated,
    addXP,
    trackPageVisit,
  };
}

export type ClearanceContextValue = ReturnType<typeof useClearance>;
