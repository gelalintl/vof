import { requirePageRole } from "@/lib/auth";
import { CONTENT_ROLES } from "@/lib/roles";

export default async function MediaSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRole(CONTENT_ROLES);
  return children;
}
