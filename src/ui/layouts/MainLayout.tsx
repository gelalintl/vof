import { Footer } from "@/ui/components/Footer";
import { HeaderLayout } from "@/ui/layouts/HeaderLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderLayout />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
