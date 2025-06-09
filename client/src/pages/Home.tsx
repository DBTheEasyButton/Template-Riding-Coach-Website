import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoachingSection from "@/components/CoachingSection";
import AppSection from "@/components/AppSection";
import ClinicsSection from "@/components/ClinicsSection";
import TrainingVideosSection from "@/components/TrainingVideosSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import SponsorsSection from "@/components/SponsorsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Handle anchor navigation when page loads
    const hash = window.location.hash;
    if (hash) {
      // Wait for page to render then scroll to anchor
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <CoachingSection />
      <AppSection />
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
