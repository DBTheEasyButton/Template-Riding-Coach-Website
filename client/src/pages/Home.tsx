import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import AchievementsSection from "@/components/AchievementsSection";
import CoachingSection from "@/components/CoachingSection";
import ClinicsSection from "@/components/ClinicsSection";
import TrainingVideosSection from "@/components/TrainingVideosSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import SponsorsSection from "@/components/SponsorsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <AchievementsSection />
      <CoachingSection />
      <ClinicsSection />
      <TrainingVideosSection />
      <ScheduleSection />
      <GallerySection />
      <NewsSection />
      <SponsorsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
