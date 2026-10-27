import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL n'est pas définie.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('🌱 Début du seeding des données de démonstration VOF...')

  // Nettoyage des anciennes données
  await prisma.media.deleteMany()
  await prisma.event.deleteMany()
  await prisma.article.deleteMany()
  await prisma.department.deleteMany()
  await prisma.siteSettings.deleteMany()
  await prisma.user.deleteMany()

  // 1. Compte Administrateur par défaut
  const hashedPassword = await bcrypt.hash('Enoch240726', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'contact@eglisevof.org',
      passwordHash: hashedPassword,
      name: 'Lelouch',
      role: UserRole.SUPERADMIN,
    },
  })
  console.log(`✅ Administrateur créé : ${admin.email}`)

  console.log('🎉 Seeding terminé avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })