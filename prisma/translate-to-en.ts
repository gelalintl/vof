/**
 * Traduit le contenu public français déjà en base vers les champs anglais.
 *
 * Ne modifie aucun texte français : uniquement titleEn, descriptionEn,
 * contentEn, nameEn, locationEn, categoryEn et les clés SiteSettings `*_en`.
 *
 * Usage : npx tsx prisma/translate-to-en.ts
 *
 * Les cibles sont les enregistrements présents dans la base locale
 * (événements, enseignements, départements, témoignages, projet du Jubilé
 * et paramètres publics). Le témoignage « Soeur Christine » est ignoré :
 * son texte (« Lopseum lupus ») n'est pas du français.
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

const TITHE_PART_II = `<p><strong>Scripture references:</strong> Genesis 14:14-20; Psalm 76:1-2; Hebrews 5:5-6; Hebrews 7:1-9</p><h3>Introduction</h3><p>During the Sunday service of September 20, 2026, at Voice of Freedom Church, Reverend Pastor Nelson taught the second part of the series on the laws and principles of giving and receiving, focusing on this theme: <strong>“The tithe is a covenant that has existed since Abram.”</strong></p><h3>1. The tithe comes before the Law of Moses (Genesis 14:14-20)</h3><p>A very common assumption claims that the tithe belongs only to the ceremonial law of Moses. Yet the Bible clearly shows that long before the Mosaic law was given on Mount Sinai, Abraham (Abram) was already practicing the principle of the tithe.</p><p>After his victory over the kings in order to rescue his nephew Lot, Abraham met <strong>Melchizedek</strong>, king of Salem and priest of God Most High. Abraham gave him a tithe of all the spoils. This was not a legal requirement, but an act of faith and gratitude inspired by the Holy Spirit.</p><h3>2. The eternal priesthood and Melchizedek (Hebrews 5:5-6; Hebrews 7:1-9)</h3><p>According to the book of Hebrews, Melchizedek is presented as a figure without father, without mother, and without genealogy, foreshadowing the eternal priesthood of Jesus Christ.</p><p>By giving his tithe to Melchizedek, Abraham sealed a perpetual spiritual covenant. Scripture even emphasizes that Levi (who later collected the tithe under the law) paid the tithe in the person of Abraham. To give one's tithe today, under grace, is to take an active place in this eternal covenant with Jesus Christ.</p><h3>3. A tithe of EVERYTHING</h3><p>Abraham gave a tithe of <em>everything</em> he had recovered — livestock, wealth, and goods. In the same way, acknowledging God as the source of our blessings means setting apart 10 percent of all our income and increase.</p>`;

const TITHE_PART_III = `<p><strong>Central theme:</strong> Paying the tithe is an obligation, not a matter of diligence. Faithfulness in the tithe is essential to the fulfillment of the Lord's covenant.</p><p><strong>Scripture references:</strong> Leviticus 27:30, 34; Malachi 3:7-12</p><h3>Introduction</h3><p>On Sunday, September 27, 2026, Reverend Pastor Nelson delivered the third part of the teaching on the principles and laws of the tithe. The message turned on a foundational truth: <strong>“Paying the tithe is an obligation, not a matter of diligence. Faithfulness in the tithe is essential to the fulfillment of the Lord's covenant.”</strong></p><h3>1. Something consecrated to the Lord (Leviticus 27:30, 34)</h3><p>According to Leviticus 27:30, <em>“Every tithe of the land, whether of the seed of the land or of the fruit of the trees, is the Lord's; it is holy to the Lord.”</em></p><p>The tithe is not a mere optional recommendation, nor a favor we do for God. It is a sacred ordinance that seals the covenant. To withhold what belongs to God is to break the spiritual agreement that secures our blessing.</p><h3>2. Returning to the covenant, and the rebuke of the devourer (Malachi 3:7-12)</h3><p>In Malachi 3:7, God issues a pressing call to His people: <em>“Return to me, and I will return to you.”</em> When the people ask how, the Lord makes clear that returning to Him includes obedience in tithes and offerings.</p><p>When we bring the whole tithe into the storehouse:</p><ul><li><p><strong>God opens the windows of heaven:</strong> He pours out blessing in abundance, granting favor, wisdom, and creative ideas for our work.</p></li><li><p><strong>God rebukes the devourer:</strong> He protects our families, our income, and our possessions from needless financial loss, recurring illness, and waste.</p></li></ul><h3>3. Practical application and faithfulness of heart</h3><p>The tithe is exactly 10 percent of our earnings. It is to be brought with joy and regularity to the local church where the believer is fed spiritually. It is through this steady faithfulness that we allow God's covenant to be fulfilled fully in our lives.</p>`;

const TAKE_AWAY_THE_STONE = `<p>During the Sunday service of October 4, 2026, at Voice of Freedom Church, Reverend Nelson opened a striking series of teachings entitled “Take Away the Stone.” Drawing on the account of Lazarus's resurrection in John 11:32-42, he recalled a foundational spiritual truth: God wants to work powerfully in your life, yet we often set up barriers ourselves that block His action.</p><h2>1. Martha's distraction and spiritual blindness</h2><p>Before going to the tomb, the Reverend highlighted Martha's attitude. Though welcoming and devoted, Martha was often distracted by many tasks, unlike Mary, who sat at Jesus' feet.</p><ul><li><p>Spiritual distraction: Working for God, or staying very busy in ministry, without spending time in His presence and in prayer leaves the Christian empty. The work of God is not done apart from the power of the Holy Spirit.</p></li><li><p>Doubt before the Creator: At the tomb, Martha said, “Lord, by this time there will be an odor, for he has been dead four days.” She stopped at human and medical realities. But Jesus answered her, “Did I not tell you that if you believed you would see the glory of God?”</p></li></ul><h2>2. What is “the stone”?</h2><p>Jesus came to the tomb and was deeply moved within when He saw the stone blocking the way. Reverend Nelson explained that the Lord's hand is not too short to save, but our own barriers keep Him from reaching us. Among the stones we build ourselves, the message brought these to light:</p><ul><li><p>Doubt and lack of faith: canceling one's own prayers by confessing negative words.</p></li><li><p>Immorality and hidden sin: fornication, sexual immorality, alcoholism, or masturbation, which create a spiritual separation.</p></li><li><p>Unforgiveness and offense: holding a grudge against one's neighbor while claiming to pray to God.</p></li><li><p>Lying, theft, and corruption: manipulating figures, falsifying documents, or paying bribes at work or in business.</p></li><li><p>Rebellion and seeds of discord: speaking ill of the church, discouraging brothers and sisters, or rebelling against established authority.</p></li></ul><h2>3. The responsibility to take away the stone</h2><p>God will not come and remove the stone you have set in place yourself. In verse 39, Jesus gives a clear command to the people standing there: “Take away the stone.”</p><p>When you decide to repent sincerely, to abandon compromise, and to remove these obstacles:</p><ol><li><p><strong>The grace of God finds you and reaches you.</strong></p></li><li><p><strong>The way is opened for miracles to be revealed, and for what was dead in your life to be raised.</strong></p></li><li><p><strong>You enjoy the promises of the Lord in full.</strong></p></li></ol><blockquote><p><em>The stone does not only block your life; it blocks the way for God, who wants to draw near to you. Take away the stone, and you will see the glory of God!</em> — Reverend Nelson</p></blockquote>`;

const EVENTS = [
  {
    title: "Conseil & Prière",
    titleEn: "Counsel & Prayer",
    descriptionEn: "Meet the father of the house and receive his counsel and his prayers.",
    locationEn: "VOF Church",
  },
  {
    title: "Culte dominical",
    titleEn: "Sunday Service",
    descriptionEn: "The Sunday worship service.",
    locationEn: "VOF Church",
  },
  {
    title: "Célébration du 15e anniversaire de l'église",
    titleEn: "Celebration of the Church's 15th Anniversary",
    descriptionEn: "15 years are not 15 days.\n15 years of life, 15 years of prosperity.",
    locationEn: "VOF Church",
  },
  {
    title: "Etude biblique",
    titleEn: "Bible Study",
    descriptionEn: "A time of prayer and teaching to strengthen the people of God.",
    locationEn: "VOF Church",
  },
  {
    title: "Guerriers de prières",
    titleEn: "Prayer Warriors",
    descriptionEn: "Come and pray, and fill the atmosphere with the fire of heaven.",
    locationEn: "VOF Church",
  },
  {
    title: "Jeûne & Prières",
    titleEn: "Fasting & Prayer",
    descriptionEn: "Begin the month by committing it to God.",
    locationEn: "VOF Church",
  },
  {
    title: "Prière et Témoignage",
    titleEn: "Prayer and Testimony",
    descriptionEn:
      "A time of prayer and sharing in which the Spirit of the Lord moves among His people and strengthens them.",
    locationEn: "VOF Church",
  },
  {
    title: "Veillées de prière",
    titleEn: "Prayer Vigils",
    descriptionEn: "Come and pray, and be filled with the fire of the Holy Spirit.",
    locationEn: "VOF Church",
  },
] as const;

const ARTICLES = [
  {
    slug: "principes-et-lois-de-la-dime-partie-II",
    titleEn:
      "The Principles and Laws of the Tithe: A Spiritual Covenant for Prosperity and Protection (Part II)",
    contentEn: TITHE_PART_II,
  },
  {
    slug: "principes-et-lois-de-la-dime-partie-III",
    titleEn:
      "The Principles and Laws of the Tithe: A Spiritual Covenant for Prosperity and Protection (Part III)",
    contentEn: TITHE_PART_III,
  },
  {
    slug: "otez-la-pierre-partie-1",
    titleEn: "Take Away the Stone: Let the Grace of God Reach You",
    contentEn: TAKE_AWAY_THE_STONE,
  },
] as const;

const DEPARTMENTS = [
  {
    slug: "chorale",
    nameEn: "Choir",
    descriptionEn:
      "Leads the congregation into God's presence through lively praise and deep worship. Joining spiritual consecration with a pursuit of musical excellence, the team prepares hearts to receive the Word during services.",
  },
  {
    slug: "guerriers-de-priere",
    nameEn: "Prayer Warriors",
    descriptionEn:
      "A spiritual pillar of the church, this group is devoted to fervent intercession and continual prayer. They stand in the gap for the needs of the congregation, for families, for matters of impact, and for the vision of the ministry.",
  },
  {
    slug: "protocole",
    nameEn: "Protocol",
    descriptionEn:
      "Watches over good order, the warm welcome of speakers and honored guests, and the practical and security arrangements for services and events. With care, discretion, and a high sense of service, this team provides a calm, harmonious, and respectful setting so that every gathering can unfold well.",
  },
  {
    slug: "jeunesse",
    nameEn: "Youth",
    descriptionEn:
      "A dynamic space devoted to the spiritual, personal, and social growth of young people. Through teaching suited to them, times of fellowship, and projects of impact, it prepares this generation to live an authentic and committed faith.",
  },
  {
    slug: "enfants",
    nameEn: "Children",
    descriptionEn:
      "Passes on the foundational truths of the Bible to the youngest in a joyful, clear, and caring way. In a safe and warm setting, children discover the love of God and begin to build their faith from an early age.",
  },
  {
    slug: "media",
    nameEn: "Media & Communication",
    descriptionEn:
      "Puts technology and creativity in the service of the Gospel. The team handles sound, live broadcasts, video recording, photography, and social media so that messages and events reach beyond the walls of the church.",
  },
  {
    slug: "femmes",
    nameEn: "Women",
    descriptionEn:
      "Gathers women for times of edification, prayer, and mutual support. This department encourages every woman to flourish in her faith, her family life, and her responsibilities, and to be a source of blessing in society.",
  },
  {
    slug: "suivi-et-visitation",
    nameEn: "Follow-up and Visitation",
    descriptionEn:
      "Provides spiritual care and brotherly support for members and newcomers. Through visits, phone calls, and attentive listening, this team makes sure each person feels surrounded, heard, and fully welcomed.",
  },
  {
    slug: "nettoyage",
    nameEn: "Cleaning",
    descriptionEn:
      "Looks after the cleanliness, hygiene, and ongoing care of the church premises before, during, and after every gathering. Through devoted and often unseen service, this team prepares a healthy, welcoming setting fit for worship, reflecting the excellence and honor due to the house of God.",
  },
] as const;

const TESTIMONIALS = [
  {
    authorName: "Sœur Aïssatou M.",
    contentEn:
      "After three years of illness, the doctors no longer had any hope. During a prayer vigil at VOF, I felt a deep peace. Today my test results are normal, and I give glory to God for my healing.",
  },
  {
    authorName: "Frère Moussa I.",
    contentEn:
      "I had been without work for more than two years. The church prayed with me and encouraged me not to give up. A month later, I received a job offer I had not even sought. God is faithful!",
  },
  {
    authorName: "Famille Abdou",
    contentEn:
      "Our home was on the verge of breaking apart. Through the teachings on the family and the care of the pastors, reconciliation came. We now pray together every evening.",
  },
  {
    authorName: "Sœur Fati H.",
    contentEn:
      "Thank You, Lord! I was set free from the fear that had paralyzed me since childhood. Every Sunday, the Word strengthens my faith, and I now serve with joy in the children's department.",
  },
  {
    authorName: "Frère Ibrahim S.",
    contentEn:
      "I arrived at VOF by chance one Sunday, discouraged and without direction. There I found a family, a clear word, and a freedom in Christ I had never known. My life has completely changed: I gave my heart to Jesus, I am baptized, and I now serve on the welcome team. May all the glory return to God!",
  },
] as const;

const PROJECTS = [
  {
    slug: "celebration-des-15-ans-de-l-eglise",
    titleEn: "Celebration of the Church's 15th Anniversary",
    descriptionEn:
      "Let us celebrate 15 years of grace, faithfulness, and impact in Christ! Together, let us do our part to support the Jubilee and to fund our expansion and equipment projects for the years ahead.",
    categoryEn: "Other",
  },
] as const;

/** Clés françaises déjà renseignées, et leur version anglaise. */
const SETTINGS_EN: Record<string, string> = {
  church_tagline_en: "A center of solutions in Jesus Christ",
  hero_badge_en: "Sunday Service",
  hero_title_en: "Welcome to Voice of Freedom Church",
  hero_description_en: "A center of solutions in Jesus Christ",
  hero_primary_cta_text_en: "Discover VOF",
  welcome_tagline_en: "A WORD FROM THE FATHER OF THE HOUSE",
  welcome_content_en:
    "Welcome to the Voice of Freedom family. Here, everyone finds a place, a word, and freedom in Christ. We look forward to welcoming you with joy, Sunday after Sunday, to worship, grow, and serve together.",
  welcome_subtext_en: "Reverend Nelson Nwene, Father of the house",
  footer_description_en:
    "A center of solutions in Jesus Christ. Join us for worship — 09:00–11:30.",
  footer_copyright_en: "© 2026 Voice of Freedom Church. All rights reserved.",
  footer_schedule_title_en: "Service times",
  about_annual_verse_text_en: "A year of turnarounds, surprises, and remembrance",
  about_pillar_1_title_en: "Turnaround",
  about_pillar_1_desc_en:
    "“When the Lord restored the fortunes of Zion, we were like those who dream. Then our mouth was filled with laughter, and our tongue with shouts of joy.”",
  about_pillar_2_title_en: "Surprise",
  about_pillar_2_desc_en:
    "“But Peter continued knocking, and when they opened, they saw him and were amazed.”",
  about_pillar_3_title_en: "Remembrance",
  about_pillar_3_desc_en:
    "“Then God remembered Rachel, and God listened to her and opened her womb. She conceived and bore a son. Then she said, ‘God has taken away my reproach.’”",
};

async function requireCount(label: string, count: number) {
  if (count === 0) {
    throw new Error(`Aucun enregistrement trouvé pour : ${label}`);
  }
}

async function main() {
  for (const event of EVENTS) {
    const result = await prisma.event.updateMany({
      where: { title: event.title },
      data: {
        titleEn: event.titleEn,
        descriptionEn: event.descriptionEn,
        locationEn: event.locationEn,
      },
    });
    await requireCount(`événement « ${event.title} »`, result.count);
  }

  for (const article of ARTICLES) {
    const result = await prisma.article.updateMany({
      where: { slug: article.slug },
      data: {
        titleEn: article.titleEn,
        contentEn: article.contentEn,
      },
    });
    await requireCount(`enseignement « ${article.slug} »`, result.count);
  }

  for (const department of DEPARTMENTS) {
    const result = await prisma.department.updateMany({
      where: { slug: department.slug },
      data: {
        nameEn: department.nameEn,
        descriptionEn: department.descriptionEn,
      },
    });
    await requireCount(`département « ${department.slug} »`, result.count);
  }

  for (const testimonial of TESTIMONIALS) {
    const result = await prisma.testimonial.updateMany({
      where: { authorName: testimonial.authorName },
      data: { contentEn: testimonial.contentEn },
    });
    await requireCount(`témoignage « ${testimonial.authorName} »`, result.count);
  }

  for (const project of PROJECTS) {
    const result = await prisma.project.updateMany({
      where: { slug: project.slug },
      data: {
        titleEn: project.titleEn,
        descriptionEn: project.descriptionEn,
        categoryEn: project.categoryEn,
      },
    });
    await requireCount(`projet « ${project.slug} »`, result.count);
  }

  for (const [key, value] of Object.entries(SETTINGS_EN)) {
    await prisma.siteSettings.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  console.log(
    `✅ Traductions anglaises enregistrées : ${EVENTS.length} événements, ${ARTICLES.length} enseignements, ${DEPARTMENTS.length} départements, ${TESTIMONIALS.length} témoignages, ${PROJECTS.length} projet, ${Object.keys(SETTINGS_EN).length} paramètres.`,
  );
}

main()
  .catch((error) => {
    console.error("❌ Échec de l'injection des traductions :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
