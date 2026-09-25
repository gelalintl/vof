import type { PublicPaymentConfig, PublicSiteIdentity } from "@/types";
import { Header, Navbar } from "@/ui/components/layout";

interface HeaderLayoutProps {
  logoSrc?: string | null;
  identity?: PublicSiteIdentity;
  paymentConfig: PublicPaymentConfig;
}

export function HeaderLayout({ logoSrc, identity, paymentConfig }: HeaderLayoutProps) {
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
      />
    </>
  );
}
