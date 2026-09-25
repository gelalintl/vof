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