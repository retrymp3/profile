"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { label: "Critical findings", value: 15, suffix: "+" },
  { label: "CVEs assigned", value: 5, suffix: "" },
  { label: "Security assessments", value: 20, suffix: "+" },
  { label: "Automation tools built", value: 7, suffix: "+" },
];

function AnimatedNumber({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <span className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-[var(--text)] tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export function InteractiveStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06, duration: 0.5 }}
          className="apple-card apple-card-hover p-6 text-center"
        >
          <AnimatedNumber value={stat.value} suffix={stat.suffix} active={inView} />
          <p className="mt-2 text-[14px] text-[var(--text-muted)]">{stat.label}</p>
        </motion.div>
      ))}
    </section>
  );
}
