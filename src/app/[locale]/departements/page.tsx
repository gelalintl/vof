import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { getPublicDepartments } from "@/lib/publicContent";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { DepartmentAccordion } from "@/ui/modules/departements";

interface DepartmentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: DepartmentsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "departments");
}

export default async function DepartmentsPage({ params }: DepartmentsPageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { departments: copy } = getDictionary(locale);
  const departments = await getPublicDepartments();

  return (
    <MainLayout>
      <PageHero badge={copy.badge} title={copy.title} description={copy.description} />
      <ContentSection width="prose" padding="compact" labelledBy="liste-departements">
        {departments.length > 0 ? (
          <DepartmentAccordion
            departments={departments}
            labels={{
              listLabel: copy.listLabel,
              join: copy.join,
              joinTitle: copy.joinTitle,
              joinFallback: copy.joinFallback,
              joinHint: copy.joinHint,
              joinSuccess: copy.joinSuccess,
              close: copy.close,
              fullName: copy.fullName,
              phone: copy.phone,
              phonePlaceholder: copy.phonePlaceholder,
              email: copy.email,
              availability: copy.availability,
              availabilityPlaceholder: copy.availabilityPlaceholder,
              sendRequest: copy.sendRequest,
            }}
          />
        ) : (
          <p className="font-sans text-sm text-slate-600">{copy.empty}</p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
