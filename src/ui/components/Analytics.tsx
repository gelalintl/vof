import Script from "next/script";

/**
 * Squelette d'audience. Aucun script n'est envoyé tant qu'un identifiant n'est pas défini.
 *
 * Google Analytics 4 :
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXX
 *
 * Plausible :
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=voiceoffreedom.org
 *   Le script pointe vers https://plausible.io. Changez l'adresse si l'instance est auto-hébergée.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

  return (
    <>
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="vof-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
