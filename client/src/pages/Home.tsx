import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import CoachingSection from "@/components/CoachingSection";
import AppSection from "@/components/AppSection";
import ClinicsSection from "@/components/ClinicsSection";
import TrainingVideosSection from "@/components/TrainingVideosSection";
import PodcastSection from "@/components/PodcastSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import SponsorsSection from "@/components/SponsorsSection";
import ContactSection from "@/components/ContactSection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
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
      <TestimonialsSection />
      <ClinicsSection />
      <AboutSection />
      <CoachingSection />
      <AppSection />
      <TrainingVideosSection />
      <PodcastSection />
      <ScheduleSection />
      <GallerySection />
      <NewsSection />
      <SponsorsSection />
      <NewsletterSubscription />
      <ContactSection />
      <Footer />
    </div>
  );
}
