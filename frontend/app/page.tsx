import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { WhyCronosQSection } from "@/components/landing/WhyCronosQSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#09090B]">
      {/* Top Navbar */}
      <LandingNav />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ArchitectureSection />
        <WhyCronosQSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}