import type { Metadata } from "next";
import { donateHero, donateQuote } from "@/datas/pageCopy";
import { ContentSection } from "@/ui/components/ContentSection";
import { DonateFlow } from "@/ui/components/DonateFlow";
import { PageHero } from "@/ui/components/PageHero";
import { QuoteBlock } from "@/ui/components/QuoteBlock";
import { SoftPanel } from "@/ui/components/SoftPanel";
import { MainLayout } from "@/ui/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Soutenir",
  description:
    "Soutenez l'œuvre Voice Of Freedom en FCFA : don unique ou récurrent, Mobile Money, carte bancaire ou virement RIB.",
};

export default function DonatePage() {
  return (
    <MainLayout>
      <PageHero {...donateHero} />
      <ContentSection width="narrow" padding="compact" align="center">
        <QuoteBlock {...donateQuote} />
        <SoftPanel>
          <DonateFlow layout="page" />
        </SoftPanel>
      </ContentSection>
    </MainLayout>
  );
}
