import Image from "next/image";
import { pastors } from "@/datas/pastors";
import { cn } from "@/utils/cn";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

export function PastoralTeam() {
  return (
    <section className="bg-white" aria-labelledby="equipe-pastorale">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
          <Badge variant="brand">Équipe pastorale</Badge>
          <Typography
            id="equipe-pastorale"
            variant="h2"
            className="mt-3 uppercase tracking-wider"
          >
            Ceux qui portent la maison
          </Typography>
        </div>

        <div className="mt-12 space-y-16">
          {pastors.map((pastor, index) => {
            const reversed = index % 2 === 1;
            const fullName = `${pastor.title} ${pastor.firstName}`.trim();
            const photoSrc = pastor.photoUrl ?? `/assets/pastors/${pastor.id}.svg`;

            return (
              <article
                key={pastor.id}
                className={cn(
                  "flex flex-col items-start gap-8 lg:flex-row lg:gap-14",
                  reversed && "lg:flex-row-reverse",
                )}
              >
                <div className="relative h-96 w-72 shrink-0 overflow-hidden rounded-2xl lg:h-[400px] lg:w-80">
                  <Image
                    src={photoSrc}
                    alt={fullName}
                    fill
                    sizes="(min-width: 1024px) 320px, 288px"
                    className="object-cover"
                    unoptimized={photoSrc.endsWith(".svg")}
                    priority={index === 0}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant={reversed ? "secondary" : "accent"} size="md">
                    {pastor.role}
                  </Badge>
                  <Typography variant="h3" className="mt-3">
                    {fullName}
                  </Typography>
                  <Typography variant="body" className="mt-4 text-justify text-slate-600">
                    {pastor.bio}
                  </Typography>
                  {pastor.quote ? (
                    <Typography variant="quote" className="mt-6">
                      « {pastor.quote} »
                    </Typography>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
