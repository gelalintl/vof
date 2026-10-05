import { cn } from "@/utils/cn";
import { sanitizeRichText, toEditorHtml } from "@/lib/richText";

export interface ProseHtmlProps {
  html: string;
  className?: string;
}

export function ProseHtml({ html, className }: ProseHtmlProps) {
  if (!html.trim()) {
    return null;
  }

  return (
    <div
      className={cn("prose prose-purple lg:prose-lg max-w-none text-justify", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(toEditorHtml(html)) }}
    />
  );
}
