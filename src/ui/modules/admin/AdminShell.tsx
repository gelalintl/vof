import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
  logoSrc?: string | null;
  userEmail?: string;
}

export function AdminShell({ children, logoSrc, userEmail }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-cream text-[#2C2424] lg:flex">
      <AdminSidebar logoSrc={logoSrc} userEmail={userEmail} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
