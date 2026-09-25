import { Logo } from "@/ui/design-system/logo";
import { siteConfig } from "@/config/site";

export function Header({
  logoSrc,
  churchName,
  tagline,
  sundayTime,
}: {
  logoSrc?: string | null;
  churchName?: string;
  tagline?: string;
  sundayTime?: string;
}) {
  const name = churchName || siteConfig.legalName;
  const baseline = tagline || siteConfig.tagline;
  const serviceTime = sundayTime || `${siteConfig.worship.sunday.day} ${siteConfig.worship.sunday.time}`;

  return (
    <div className="relative overflow-hidden bg-sky-600/85 text-white backdrop-blur-2xl backdrop-saturate-150">
      <Logo
        inverted
        showWordmark={false}
        imageSrc={logoSrc}
        wordmark={name}
        className="pointer-events-none absolute -right-6 -top-8 opacity-20"
        markClassName="size-36 sm:size-44"
      />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <p className="font-heading text-xs font-bold tracking-tight sm:text-sm">
          {name}
          <span className="hidden font-sans font-medium text-white/80 sm:inline">
            {" "}
            — {baseline}
          </span>
        </p>
        <p className="font-sans text-[11px] font-medium sm:text-xs">
          {serviceTime}
        </p>
      </div>
    </div>
  );
}
