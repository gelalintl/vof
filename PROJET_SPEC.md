# Spécifications Exhaustives — Site Web Église VOF (Voice Of Freedom)

## 1. Vue d'Ensemble & Stack Technique

* **Projet :** Plateforme Web Officielle d'Église VOF (Institutionnel, Médias & Vie Communautaire)
* **Stack Principale :** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Librairies Graphiques & Média :** Lucide React, Framer Motion, `clsx` & `tailwind-merge`
* **Performance Mobile :** Façade `YoutubeLiteEmbed.tsx` pour l'aperçu vidéo et le chargement différé des iFrames (optimisation réseaux 3G/4G).
* **Responsivité Globale :** Mobile-First intégral (drawer mobile, modales adaptatives, grilles fluides).

---

## 2. Horaires officiels des rassemblements

| Jour | Horaire | Rendez-vous |
| :--- | :--- | :--- |
| **Dimanche** | 09h00 | Culte dominical |
| **Mardi** | 19h00 | Rassemblement de prière |
| **Jeudi** | 19h00 | Rassemblement de témoignages |
| **2e et dernier vendredi du mois** | 23h00 – 05h00 | Veillée de prières |
| **1er, 2e et 3e jours du mois** | 19h00 | Rassemblement de jeûne et prière |

### Événements récurrents — `generateMonthlyEvents`

Tous les rendez-vous récurrents sont calculés **en un seul endroit** : `src/utils/date/getMonthlyEvents.ts`, via `generateMonthlyEvents(year, month)` (mois 1–12). Le calendrier (`CalendarWidget`) se contente d'afficher le tableau retourné (titre, date, heure, type/couleur) : aucun calcul de dates métier dans l'UI.

Règles générées chaque mois :

* **Mardi 19h00** — Rassemblement de prière (violet).
* **Jeudi 19h00** — Rassemblement de témoignages (ambre).
* **2e et dernier vendredi, 23h00 – 05h00** — Veillée de prières (rouge).
* **Jeûne mensuel, 19h00** — trois jours consécutifs (rouge).
  * Défaut : 1er, 2e et 3e jours du mois.
  * Report : si le 1er tombe vendredi, samedi, dimanche ou lundi, le jeûne commence le **premier mardi du mois** (mardi, mercredi, jeudi).
* **Priorité** : si un jour de jeûne tombe un mardi ou un jeudi, le rassemblement hebdomadaire de ce jour est **omis**. Seul le jeûne est conservé.

Les dates du jeûne sont fournies par `getMonthlyFastingDates.ts`, consommées uniquement par `generateMonthlyEvents`.

---

## 3. Charte Visuelle & Tokens Tailwind

### Palette de Couleurs Officielle VOF

| Usage & Élément | Teinte Tailwind | Code Hex | Application Visuelle |
| :--- | :--- | :--- | :--- |
| **Primaire / Brand** | Violet Royal (`violet-700`) | `#6D28D9` | Headers, cartes enseignements, hero background |
| **Secondaire / Nav** | Bleu Ciel (`sky-600`) | `#0284C7` | Navbar, accents du logo, sous-titres, pôle jeunesse |
| **Accent & CTA** | Or Ambré (`amber-500`) | `#F59E0B` | Boutons de don, badges *"Culte dominical"*, séminaires |
| **Événements d'Impact** | Rouge Passion (`red-600`) | `#DC2626` | Séminaires spéciaux, conférences de combat/foi |
| **Fonds & Contrastes** | Slate 50 (`slate-50`) | `#F8FAFC` | Arrière-plans de section, cartes UI |
| **Texte Principal** | Slate 800 (`slate-800`) | `#1E293B` | Corps de texte (haute lisibilité) |

### Typographie (`tailwind.config.js`)
* **Titres (`font-heading`) :** `Plus Jakarta Sans` (Bold/ExtraBold 700/800, `tracking-tight`)
* **Corps de texte (`font-sans`) :** `Inter` (Regular/Medium 400/500, `leading-relaxed`)
* **Citations & Versets (`font-serif`) :** `Lora` (Italic)

---

## 4. Arborescence Modulaire Cible (`src/`)

```text
src/
├── api/
│   ├── contact/
│   ├── donations/
│   └── newsletter/
├── app/
│   ├── a-propos/
│   ├── contact/
│   ├── departements/
│   ├── don/
│   └── vie-de-leglise/
│       └── [slug]/
├── config/
│   ├── navigation.ts
│   └── site.ts
├── context/
│   ├── AudioPlayerContext.tsx
│   └── EventFilterContext.tsx
├── datas/
│   ├── departments.ts
│   ├── events.ts
│   ├── pastors.ts
│   └── sermons.ts
├── hooks/
│   ├── useAudioPlayer.ts
│   └── useEventFilter.ts
├── libs/
│   └── supabase.ts
├── types/
│   └── index.ts
├── ui/
│   ├── design-system/
│   │   ├── badge/
│   │   ├── button/
│   │   ├── logo/
│   │   ├── modal/
│   │   ├── spinner/
│   │   └── typography/
│   ├── components/
│   │   ├── CalendarWidget.tsx
│   │   ├── DonateModal.tsx          # Modale de don en FCFA (Violet/Or)
│   │   ├── Footer.tsx               # Footer 4 colonnes
│   │   ├── Header.tsx               # Bandeau supérieur VOF
│   │   ├── JoinDepartmentModal.tsx  
│   │   ├── Navbar.tsx               # Navigation sticky (Bleu Ciel / Violet)
│   │   └── YoutubeLiteEmbed.tsx     # Façade vidéo optimisée 3G/4G
│   ├── layouts/
│   │   ├── HeaderLayout.tsx
│   │   └── MainLayout.tsx
│   └── modules/
│       ├── a-propos/
│       │   └── PastoralTeam.tsx     # Équipe pastorale (Révérend Nelson, Past. Rose)
│       ├── contact/                 # Layout 100% vertical
│       ├── departements/
│       │   └── DepartmentAccordion.tsx # Accordéon masque nuage SVG
│       ├── events/
│       │   ├── CommentSection.tsx   
│       │   ├── EventCard.tsx        # Carte codée par couleur (Violet/Rouge/Or)
│       │   └── EventSlider.tsx      
│       └── home/
│           ├── HeroSection.tsx      # Thème d'accueil & appel aux cultes
│           ├── PracticalBanner.tsx  # Horaires (Dim. 9h, Mar. 19h, Jeu. 19h, veillées), Adresse, WhatsApp
│           └── WelcomeWord.tsx      # Mot du Révérend Nelson
└── utils/
    ├── date/
    │   ├── format.ts
    │   ├── getMonthlyEvents.ts        # generateMonthlyEvents : source unique des récurrents
    │   ├── getMonthlyFastingDates.ts  # Dates du jeûne (report ven.–lun. → 1er mardi)
    │   └── recurring.ts               # Adapter catalogue + generateMonthlyEvents
    └── formatters/