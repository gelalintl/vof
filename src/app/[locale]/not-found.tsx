import { headers } from "next/headers";
import { isLocale, LOCALE_HEADER } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { StatusMessage } from "@/ui/components/status/StatusMessage";
import { MainLayout } from "@/ui/layouts/MainLayout";

export default async function LocaleNotFound() {
  const headerLocale = (await headers()).get(LOCALE_HEADER);
  const locale = isLocale(headerLocale) ? headerLocale : "fr";
  const copy = getDictionary(locale).errors;

  return (
    <MainLayout>
      <StatusMessage
        code="404"
        title={copy.notFoundTitle}
        body={copy.notFoundBody}
        homeLabel={copy.home}
        homeHref={`/${locale}`}
      />
    </MainLayout>
  );
}
