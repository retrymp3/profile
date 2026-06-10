import { createHighlighter, type BundledHighlighterOptions, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["python", "xml", "javascript", "bash", "text"],
    });
  }
  return highlighterPromise;
}

function normalizeLang(lang: string) {
  if (lang === "svg") return "xml";
  if (lang === "log" || lang === "plaintext") return "text";
  return lang;
}

export async function highlightToHtml(code: string, lang: string) {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(lang),
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });
}

export const rehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
  bypassInlineCode: true,
} as const;
