import { Footer } from "@/ui/components/layout";
import { HeaderLayout } from "@/ui/layouts/HeaderLayout";
import { getPublicPaymentConfig } from "@/lib/siteSettings";
import { contactFromSettings, getSiteSettings, identityFromSettings } from "@/lib/settings";

interface MainLayoutProps {
  children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const [settings, paymentConfig] = await Promise.all([
    getSiteSettings(),
    getPublicPaymentConfig(),
  ]);
  const identity = identityFromSettings(settings);
  const contact = contactFromSettings(settings);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderLayout
        logoSrc={identity.logoSrc}
        identity={identity}
        paymentConfig={paymentConfig}
      />
      <main className="flex-1">{children}</main>
      <Footer logoSrc={identity.logoSrc} contact={contact} identity={identity} />
    </div>
  );
}
