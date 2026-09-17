"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, FileCode, Shield, Sparkles } from "lucide-react";
import type { Achievement } from "@/lib/profile";
import { useClearanceContext } from "@/components/providers";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  bug: FileCode,
  code: FileCode,
  trophy: Award,
  award: Sparkles,
};

export function AchievementBento({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {achievements.map((a, i) => (
        <AchievementCard key={a.id} achievement={a} index={i} />
      ))}
    </div>
  );
}

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const { addXP } = useClearanceContext();
  const Icon = ICONS[achievement.icon] ?? Award;

  const onFlip = () => {
    if (!flipped) addXP(achievement.xp);
    setFlipped((f) => !f);
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      onClick={onFlip}
      className="group relative h-44 w-full text-left perspective-[1000px]"
      aria-label={`${achievement.title} — tap for details`}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute inset-0 flex flex-col justify-between apple-card p-6 [backface-visibility:hidden]">
          <Icon className="h-7 w-7 text-[var(--accent)]" />
          <div>
            <h3 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">
              {achievement.title}
            </h3>
            <p className="mt-1 text-[13px] text-[var(--text-subtle)]">Tap to learn more</p>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center apple-card bg-[var(--bg-secondary)] p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
            {achievement.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
