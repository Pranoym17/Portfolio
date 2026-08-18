import { HeroTransition } from "@/components/hero/HeroTransition";
import { SelectedWork } from "@/components/projects/SelectedWork";
import { CurrentlyBuildingStrip } from "@/components/current/CurrentlyBuildingStrip";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const contactFormEnabled = Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL,
  );

  return (
    <main>
      <HeroTransition />
      <SelectedWork />
      <CurrentlyBuildingStrip />
      <ExperienceTimeline />
      <SkillsGrid />
      <AboutSection />
      <ContactSection formEnabled={contactFormEnabled} />
      <Footer />
    </main>
  );
}
