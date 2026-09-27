import type { PublicPaymentConfig, PublicProject, PublicSiteIdentity } from "@/types";
import { Header, Navbar } from "@/ui/components/layout";

interface HeaderLayoutProps {
  logoSrc?: string | null;
  identity?: PublicSiteIdentity;
  paymentConfig: PublicPaymentConfig;
  projects?: PublicProject[];
  whatsappHref?: string;
}

export function HeaderLayout({
  logoSrc,
  identity,
  paymentConfig,
  projects,
  whatsappHref,
}: HeaderLayoutProps) {
  return (
    <>
      <Header
        logoSrc={logoSrc}
        churchName={identity?.churchName}
        tagline={identity?.tagline}
        sundayTime={identity?.sundayTime}
      />
      <Navbar
        logoSrc={logoSrc}
        churchName={identity?.churchName}
        paymentConfig={paymentConfig}
        projects={projects}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
