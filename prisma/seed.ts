import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { EventCategory, PrismaClient, UserRole } from "../src/generated/prisma/client";

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
  const hashedPassword = await bcrypt.hash('Admin2026!', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@voiceoffreedom.org',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
    },
  })
  console.log(`✅ Administrateur créé : ${admin.email}`)

  // 2. Paramètres généraux du site
  await prisma.siteSettings.createMany({
    data: [
      { key: 'church_name', value: 'Église Voice of Freedom' },
      { key: 'sunday_service_time', value: '09h00 - 11h30' },
      { key: 'contact_phone', value: '+227 90 00 00 00' },
      { key: 'contact_email', value: 'contact@voiceoffreedom.org' },
      { key: 'social_facebook', value: 'https://www.facebook.com/share/1HewwYoxa1/' },
      { key: 'social_instagram', value: 'https://www.instagram.com/eglise_vof' },
      { key: 'social_youtube', value: 'http://www.youtube.com/@eglisevof6303' },
      { key: 'social_tiktok', value: '' },
      { key: 'social_whatsapp', value: '+227 90 00 00 00' },
      { key: 'location_address', value: 'A côté du cimétière de Yantala, non loin du CEG 25, Niamey' },
      { key: 'location_city', value: 'Niamey, Niger' },
      { key: 'location_google_maps_url', value: 'https://maps.app.goo.gl/L5HcxHPG8WdVfAmu9' },
      { key: 'location_iframe_url', value: 'https://www.google.com/maps?q=13.546976,2.0739387&z=18&output=embed' },
      { key: 'payment_amana_enabled', value: 'true' },
      { key: 'payment_nita_enabled', value: 'true' },
      { key: 'payment_wave_enabled', value: 'true' },
      { key: 'payment_card_enabled', value: 'true' },
      { key: 'payment_bank_enabled', value: 'true' },
      { key: 'payment_amana_qr', value: '' },
      { key: 'payment_nita_qr', value: '' },
      { key: 'payment_wave_qr', value: '' },
      { key: 'payment_amana_phone', value: '00 00 00 00 00' },
      { key: 'payment_nita_phone', value: '00 00 00 00 00' },
      { key: 'payment_wave_phone', value: '00 00 00 00 00' },
      { key: 'bank_name', value: 'Banque partenaire VOF' },
      { key: 'bank_account_name', value: 'Église Voice Of Freedom' },
      { key: 'bank_iban', value: 'CI93 CI00 0000 0000 0000 0000 000' },
      { key: 'bank_swift', value: 'XXXXCIAB' },
      { key: 'bank_rib_code', value: '' },
    ],
  })
  console.log('✅ Paramètres configurés.')

  // 3. Événements fictifs
  const now = new Date()
  const event1 = await prisma.event.create({
    data: {
      title: 'Grand Culte d’Action de Grâce',
      description: 'Moment d’adoration et de célébration des merveilles de Dieu.',
      startDate: new Date(now.getFullYear(), now.getMonth(), 15, 9, 0),
      endDate: new Date(now.getFullYear(), now.getMonth(), 15, 12, 0),
      location: 'Auditorium Principal',
      category: EventCategory.SPECIAL,
      isSpecial: true,
      image: '/uploads/mock-culte.webp',
    },
  })

  await prisma.event.create({
    data: {
      title: 'Veillée de Prière & Intercession',
      description: 'Nuit d’intercession et de percée spirituelle.',
      startDate: new Date(now.getFullYear(), now.getMonth(), 27, 23, 0),
      endDate: new Date(now.getFullYear(), now.getMonth(), 28, 5, 0),
      location: 'Salle d’Adoration',
      category: EventCategory.VIGIL,
      isSpecial: false,
      image: '/uploads/mock-veillee.webp',
    },
  })
  console.log('✅ Événements insérés.')

  // 4. Articles et enseignements
  await prisma.article.createMany({
    data: [
      {
        title: 'Marcher dans la Liberté Spirituelle',
        slug: 'marcher-dans-la-liberte-spirituelle',
        content: 'Découvrez les clés bibliques pour vivre une vie d’impact...',
        author: 'Révérend Nelson',
        coverImage: '/uploads/mock-article-1.webp',
        isPublished: true,
      },
      {
        title: 'La Puissance de la Générosité',
        slug: 'puissance-de-la-generosite',
        content: 'Un enseignement profond sur l’impact des dîmes et offrandes...',
        author: 'Pasteure Rose',
        coverImage: '/uploads/mock-article-2.webp',
        isPublished: true,
      },
    ],
  })
  console.log('✅ Articles insérés.')

  // 5. Galerie Médias
  await prisma.media.createMany({
    data: [
      {
        title: 'Moment de Louange',
        url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
        category: 'CULTE',
        isFeaturedHome: true,
        eventId: event1.id,
      },
    ],
  })
  console.log('✅ Galerie média initialisée.')

  await prisma.department.createMany({
    data: [
      {
        name: "Chorale",
        slug: "chorale",
        description:
          "Prépare le climat d'adoration des cultes : chant, musique et présence de Dieu au centre de l'assemblée.",
        responsible: "Emmanuel",
        contact: "+227 XX XX XX XX",
        order: 1,
      },
      {
        name: "Intercession",
        slug: "intercession",
        description:
          "Veilleurs de la maison : prière pour l'église, la ville et les nations, avant et pendant les cultes.",
        responsible: "Pasteur Parfait",
        contact: "+227 XX XX XX XX",
        order: 2,
      },
      {
        name: "Protocole",
        slug: "protocole",
        description:
          "Premier sourire de VOF. Oriente les visiteurs, prépare la salle et veille à ce que chacun se sente attendu.",
        responsible: "Akueté",
        contact: "+227 XX XX XX XX",
        order: 3,
      },
      {
        name: "La jeunesse",
        slug: "jeunesse",
        description:
          "Un pôle pour les adolescents et jeunes adultes : Parole, amitié, mission et une foi incarnée dans leur génération.",
        responsible: "Mainassara Nelson",
        contact: "+227 XX XX XX XX",
        order: 4,
      },
      {
        name: "Enfants",
        slug: "enfants",
        description:
          "Éveil biblique et accueil des enfants pendant le culte, dans un cadre sûr, joyeux et adapté à leur âge.",
        responsible: "Pasteure Rose",
        contact: "+227 XX XX XX XX",
        order: 5,
      },
      {
        name: "Média & Communication",
        slug: "media",
        description:
          "Captation, replay, graphisme et diffusion : rendre visible la vie de l'église, y compris sur les réseaux 3G/4G.",
        responsible: "Mainassara Nelson",
        contact: "+227 XX XX XX XX",
        order: 6,
      },
      {
        name: "Nettoyage",
        slug: "nettoage",
        description:
          "Tenir la maison de Dieu propre et assurer aux enfants de Dieu un cadre sain et propice à la prière, telle est notre mission.",
        responsible: "Alfred",
        contact: "+227 XX XX XX XX",
        order: 7,
      },
      {
        name: "Cellules de visite",
        slug: "visite",
        description:
          "Petits groupes en semaine pour prier, étudier la Parole et tisser des liens au-delà du dimanche.",
        responsible: "Pasteur Parfait",
        contact: "+227 XX XX XX XX",
        order: 8,
      },
    ],
  })
  console.log("✅ Départements insérés.")

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