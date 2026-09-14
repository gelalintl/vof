import type { Metadata } from "next";
import { donateHero, donateQuote } from "@/datas/pageCopy";
import { QuoteBlock } from "@/ui/components/content";
import { DonateFlow } from "@/ui/components/forms";
import { ContentSection, PageHero, SoftPanel } from "@/ui/components/layout";
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
