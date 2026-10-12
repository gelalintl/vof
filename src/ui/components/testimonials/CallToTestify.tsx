import { MessageSquareHeart } from "lucide-react";
import { Button } from "@/ui/design-system/button";
import { cn } from "@/utils/cn";

interface CallToTestifyProps {
  className?: string;
}

export function CallToTestify({ className }: CallToTestifyProps) {
  return (
    <aside
      aria-label="Appel à témoigner"
      className={cn(
        "relative overflow-hidden border border-violet-200 border-l-4 border-l-violet-700 bg-violet-50 px-6 py-8 text-center sm:px-10 sm:py-10",
        className,
      )}
    >
      <span
        aria-hidden
        className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm"
      >
        <MessageSquareHeart className="size-6" />
      </span>
      <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic leading-relaxed text-slate-800 sm:text-xl">
        Vous avez expérimenté la grâce de Dieu ? Partagez votre témoignage pour édifier
        l&apos;église.
      </p>
      <Button href="/partager-temoignage" variant="primary" size="lg" className="mt-6">
        Partager mon témoignage
      </Button>
    </aside>
  );
}
