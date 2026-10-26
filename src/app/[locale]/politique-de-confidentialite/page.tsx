import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "privacy");
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { seo, legal } = getDictionary(locale);

  return (
    <MainLayout>
      <PageHero badge={legal.privacyBadge} title={seo.privacy.title} description={seo.privacy.description} />
      <ContentSection width="prose">
        <LegalBlock title={legal.dataTitle} body={legal.dataBody} />
        <LegalBlock title={legal.useTitle} body={legal.useBody} />
        <LegalBlock title={legal.rightsTitle} body={legal.rightsBody} />
      </ContentSection>
    </MainLayout>
  );
}

function LegalBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-heading text-xl font-extrabold tracking-tight text-slate-800">{title}</h2>
      <p className="mt-3 font-sans text-base leading-relaxed text-slate-600">{body}</p>
    </section>
  );
}
