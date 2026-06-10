"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ExternalLink } from "lucide-react";
import { HighlightedCodeHtml } from "@/components/highlighted-code-html";
import { REPO_BLOB, type FlowStep, type Tone } from "@/lib/sanitizer-flow-steps";
import { cn } from "@/lib/utils";

export type HighlightedFlowStep = FlowStep & {
  detailHtml?: string;
  codeHtml?: string;
};

const toneStyles: Record<
  Tone,
  { text: string; bg: string; bar: string }
> = {
  neutral: {
    text: "text-[var(--text-muted)]",
    bg: "bg-[var(--bg-secondary)]",
    bar: "bg-[var(--border-strong)]",
  },
  pass: {
    text: "text-[var(--success)]",
    bg: "bg-[color-mix(in_srgb,var(--success)_12%,transparent)]",
    bar: "bg-[var(--success)]",
  },
  bug: {
    text: "text-[var(--accent)]",
    bg: "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]",
    bar: "bg-[var(--accent)]",
  },
  exec: {
    text: "text-[var(--danger)]",
    bg: "bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]",
    bar: "bg-[var(--danger)]",
  },
};

function StepPanel({
  detailLabel,
  detailHtml,
  codeLabel,
  codeHtml,
  cite,
  citeHref,
}: {
  detailLabel?: string;
  detailHtml?: string;
  codeLabel?: string;
  codeHtml?: string;
  cite?: string;
  citeHref?: string;
}) {
  if (!detailHtml && !codeHtml) return null;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {detailHtml && (
        <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
          {detailLabel && (
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
              {detailLabel}
            </p>
          )}
          <HighlightedCodeHtml
            html={detailHtml}
            className="mt-1.5 text-[12px] leading-[1.5]"
          />
        </div>
      )}

      {codeHtml && (
        <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2">
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--text)]">
              {codeLabel ?? "Source"}
            </span>
            {cite && citeHref && (
              <a
                href={citeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 font-[family-name:var(--font-mono)] text-[12px] text-[var(--link)] hover:underline"
              >
                {cite}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
          </div>
          <HighlightedCodeHtml
            html={codeHtml}
            className="px-4 py-3 text-[12.5px] leading-[1.5]"
          />
        </div>
      )}
    </div>
  );
}

function StepSlider({
  steps,
  index,
  onSelect,
}: {
  steps: HighlightedFlowStep[];
  index: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="shrink-0 border-t border-[var(--border)] px-5 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          onChange={(e) => onSelect(Number(e.target.value))}
          aria-label="Bypass trace step"
          aria-valuetext={`${steps[index].label}: ${steps[index].title}`}
          className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--bg-secondary)] accent-[var(--accent)] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]"
        />
        <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[var(--text-muted)]">
          {index + 1}/{steps.length}
        </span>
      </div>
      <div className="mt-2 flex justify-between gap-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "min-w-0 flex-1 truncate text-center text-[10px] transition-colors",
              i === index
                ? "font-semibold text-[var(--text)]"
                : "text-[var(--text-subtle)] hover:text-[var(--text-muted)]"
            )}
            aria-current={i === index ? "step" : undefined}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SanitizerFlowExplorerClient({
  steps,
}: {
  steps: HighlightedFlowStep[];
}) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const tone = toneStyles[step.tone];

  const selectStep = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(steps.length - 1, i)));
  }, [steps.length]);

  const nextStep = useCallback(() => {
    setIndex((i) => (i + 1) % steps.length);
  }, [steps.length]);

  return (
    <div
      className="not-prose my-8 w-full max-w-full"
      aria-label="SVG sanitizer bypass trace"
    >
      <div className="apple-card overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-3 sm:px-6">
          <div className="min-w-0">
            <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[var(--text)]">
              Sanitizer bypass trace
            </h3>
            <a
              href={`${REPO_BLOB}#L244-L293`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--link)] hover:underline"
            >
              springfield@92f299a
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
          <button
            type="button"
            onClick={nextStep}
            aria-label={`Next: ${steps[(index + 1) % steps.length].label}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative min-w-0"
            >
              <span
                className={cn(
                  "absolute -left-5 top-0 h-8 w-0.5 rounded-r sm:-left-6",
                  tone.bar
                )}
                aria-hidden
              />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-[var(--text)]">
                  {step.label}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    tone.bg,
                    tone.text
                  )}
                >
                  {step.verdict}
                </span>
              </div>

              <h4 className="mt-2 text-[15px] font-semibold leading-snug text-[var(--text)]">
                {step.title}
              </h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {step.body}
              </p>

              <StepPanel
                detailLabel={step.detailLabel}
                detailHtml={step.detailHtml}
                codeLabel={step.codeLabel}
                codeHtml={step.codeHtml}
                cite={step.cite}
                citeHref={step.citeHref}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <StepSlider steps={steps} index={index} onSelect={selectStep} />
      </div>
    </div>
  );
}
