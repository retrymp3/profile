import { SanitizerFlowExplorerClient } from "@/components/sanitizer-flow-explorer-client";
import { highlightToHtml } from "@/lib/shiki";
import { STEPS } from "@/lib/sanitizer-flow-steps";

export async function SanitizerFlowExplorer() {
  const steps = await Promise.all(
    STEPS.map(async (step) => ({
      ...step,
      detailHtml: step.detail
        ? await highlightToHtml(step.detail, step.detailLang ?? "text")
        : undefined,
      codeHtml: step.code
        ? await highlightToHtml(step.code, step.codeLang ?? "python")
        : undefined,
    }))
  );

  return <SanitizerFlowExplorerClient steps={steps} />;
}
