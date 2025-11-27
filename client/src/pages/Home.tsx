import { useEffect, lazy, Suspense } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData, { organizationData, websiteData, localBusinessData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ArrowRight, Award, Users, Target, Calendar } from "lucide-react";
import danPhotoPath from "@assets/optimized/13_1749386080915.jpg";
import boekeloPodiumPhoto from "@assets/optimized/boekelo-podium.jpg";
import heroImageWebp from "@assets/optimized/hero-background.webp";
import heroImageJpg from "@assets/optimized/hero-background.jpg";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";

// Lazy load below-the-fold components for faster initial page load
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ClinicsSection = lazy(() => import("@/components/ClinicsSection"));
const PodcastSection = lazy(() => import("@/components/PodcastSection"));
const SponsorsSection = lazy(() => import("@/components/SponsorsSection"));
const NewsletterSubscription = lazy(() => import("@/components/NewsletterSubscription"));

// Simple loading skeleton component
function SectionSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid gap-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

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
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ClinicsSection />
      </Suspense>
      {/* Divider */}
      <div className="border-t-4 border-orange"></div>
      {/* About Preview Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">My Mission Is Simple</h2>
            <div className="w-24 h-1 bg-orange mx-auto"></div>
          </div>
          
          {/* First row: Image left, text right */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <img 
                src={danPhotoPath} 
                alt="Dan Bizzarro - International Event Rider and Coach"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
              />
            </div>
            
            <div className="space-y-6 text-lg text-dark leading-relaxed">
              <p>
                Over the course of my career, I've had the pleasure of riding every type of horse and coaching thousands of pupils. I've worked alongside some of the best riders and coaches in the world. At the same time, I've often found myself on challenging horses and had to discover ways to communicate clearly so that they could understand and progress.
              </p>
              
              <p>
                This is why I dedicated myself to developing a method that works with every horse and every rider. The Dan Bizzarro Method builds confidence and creates a fun environment where horses and riders can learn and work together effectively—delivering real results, whether you're aiming for a win or simply want to enjoy your time in the saddle.
              </p>
            </div>
          </div>
          
          {/* Second row: Text left, image right */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6 text-lg text-dark leading-relaxed">
              <p>
                Using this approach, I achieved some of my own dreams: representing my country at the 2025 European Championships and in several Nations Cup events. More importantly, my pupils have reached their goals, from winning competitions to discovering a deeper joy in their everyday rides.
              </p>
            </div>
            
            <div className="relative">
              <img 
                src={boekeloPodiumPhoto} 
                alt="Dan Bizzarro on the podium at Boekelo international eventing competition"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Highlighted Mission Statement */}
          <div className="mt-8 mb-12 p-8 bg-gradient-to-r from-orange/10 to-navy/10 rounded-2xl border-l-4 border-orange">
            <p className="text-xl md:text-2xl font-medium text-navy text-center italic leading-relaxed">
              "My mission is simple: to make horse riding easier to understand. I want to help riders and horses listen to each other, communicate with confidence, and build a partnership that's both effective and fun—so you can enjoy the journey and reach your goals together."
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/about">
              <Button className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-learn-more-about">
                Learn More About Dan <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Divider */}
      <div className="border-t-4 border-navy"></div>
      {/* What is the Dan Bizzarro Method Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">What is the Dan Bizzarro Method?</h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark max-w-3xl mx-auto">
              A simple, structured way of helping horses and riders understand each other better.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy mb-3">Clarity</h3>
              <p className="text-dark text-sm leading-relaxed">
                Riders learn how to give clear instructions that horses can easily understand and follow.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy mb-3">Confidence</h3>
              <p className="text-dark text-sm leading-relaxed">
                Horses learn to respond without tension, and both horse and rider start to enjoy the work more.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy mb-3">Communication</h3>
              <p className="text-dark text-sm leading-relaxed">
                Build a partnership that feels good through progressive training and thoughtful exercises.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-4xl mx-auto">
            <p className="text-dark leading-relaxed mb-4">The method comes from years of riding every type of horse, easy ones, tricky ones, sharp ones, and everything in between, and coaching thousands of riders at all levels.</p>
            <p className="text-dark leading-relaxed mb-4">
              It blends good basics, thoughtful exercises, and progressive training so that riders feel supported and horses feel understood.
            </p>
            <p className="text-navy font-medium leading-relaxed">
              Whether you ride for fun or want to be competitive, the goal is always the same: make riding easier to understand, build a partnership that feels good, and help you get the results you want without overcomplicating things.
            </p>
          </div>
        </div>
      </section>
      {/* Divider */}
      <div className="border-t-4 border-orange"></div>
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
            <Link href="/coaching/private-lessons" className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 h-full flex flex-col">
                <div className="text-orange mb-4 flex justify-center">
                  <Users className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy">Private Horse Riding Lessons</h3>
                <p className="text-dark leading-relaxed mb-4 flex-grow">Expert one-on-one coaching in Oxfordshire for all levels—from amateur riders to competitors</p>
                <span className="text-orange font-semibold group-hover:underline inline-flex items-center justify-center">
                  Learn about private horse riding lessons <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/coaching/clinics" className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 h-full flex flex-col">
                <div className="text-orange mb-4 flex justify-center">
                  <Award className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy">Clinics</h3>
                <p className="text-dark leading-relaxed mb-4 flex-grow">Show-jumping, polework, and cross country clinics with single-day training for all abilities</p>
                <span className="text-orange font-semibold group-hover:underline inline-flex items-center justify-center">
                  Join Dan's clinics <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/coaching/remote-coaching" className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 h-full flex flex-col">
                <div className="text-orange mb-4 flex justify-center">
                  <Target className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy">Virtual Riding Lessons</h3>
                <p className="text-dark leading-relaxed mb-4 flex-grow">Remote equestrian coaching with video analysis—train anywhere, anytime</p>
                <span className="text-orange font-semibold group-hover:underline inline-flex items-center justify-center">
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
              <Link key={article.id} href={`/news/${article.slug || article.id}`} className="h-full">
                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                  <OptimizedImage 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-navy mb-3">{article.title}</h3>
                    <p className="text-dark mb-4 line-clamp-3 flex-grow">{article.excerpt}</p>
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
      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <PodcastSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <SponsorsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <NewsletterSubscription />
      </Suspense>
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
