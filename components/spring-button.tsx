"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ReactNode } from "react";

type SpringButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export function SpringButton({
  children,
  className,
  variant = "primary",
  ...props
}: SpringButtonProps) {
  const reduced = useReducedMotion();

  const variants = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm",
    ghost: "bg-transparent text-[var(--link)] hover:underline",
    outline:
      "bg-transparent border border-[var(--border-strong)] text-[var(--accent)] hover:bg-[var(--bg-secondary)]",
  };

  return (
    <motion.button
      whileHover={reduced ? undefined : { scale: 1.01 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex min-w-[28px] items-center justify-center gap-2 rounded-full px-[22px] py-2.5 text-[17px] font-normal transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
