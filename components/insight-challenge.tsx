"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { SpringButton } from "@/components/spring-button";
import { useClearanceContext } from "@/components/providers";
import { cn } from "@/lib/utils";

const ROUNDS = [
  {
    code: `const userId = parseInt(req.params.id, 10);
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);`,
    vulnerable: false,
    insight: "Parameterized queries with validated input — a solid pattern.",
  },
  {
    code: `const username = req.query.user;
const result = await db.query(
  "SELECT * FROM users WHERE name = '" + username + "'"
);`,
    vulnerable: true,
    insight: "User input concatenated into SQL — review for injection risk.",
  },
  {
    code: `const email = validator.normalizeEmail(req.body.email);
await db.user.findUnique({ where: { email } });`,
    vulnerable: false,
    insight: "Validation plus ORM lookup reduces common injection paths.",
  },
];

export function InsightChallenge() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<"risk" | "sound" | null>(null);
  const [score, setScore] = useState(0);
  const { addXP } = useClearanceContext();

  const round = ROUNDS[index % ROUNDS.length];
  const finished = index >= ROUNDS.length;

  const handlePick = (pick: "risk" | "sound") => {
    if (selected) return;
    setSelected(pick);
    const correct =
      (pick === "risk" && round.vulnerable) ||
      (pick === "sound" && !round.vulnerable);
    if (correct) {
      setScore((s) => s + 1);
      addXP(20);
    }
    setTimeout(() => {
      setSelected(null);
      setIndex((i) => i + 1);
    }, 1600);
  };

  const correct =
    selected &&
    ((selected === "risk" && round.vulnerable) ||
      (selected === "sound" && !round.vulnerable));

  return (
    <section className="mx-auto max-w-xl text-center">
      <p className="section-eyebrow">Interactive</p>
      <h2 className="section-title mt-2">Code review moment</h2>
      <p className="section-subtitle mx-auto">
        Would you flag this snippet in a review?
      </p>

      {finished ? (
        <div className="mt-8 text-center">
          <p className="text-[var(--accent)]">
            {score} of {ROUNDS.length} aligned with secure patterns
          </p>
          <SpringButton className="mt-4" onClick={() => { setIndex(0); setScore(0); }}>
            Try again
          </SpringButton>
        </div>
      ) : (
        <>
          <pre className="mt-8 overflow-x-auto rounded-[var(--radius)] bg-[var(--bg-elevated)] p-5 text-left text-[13px] leading-relaxed text-[var(--text-muted)] shadow-sm">
            {round.code}
          </pre>

          <div className="mt-5 flex flex-wrap gap-3">
            <SpringButton
              variant="outline"
              onClick={() => handlePick("risk")}
              disabled={!!selected}
            >
              Needs review
            </SpringButton>
            <SpringButton
              variant="outline"
              onClick={() => handlePick("sound")}
              disabled={!!selected}
            >
              Looks sound
            </SpringButton>
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "mt-4 flex items-start gap-2 rounded-xl p-3 text-sm",
                  correct
                    ? "bg-[color-mix(in_srgb,var(--success)_12%,transparent)]"
                    : "bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]"
                )}
              >
                {correct ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-[var(--danger)]" />
                )}
                <span className="text-[var(--text-muted)]">{round.insight}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            {index + 1} / {ROUNDS.length}
          </p>
        </>
      )}
    </section>
  );
}
