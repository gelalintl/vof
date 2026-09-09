import { MainLayout } from "@/ui/layouts/MainLayout";
import { HeroSection } from "@/ui/modules/home/HeroSection";
import { PracticalBanner } from "@/ui/modules/home/PracticalBanner";
import { WelcomeWord } from "@/ui/modules/home/WelcomeWord";
import { HighlightsGallery } from "@/ui/modules/home/HighlightsGallery";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <PracticalBanner />
      <WelcomeWord />
      <HighlightsGallery />
    </MainLayout>
  );
}
