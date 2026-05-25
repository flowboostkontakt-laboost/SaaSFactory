import { NoiseOverlay } from "@/components/landing/noise-overlay";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { PhoneShowcase } from "@/components/landing/phone-showcase";
import { PipelineSection } from "@/components/landing/pipeline-section";
import { BentoGrid } from "@/components/landing/bento-grid";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-charcoal-950 text-offwhite">
      <NoiseOverlay />
      <LandingNav />
      <main className="relative z-10">
        <Hero />
        <LogoCloud />
        <div className="py-[clamp(3rem,8vh,6rem)]">
          <PhoneShowcase />
        </div>
        <PipelineSection />
        <BentoGrid />
        <Pricing />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
