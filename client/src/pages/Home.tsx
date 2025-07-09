import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import CoachingSection from "@/components/CoachingSection";
import AppSection from "@/components/AppSection";
import ClinicsSection from "@/components/ClinicsSection";

// import TrainingVideosSection from "@/components/TrainingVideosSection";
import PodcastSection from "@/components/PodcastSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import SponsorsSection from "@/components/SponsorsSection";
import ContactSection from "@/components/ContactSection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { organizationData, websiteData } from "@/components/StructuredData";

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
      <SEOHead 
        title="Dan Bizzarro Method - Professional Eventing Coaching & Training"
        description="Expert eventing coaching from international event rider Dan Bizzarro. Stride calculator, readiness assessments, and professional equestrian training in Oxfordshire."
        keywords="eventing, horse training, dressage, show jumping, cross country, Dan Bizzarro, equestrian coaching, professional rider training"
        canonical="https://dan-bizzarro.replit.app/"
      />
      <StructuredData type="Organization" data={organizationData} />
      <StructuredData type="Website" data={websiteData} />
      
      <Navigation />
      <HeroSection />
      <TestimonialsSection />
      <ClinicsSection />
      <AboutSection />
      <CoachingSection />
      <AppSection />
      {/* Training Videos Section temporarily hidden */}
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
