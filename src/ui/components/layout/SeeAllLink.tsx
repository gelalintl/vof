import { ArrowRight } from "lucide-react";
import { Button } from "@/ui/design-system/button";

interface SeeAllLinkProps {
  href: string;
  children: React.ReactNode;
}

/** Bouton « Tout voir » unique pour toutes les sections de l'accueil. */
export function SeeAllLink({ href, children }: SeeAllLinkProps) {
  return (
    <div className="flex justify-center">
      <Button href={href} variant="outline">
        {children}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
