/**
 * Témoignages FICTIFS pour juger le rendu (accueil + /temoignages).
 *
 * Usage : npx tsx prisma/seed-testimonials-demo.ts
 * Ajoute 5 témoignages publiés, repérables par `contactInfo = "DEMO (fictif)"`.
 * Relancer le script ne crée pas de doublons. Pour les retirer :
 *   npx tsx prisma/seed-testimonials-demo.ts --remove
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

const DEMO_MARKER = "DEMO (fictif)";

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

const DEMO_TESTIMONIALS = [
  {
    authorName: "Sœur Aïssatou M.",
    content:
      "Après trois ans de maladie, les médecins n'avaient plus d'espoir. Lors d'une veillée de prière à VOF, j'ai senti une paix profonde. Aujourd'hui, mes analyses sont normales et je rends gloire à Dieu pour ma guérison.",
    createdAt: daysAgo(3),
  },
  {
    authorName: "Frère Moussa I.",
    content:
      "J'étais sans travail depuis plus de deux ans. L'église a prié avec moi et m'a encouragé à ne pas abandonner. Un mois plus tard, j'ai reçu une proposition d'emploi que je n'avais pas cherchée. Dieu est fidèle !",
    createdAt: daysAgo(10),
  },
  {
    authorName: "Famille Abdou",
    content:
      "Notre foyer était au bord de la rupture. Grâce aux enseignements sur la famille et à l'accompagnement des pasteurs, la réconciliation est arrivée. Nous prions maintenant ensemble chaque soir.",
    createdAt: daysAgo(21),
  },
  {
    authorName: "Sœur Fati H.",
    content:
      "Merci Seigneur ! J'ai été délivrée de la peur qui me paralysait depuis l'enfance. Chaque dimanche, la Parole fortifie ma foi et je sers maintenant dans le département des enfants avec joie.",
    createdAt: daysAgo(35),
  },
  {
    authorName: "Frère Ibrahim S.",
    content:
      "Je suis arrivé à VOF par hasard, un dimanche, découragé et sans repères. J'y ai trouvé une famille, une parole claire et une liberté en Christ que je n'avais jamais connues. Ma vie a complètement changé : j'ai donné mon cœur à Jésus, je suis baptisé et je sers aujourd'hui l'équipe d'accueil. Que toute la gloire revienne à Dieu !",
    createdAt: daysAgo(50),
  },
];

async function main() {
  if (process.argv.includes("--remove")) {
    const removed = await prisma.testimonial.deleteMany({
      where: { contactInfo: DEMO_MARKER },
    });
    console.log(`🗑️  ${removed.count} témoignage(s) fictif(s) supprimé(s).`);
    return;
  }

  let created = 0;
  for (const item of DEMO_TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({
      where: { authorName: item.authorName, contactInfo: DEMO_MARKER },
      select: { id: true },
    });
    if (existing) {
      continue;
    }
    await prisma.testimonial.create({
      data: { ...item, contactInfo: DEMO_MARKER, isPublished: true },
    });
    created += 1;
  }

  console.log(`✅ ${created} témoignage(s) fictif(s) ajouté(s) et publiés.`);
}

main()
  .catch((error) => {
    console.error("❌ Échec :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
