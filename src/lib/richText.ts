const BLOCKED_TAGS =
  /<\/?(?:script|style|iframe|object|embed|link|meta|form|input|textarea|button|svg|math)[^>]*>/gi;

const EVENT_HANDLERS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

export function excerptRichText(html: string, max = 220): string {
  const text = plainTextFromHtml(html);
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function plainTextFromHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|h2|h3|li|blockquote|div)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmptyRichText(html: string): boolean {
  return plainTextFromHtml(html).length === 0;
}

export function sanitizeRichText(html: string): string {
  return html
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(/javascript:/gi, "")
    .replace(/\s+(?:href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, "");
}

export function toEditorHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (looksLikeHtml(trimmed)) {
    return sanitizeRichText(trimmed);
  }

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
