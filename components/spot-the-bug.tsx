"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, CheckCircle, XCircle } from "lucide-react";
import { SpringButton } from "@/components/spring-button";
import { useClearanceContext } from "@/components/providers";
import { cn } from "@/lib/utils";

const SNIPPETS = [
  {
    id: "safe",
    code: `const userId = parseInt(req.params.id, 10);
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);`,
    vulnerable: false,
    hint: "Parameterized query with validated integer input.",
  },
  {
    id: "sqli",
    code: `const username = req.query.user;
const result = await db.query(
  "SELECT * FROM users WHERE name = '" + username + "'"
);`,
    vulnerable: true,
    hint: "String concatenation in SQL — classic injection vector.",
  },
  {
    id: "safe2",
    code: `const email = validator.normalizeEmail(req.body.email);
await db.user.findUnique({ where: { email } });`,
    vulnerable: false,
    hint: "ORM with validated, normalized input.",
  },
];

export function SpotTheBug() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<"vuln" | "safe" | null>(null);
  const [score, setScore] = useState(0);
  const { addXP } = useClearanceContext();

  const snippet = SNIPPETS[index % SNIPPETS.length];
  const finished = index >= SNIPPETS.length;

  const handleGuess = (guess: "vuln" | "safe") => {
    if (selected) return;
    setSelected(guess);
    const correct =
      (guess === "vuln" && snippet.vulnerable) ||
      (guess === "safe" && !snippet.vulnerable);
    if (correct) {
      setScore((s) => s + 1);
      addXP(25);
    }
    setTimeout(() => {
      setSelected(null);
      setIndex((i) => i + 1);
    }, 1500);
  };

  const correct =
    selected &&
    ((selected === "vuln" && snippet.vulnerable) ||
      (selected === "safe" && !snippet.vulnerable));

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="flex items-center gap-2">
        <Bug className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-lg font-semibold text-[var(--text)]">Spot the Bug</h2>
      </div>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        SQL injection triage — is this snippet exploitable?
      </p>

      {finished ? (
        <div className="mt-6 text-center">
          <p className="text-[var(--accent)] font-[family-name:var(--font-mono)]">
            Session complete: {score}/{SNIPPETS.length} correct
          </p>
          <SpringButton className="mt-4" onClick={() => { setIndex(0); setScore(0); }}>
            Play again
          </SpringButton>
        </div>
      ) : (
        <>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--text-muted)]">
            {snippet.code}
          </pre>

          <div className="mt-4 flex gap-3">
            <SpringButton
              variant="outline"
              onClick={() => handleGuess("vuln")}
              disabled={!!selected}
              className={cn(
                selected === "vuln" && correct && "border-[var(--success)]",
                selected === "vuln" && !correct && "border-[var(--danger)]"
              )}
            >
              Vulnerable
            </SpringButton>
            <SpringButton
              variant="outline"
              onClick={() => handleGuess("safe")}
              disabled={!!selected}
            >
              Safe
            </SpringButton>
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-start gap-2 text-sm"
              >
                {correct ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-[var(--success)]" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-[var(--danger)]" />
                )}
                <span className="text-[var(--text-muted)]">{snippet.hint}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-3 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">
            Round {index + 1} of {SNIPPETS.length}
          </p>
        </>
      )}
    </section>
  );
}
