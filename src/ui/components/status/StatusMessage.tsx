import { Logo } from "@/ui/design-system/logo";
import { Button } from "@/ui/design-system/button";

interface StatusMessageProps {
  code: string;
  title: string;
  body: string;
  homeLabel: string;
  homeHref: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function StatusMessage({
  code,
  title,
  body,
  homeLabel,
  homeHref,
  retryLabel,
  onRetry,
}: StatusMessageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-20 text-center">
      <Logo />
      <p className="mt-8 font-heading text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
        {code}
      </p>
      <h1 className="mt-3 max-w-lg font-heading text-3xl font-extrabold tracking-tight text-slate-800">
        {title}
      </h1>
      <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-slate-600">{body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href={homeHref} variant="primary">
          {homeLabel}
        </Button>
        {onRetry && retryLabel ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
