import { getAdminOverview } from "@/app/sacristie/actions";
import { adminNavigation } from "@/config/navigation";
import { requirePageRole } from "@/lib/auth";
import { ACCOUNT_ROLES } from "@/lib/roles";
import { AdminPageHeader } from "@/ui/modules/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const user = await requirePageRole(ACCOUNT_ROLES);
  const overview = await getAdminOverview();
  const links = adminNavigation.filter((item) => item.allowedRoles.includes(user.role));

  const stats = [
    { label: "Événements", value: overview.events, href: "/sacristie/evenements" },
    { label: "Équipe pastorale", value: overview.pastors, href: "/sacristie/pasteurs" },
    { label: "Départements", value: overview.departments, href: "/sacristie/departements" },
    { label: "Médias", value: overview.media, href: "/sacristie/medias" },
    { label: "Enseignements", value: overview.articles, href: "/sacristie/enseignements" },
    { label: "Projets", value: overview.projects, href: "/sacristie/projets" },
    { label: "Dons en attente", value: overview.pendingDonations, href: "/sacristie/dons" },
  ].filter((stat) => links.some((item) => item.href === stat.href));

  return (
    <div>
      <AdminPageHeader
        kicker="Administration"
        title="Vue d’ensemble"
        description="Pilotage éditorial de l’agenda, des médias, des enseignements et de l’identité visuelle."
      />

      {!overview.ok ? (
        <p className="mt-6 border border-red-200 bg-white px-4 py-3 text-sm text-red-700">
          Base injoignable. Démarrez PostgreSQL avec{" "}
          <code className="font-mono">docker compose up -d</code> puis{" "}
          <code className="font-mono">npx prisma db push</code>.
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#6d28d9]">
              {stat.label}
            </p>
            <p className="mt-3 font-heading text-4xl font-extrabold text-slate-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <ul className="mt-10 divide-y divide-slate-100 border-y border-slate-200">
        {links.filter((item) => item.href !== "/sacristie").map((item) => (
            <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center justify-between py-4 font-heading text-lg font-bold text-slate-900 hover:text-[#6d28d9]"
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
