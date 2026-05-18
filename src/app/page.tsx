import { getCurrentPhase } from "@/lib/festival/phase";
import { SkipLink } from "@/components/shared/SkipLink";
import { SiteNav } from "@/components/marketing/SiteNav";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SiteCards } from "@/components/marketing/SiteCards";
import { PracticalStrip } from "@/components/marketing/PracticalStrip";
import { WhyExistsSection } from "@/components/marketing/WhyExistsSection";
import { SaveTheDate } from "@/components/marketing/SaveTheDate";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function Home() {
  const phase = getCurrentPhase();

  return (
    <>
      <SkipLink />
      <SiteNav phase={phase} />
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection phase={phase} />
        <SiteCards />
        <PracticalStrip />
        <WhyExistsSection />
        <SaveTheDate />
      </main>
      <SiteFooter />
    </>
  );
}
