"use client";

import { usePathname } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { localeFromPathname } from "@/i18n/routing";
import { StatusMessage } from "@/ui/components/status/StatusMessage";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = localeFromPathname(usePathname()) ?? "fr";
  const copy = getDictionary(locale).errors;

  return (
    <StatusMessage
      code="500"
      title={copy.errorTitle}
      body={copy.errorBody}
      homeLabel={copy.home}
      homeHref={`/${locale}`}
      retryLabel={copy.retry}
      onRetry={reset}
    />
  );
}
