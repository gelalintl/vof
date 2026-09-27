import { getPublicPastors } from "@/lib/publicContent";
import { SectionHeader } from "@/ui/components/layout";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

function formatPastorQuote(quote: string) {
  const trimmed = quote.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("«") || trimmed.startsWith('"') || trimmed.startsWith("“")) {
    return trimmed;
  }
  return `« ${trimmed} »`;
}

export async function PastorsSection() {
  const pastors = await getPublicPastors();

  return (
    <section
      id="equipe-pastorale"
      aria-labelledby="equipe-pastorale-title"
      className="bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeader
          badge="Équipe pastorale"
          title="Ceux qui portent la maison"
          titleId="equipe-pastorale-title"
          align="center"
          titleStyle="display"
        />

        {pastors.length === 0 ? (
          <p className="mt-10 text-center font-sans text-sm text-slate-600">
            L’équipe pastorale sera bientôt présentée.
          </p>
        ) : (
          <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
            {pastors.map((pastor, index) => (
              <article
                key={pastor.id}
                className={cn(
                  "flex flex-col gap-8 md:items-center md:gap-12",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                )}
              >
                <div className="w-full md:w-1/2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pastor.image || PLACEHOLDER_SRC}
                    alt={pastor.name}
                    className="h-[380px] w-full rounded-2xl bg-slate-50 object-cover shadow-md md:h-[450px]"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Typography variant="h2" className="mt-4 text-slate-900">
                    {pastor.name}
                  </Typography>
                  {pastor.quote ? (
                    <blockquote className="mt-6 border-l-4 border-[#6d28d9] bg-purple-50/50 px-5 py-4 font-serif text-lg italic leading-relaxed text-slate-800">
                      {formatPastorQuote(pastor.quote)}
                    </blockquote>
                  ) : null}
                  {pastor.bio ? (
                    <p className="mt-6 font-sans text-base leading-relaxed text-slate-600 text-justify">
                      {pastor.bio}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
