/**
 * Mise à jour forcée des paramètres du Hero de l'accueil.
 *
 * Usage : npm run db:update-hero   (ou : npx tsx prisma/update-hero.ts)
 *
 * Écrase en base les valeurs du Hero (SiteSettings). Le site relit ces réglages
 * au plus tard 2 minutes plus tard (cache `unstable_cache`), ou immédiatement
 * après un redémarrage du serveur ou un enregistrement depuis l'administration.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL n'est pas définie.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const HERO_VALUES: Record<string, string> = {
  hero_description: "Centre de solutions de Jésus-Christ",
  hero_primary_cta_text: "Découvrir VOF",
  hero_primary_cta_link: "/a-propos",
  hero_secondary_cta_text: "",
  hero_secondary_cta_link: "",
};

async function main() {
  await prisma.$transaction(
    Object.entries(HERO_VALUES).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    ),
  );

  console.log("✅ Hero de l'accueil mis à jour :", HERO_VALUES);
}

main()
  .catch((error) => {
    console.error("❌ Échec de la mise à jour du Hero :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
