"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const STORAGE_KEY = "advisory-scan-complete";

export function SecurityScan() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    setScanning(true);
    const steps = [0, 25, 50, 75, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i += 1;
      } else {
        clearInterval(interval);
        sessionStorage.setItem(STORAGE_KEY, "1");
        setTimeout(() => setScanning(false), 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {scanning && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)]"
        >
          <ShieldCheck className="mb-4 h-10 w-10 text-[var(--accent)] animate-pulse" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-muted)]">
            Running advisory surface scan…
          </p>
          <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-[var(--bg-card)]">
            <motion.div
              className="h-full bg-[var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">
            {progress}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
