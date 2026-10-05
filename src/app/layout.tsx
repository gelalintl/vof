import type { Metadata } from "next";
import { Inter, Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { churchIconCacheId } from "@/lib/churchIcon";
import { getChurchLogo } from "@/lib/siteSettings";
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
  const logoSrc = await getChurchLogo();
  const version = churchIconCacheId(logoSrc);

  return {
    title: {
      default: "Église VOF — Voice Of Freedom",
      template: "%s | Église VOF",
    },
    description:
      "Site officiel de l'Église Voice Of Freedom. Cultes, enseignements et vie communautaire.",
    icons: {
      icon: [{ url: `/icon/${version}`, type: "image/png", sizes: "32x32" }],
      apple: [{ url: `/apple-icon/${version}`, type: "image/png", sizes: "180x180" }],
      shortcut: `/icon/${version}`,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${plusJakarta.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-slate-800">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
