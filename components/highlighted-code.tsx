import { highlightToHtml } from "@/lib/shiki";
import { HighlightedCodeHtml } from "@/components/highlighted-code-html";
import { cn } from "@/lib/utils";

type HighlightedCodeProps = {
  code: string;
  lang: string;
  className?: string;
};

export async function HighlightedCode({
  code,
  lang,
  className,
}: HighlightedCodeProps) {
  const html = await highlightToHtml(code, lang);
  return <HighlightedCodeHtml html={html} className={className} />;
}

export { HighlightedCodeHtml };
