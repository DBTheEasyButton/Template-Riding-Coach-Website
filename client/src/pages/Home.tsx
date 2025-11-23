import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ClinicsSection from "@/components/ClinicsSection";
import PodcastSection from "@/components/PodcastSection";
import SponsorsSection from "@/components/SponsorsSection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { organizationData, websiteData, localBusinessData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ArrowRight, Award, Users, Target, Calendar } from "lucide-react";
import danPhotoPath from "@assets/optimized/13_1749386080915.jpg";
import heroImageWebp from "@assets/optimized/hero-background.webp";
import heroImageJpg from "@assets/optimized/hero-background.jpg";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const { data: news = [] } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const seoConfig = getSEOConfig('/');

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        preloadImage={heroImageWebp}
        preloadImageJpeg={heroImageJpg}
      />
      <StructuredData type="Organization" data={organizationData} />
      <StructuredData type="Website" data={websiteData} />
      <StructuredData type="LocalBusiness" data={localBusinessData} />
      
      <Navigation />
      <HeroSection />
      <TestimonialsSection />
      <ClinicsSection />
      
      {/* Divider */}
      <div className="border-t-4 border-orange"></div>
      
      {/* About Preview Section */}
      <section id="about" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">About Dan</h2>
                <div className="w-24 h-1 bg-orange mb-8"></div>
              </div>
              <p className="text-lg text-dark leading-relaxed">
                With over 20 years of international competition experience, Dan Bizzarro brings unparalleled expertise to every training session. From working with British eventing legend William Fox-Pitt to competing at the highest international levels, Dan's journey is one of dedication and passion.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                In 2024 Dan was shortlisted for the Paris Olympic games, and in 2022 the Italian team finished 2nd at Nations Cup Boekelo - testament to his competitive excellence and expertise.
              </p>
              <Link href="/about">
                <Button className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-learn-more-about">
                  Learn More About Dan <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src={danPhotoPath} 
                alt="International eventing coach Dan Bizzarro with his competition horse, showcasing their partnership and training expertise" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t-4 border-navy"></div>

      {/* Services Preview Section */}
      <section id="coaching" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">Clinics, Private Lessons & Virtual Riding Lessons</h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-xl text-dark max-w-3xl mx-auto">
              Professional eventing instruction across all three disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Link href="/coaching/private-lessons" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="text-orange mb-4 flex justify-center">
                  <Users className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy">Private Horse Riding Lessons</h3>
                <p className="text-dark leading-relaxed mb-4">Expert one-on-one coaching in Oxfordshire for all levels—from amateur riders to competitors</p>
                <span className="text-orange font-semibold group-hover:underline inline-flex items-center">
                  Learn about private horse riding lessons <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/coaching/clinics" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="text-orange mb-4 flex justify-center">
                  <Award className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy">Clinics</h3>
                <p className="text-dark leading-relaxed mb-4">Show-jumping, polework, and cross country clinics with single-day training for all abilities</p>
                <span className="text-orange font-semibold group-hover:underline inline-flex items-center">
                  Join Dan's clinics <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/coaching/remote-coaching" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="text-orange mb-4 flex justify-center">
                  <Target className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy">Virtual Riding Lessons</h3>
                <p className="text-dark leading-relaxed mb-4">Remote equestrian coaching with video analysis—train anywhere, anytime</p>
                <span className="text-orange font-semibold group-hover:underline inline-flex items-center">
                  Discover virtual riding lessons <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/coaching">
              <Button className="bg-navy hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-view-all-services">
                View All Coaching Services <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t-4 border-orange"></div>

      {/* News Preview Section */}
      <section id="news" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">Latest News</h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-xl text-dark max-w-3xl mx-auto">
              Stay updated with competitions, training insights, and our equestrian journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {news.slice(0, 3).map((article) => (
              <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                  <OptimizedImage 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-navy mb-3">{article.title}</h3>
                    <p className="text-dark mb-4 line-clamp-3">{article.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/news">
              <Button className="bg-navy hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-view-all-news">
                View All News <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t-4 border-navy"></div>

      <PodcastSection />

      <SponsorsSection />
      <NewsletterSubscription />
      
      {/* Divider */}
      <div className="border-t-4 border-orange"></div>
      
      {/* Contact CTA Section */}
      <section id="contact" className="py-12 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Get in touch to book a coaching session or join an upcoming clinic
          </p>
          <Link href="/contact">
            <Button className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-contact-us">
              Contact Us <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
