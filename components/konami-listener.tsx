"use client";

import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const DURATION_MS = 60_000;

export function KonamiListener() {
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[indexRef.current];
      if (e.key === expected) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0;
          activateRedTeamMode();
        }
      } else {
        indexRef.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };

    const activateRedTeamMode = () => {
      document.documentElement.classList.add("red-team-mode");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove("red-team-mode");
      }, DURATION_MS);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
}
