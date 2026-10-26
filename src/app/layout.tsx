import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Lora, Plus_Jakarta_Sans } from "next/font/google";
import { isLocale, LOCALE_HEADER } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Toaster } from "sonner";
import { churchIconCacheId } from "@/lib/churchIcon";
import { requestMetadataBase, socialMetadata } from "@/lib/socialMetadata";
import { getChurchLogo } from "@/lib/siteSettings";
import { Analytics } from "@/ui/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const headerLocale = headerList.get(LOCALE_HEADER);
  const locale = isLocale(headerLocale) ? headerLocale : "fr";
  const seo = getDictionary(locale).seo;
  const logoSrc = await getChurchLogo();
  const version = churchIconCacheId(logoSrc);

  return {
    metadataBase: await requestMetadataBase(),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    ...socialMetadata({
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      image: logoSrc,
      locale,
    }),
    icons: {
      icon: [{ url: `/icon/${version}`, type: "image/png", sizes: "32x32" }],
      apple: [{ url: `/apple-icon/${version}`, type: "image/png", sizes: "180x180" }],
      shortcut: `/icon/${version}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localeHeader = (await headers()).get(LOCALE_HEADER);
  const lang = isLocale(localeHeader) ? localeHeader : "fr";

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${plusJakarta.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-slate-800">
        {children}
        <Analytics />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
