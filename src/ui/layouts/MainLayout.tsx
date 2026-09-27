import { Footer } from "@/ui/components/layout";
import { HeaderLayout } from "@/ui/layouts/HeaderLayout";
import { getActivePublicProjects } from "@/lib/publicContent";
import { getPublicPaymentConfig } from "@/lib/siteSettings";
import { contactFromSettings, getSiteSettings, identityFromSettings } from "@/lib/settings";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";

interface MainLayoutProps {
  children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const [settings, paymentConfig, projects] = await Promise.all([
    getSiteSettings(),
    getPublicPaymentConfig(),
    getActivePublicProjects(),
  ]);
  const identity = identityFromSettings(settings);
  const contact = contactFromSettings(settings);
  const whatsappHref = toWhatsAppHref(
    settings.whatsapp_number || contact.location.phone || contact.social.whatsapp,
  );

  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderLayout
        logoSrc={identity.logoSrc}
        identity={identity}
        paymentConfig={paymentConfig}
        projects={projects}
        whatsappHref={whatsappHref}
      />
      <main className="flex-1">{children}</main>
      <Footer logoSrc={identity.logoSrc} contact={contact} identity={identity} />
    </div>
  );
}
