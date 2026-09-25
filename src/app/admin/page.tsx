import { getAdminOverview } from "@/app/admin/actions";
import { adminNavigation } from "@/config/navigation";
import { AdminPageHeader } from "@/ui/modules/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();

  const stats = [
    { label: "Événements", value: overview.events, href: "/admin/evenements" },
    { label: "Médias", value: overview.media, href: "/admin/medias" },
    { label: "Enseignements", value: overview.articles, href: "/admin/enseignements" },
  ];

  return (
    <div>
      <AdminPageHeader
        kicker="Administration"
        title="Vue d’ensemble"
        description="Pilotage éditorial de l’agenda, des médias, des enseignements et de l’identité visuelle."
      />

      {!overview.ok ? (
        <p className="mt-6 border border-burgundy bg-white px-4 py-3 text-sm text-burgundy">
          Base injoignable. Démarrez PostgreSQL avec{" "}
          <code className="font-mono">docker compose up -d</code> puis{" "}
          <code className="font-mono">npx prisma db push</code>.
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="border border-burgundy/15 bg-white p-5 transition-colors hover:border-burgundy"
          >
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-burgundy/70">
              {stat.label}
            </p>
            <p className="mt-3 font-heading text-4xl font-extrabold text-burgundy">{stat.value}</p>
          </Link>
        ))}
      </div>

      <ul className="mt-10 divide-y divide-burgundy/10 border-y border-burgundy/10">
        {adminNavigation.slice(1).map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between py-4 font-heading text-lg font-bold text-burgundy hover:text-gold"
            >
              {item.label}
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
