import { cn } from "@/lib/utils";

type HighlightedCodeHtmlProps = {
  html: string;
  className?: string;
};

export function HighlightedCodeHtml({ html, className }: HighlightedCodeHtmlProps) {
  return (
    <div
      className={cn("shiki-block", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
