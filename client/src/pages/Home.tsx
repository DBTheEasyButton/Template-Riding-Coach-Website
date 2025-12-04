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
import { ArrowRight, Award, Users, Target, Calendar, CheckCircle, AlertTriangle, Lightbulb, TrendingUp, Video, Link2Off, Zap, Scale, Frown, TrendingDown, XCircle } from "lucide-react";
import boekeloPodiumPhotoJpg from "@assets/optimized/boekelo-podium.jpg";
import boekeloPodiumPhotoWebp from "@assets/optimized/boekelo-podium.webp";
import boekeloPodiumMobileJpg from "@assets/optimized/boekelo-podium-mobile.jpg";
import boekeloPodiumMobileWebp from "@assets/optimized/boekelo-podium-mobile.webp";
import heroImageWebp from "@assets/optimized/hero-background.webp";
import heroImageJpg from "@assets/optimized/hero-background.jpg";
import privateLessonsImage from "@assets/optimized/private-lessons-clinic.jpg";
import carouselClinic2Jpg from "@assets/optimized/carousel-clinic-2.jpg";
import blenheimDressageJpg from "@assets/optimized/blenheim-dressage-home.jpg";
import blenheimDressageWebp from "@assets/optimized/blenheim-dressage-home.webp";
import blenheimDressageMobileJpg from "@assets/optimized/blenheim-dressage-home-mobile.jpg";
import blenheimDressageMobileWebp from "@assets/optimized/blenheim-dressage-home-mobile.webp";
import hartpuryOpenJpg from "@assets/optimized/hartpury-cross-country-home.jpg";
import hartpuryOpenWebp from "@assets/optimized/hartpury-cross-country-home.webp";
import hartpuryOpenMobileJpg from "@assets/optimized/hartpury-cross-country-home-mobile.jpg";
import hartpuryOpenMobileWebp from "@assets/optimized/hartpury-cross-country-home-mobile.webp";
import coachingSessionJpg from "@assets/optimized/coaching-session-home.jpg";
import coachingSessionWebp from "@assets/optimized/coaching-session-home.webp";
import coachingSessionMobileJpg from "@assets/optimized/coaching-session-home-mobile.jpg";
import coachingSessionMobileWebp from "@assets/optimized/coaching-session-home-mobile.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";

const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ClinicsSection = lazy(() => import("@/components/ClinicsSection"));
const PodcastSection = lazy(() => import("@/components/PodcastSection"));
const SponsorsSection = lazy(() => import("@/components/SponsorsSection"));
const NewsletterSubscription = lazy(() => import("@/components/NewsletterSubscription"));

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
    queryKey: ['/api/news', { limit: 3 }],
    queryFn: () => fetch('/api/news?limit=3').then(res => res.json()),
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const seoConfig = getSEOConfig('/');

  const problemPoints = [
    "Horse not listening to the leg",
    "Unbalanced or inconsistent canter",
    "Rushing at fences or stopping",
    "Tension, spooking or loss of focus",
    "Contact issues: leaning, hollowing, dropping the neck",
    "Struggling to ride straight lines or accurate turns"
  ];

  const successBenefits = [
    "More balanced and adjustable canter",
    "Softer, more consistent contact",
    "Clear reactions to the leg and hand",
    "Less rushing, less spooking, less tension",
    "Safer, more confident jumping",
    "Better accuracy and straightness",
    "A horse who works with you — not against you",
    "A rider who knows exactly what to work on"
  ];

  const failurePoints = [
    { text: "Ongoing contact issues", icon: Link2Off },
    { text: "Rushing or stopping at fences", icon: Zap },
    { text: "Loss of balance and straightness", icon: Scale },
    { text: "More spooking and tension", icon: AlertTriangle },
    { text: "No clear progression in flatwork or jumping", icon: TrendingDown },
    { text: "Frustration and lack of confidence", icon: Frown }
  ];

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
      {/* SECTION 2 — PROBLEM STATEMENT */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
              Most Riders Work Hard… But Still Feel Stuck
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          
          <p className="text-lg text-dark leading-relaxed mb-8 text-center">
            If you're dealing with a strong horse, a spooky horse, a lazy horse, or one that rushes into fences or leans on the contact, you're not alone. Many riders in Oxfordshire and across the UK feel unsure what to fix first, or how to improve balance, straightness, transitions and confidence. Without a clear training method, progress becomes unpredictable and frustrating.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {problemPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <AlertTriangle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                <span className="text-dark">{point}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-orange/10 to-navy/10 rounded-2xl p-6 md:p-8 border-l-4 border-orange">
            <p className="text-lg md:text-xl text-navy font-medium text-center italic">
              "Riding shouldn't feel confusing. You deserve clear steps that actually help your horse understand you."
            </p>
          </div>
        </div>
      </section>
      {/* SECTION 3 — GUIDE (Empathy + Authority) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
              You're Not Doing Anything Wrong — You Just Need a Clearer System
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto"></div>
          </div>
          
          {/* First row: Text left, Blenheim Dressage right (mobile: text then image) */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 order-1">
              <p className="text-lg text-dark leading-relaxed">
                I've coached thousands of riders who felt exactly like you do now. Horses that rush, drift, get tight, ignore the inside leg or lose focus. Riders who feel they're always correcting something but never getting ahead of the problem. I understand how frustrating that feels.
              </p>
            </div>
            
            <div className="relative order-2">
              <picture>
                <source srcSet={blenheimDressageMobileWebp} type="image/webp" media="(max-width: 768px)" />
                <source srcSet={blenheimDressageMobileJpg} type="image/jpeg" media="(max-width: 768px)" />
                <source srcSet={blenheimDressageWebp} type="image/webp" />
                <img 
                  src={blenheimDressageJpg} 
                  alt="Dan Bizzarro competing in dressage at Blenheim Palace International Horse Trials"
                  className="rounded-2xl shadow-2xl w-full"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
          
          {/* Second row: Hartpury left, Text right (mobile: text then image) */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative order-2 md:order-1">
              <picture>
                <source srcSet={hartpuryOpenMobileWebp} type="image/webp" media="(max-width: 768px)" />
                <source srcSet={hartpuryOpenMobileJpg} type="image/jpeg" media="(max-width: 768px)" />
                <source srcSet={hartpuryOpenWebp} type="image/webp" />
                <img 
                  src={hartpuryOpenJpg} 
                  alt="Dan Bizzarro competing in cross country at Hartpury Open Championship"
                  className="rounded-2xl shadow-2xl w-full"
                  loading="lazy"
                />
              </picture>
            </div>
            
            <div className="space-y-6 order-1 md:order-2">
              <p className="text-lg text-dark leading-relaxed">
                With more than 20 years of experience coaching dressage, show jumping and event riders, having competed at the highest level in eventing — represented Italy in Nations Cups and the 2025 European Championships, shortlisted for the 2024 Paris Olympics — and having worked with world-class riders and coaches (William Fox-Pitt, Caroline Moore, Ian Woodhead), I've developed a simple method that works for every horse and every rider.
              </p>
            </div>
          </div>
          
          {/* Third row: Text left, Podium right (mobile: text then image) */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-1">
              <p className="text-lg text-navy font-medium leading-relaxed">
                The Dan Bizzarro Method gives you clarity, improves communication, and builds real confidence — whether you ride for fun or compete at the highest level.
              </p>
              
              <p className="text-lg text-dark leading-relaxed">
                My approach focuses on the fundamentals: balance, rhythm, straightness and clear aids. When these are in place, everything else becomes easier — from flatwork to jumping to competing under pressure.
              </p>
            </div>
            
            <div className="relative order-2">
              <picture>
                <source srcSet={boekeloPodiumMobileWebp} type="image/webp" media="(max-width: 768px)" />
                <source srcSet={boekeloPodiumMobileJpg} type="image/jpeg" media="(max-width: 768px)" />
                <source srcSet={boekeloPodiumPhotoWebp} type="image/webp" />
                <img 
                  src={boekeloPodiumPhotoJpg} 
                  alt="Dan Bizzarro on the podium at Boekelo international eventing competition"
                  className="rounded-2xl shadow-2xl w-full"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 4 — THE PLAN (3 STEPS) */}
      <section id="method" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">A Simple Plan That Works for Everyone</h2>
            <div className="w-24 h-1 bg-orange mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <Lightbulb className="w-8 h-8 text-orange" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Get Clarity</h3>
              <p className="text-dark leading-relaxed">
                We look at your horse's balance, reactions, focus and way of going. You finally understand what's causing the problem — not just the symptoms.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <Target className="w-8 h-8 text-orange" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Follow the Method</h3>
              <p className="text-dark leading-relaxed">
                You use straightforward exercises that improve contact, rhythm, gears, lines and self-carriage. No overcomplication. No gimmicks.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <TrendingUp className="w-8 h-8 text-orange" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Build Confidence</h3>
              <p className="text-dark leading-relaxed">
                You and your horse develop habits that actually stick. Each week feels easier, clearer and more enjoyable.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/coaching/private-lessons">
              <Button className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-book-lesson-plan">
                Book a Lesson <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/coaching/clinics">
              <Button className="bg-navy hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-book-clinic-plan">
                Book a Clinic <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* SECTION 5 — SUCCESS: THE TRANSFORMATION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
              Imagine Riding a Horse Who Listens, Stays Soft and Feels Easy to Train
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-10">
            <div className="order-1">
              <div className="grid gap-3">
                {successBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-dark">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative order-2">
              <picture>
                <source srcSet={coachingSessionMobileWebp} type="image/webp" media="(max-width: 768px)" />
                <source srcSet={coachingSessionMobileJpg} type="image/jpeg" media="(max-width: 768px)" />
                <source srcSet={coachingSessionWebp} type="image/webp" />
                <img 
                  src={coachingSessionJpg} 
                  alt="Dan Bizzarro coaching a rider during a lesson"
                  className="rounded-2xl shadow-2xl w-full"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border-l-4 border-green-600">
            <p className="text-lg md:text-xl text-navy font-medium text-center italic">
              "This isn't about being brave. It's about having clarity — so your horse becomes easier, softer and more confident every time you ride."
            </p>
          </div>
        </div>
      </section>
      {/* SECTION 6 — FAILURE (GENTLE WARNING) */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
              Without a Clear Method, the Problems Don't Go Away
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          
          <p className="text-lg text-dark leading-relaxed mb-8 text-center">
            When riders guess their way through schooling, the same issues repeat themselves. Horses build bad habits, riders lose confidence, and training becomes a cycle of managing problems instead of improving them.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {failurePoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-gray-600 mt-1">{point.text}</span>
                </div>
              );
            })}
          </div>
          
          <p className="text-xl text-navy font-medium text-center">
            It doesn't need to be like this.
          </p>
        </div>
      </section>
      {/* SECTION 7 — SERVICES (Three Entry Points) */}
      <section id="coaching" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
              Choose How You Want to Start
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={privateLessonsImage} 
                  alt="Private riding lessons in Oxfordshire"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-playfair font-bold text-navy mb-3">Private Riding Lessons (Oxfordshire)</h3>
                <p className="text-dark leading-relaxed mb-6 flex-grow">
                  Personal, focused coaching tailored to you and your horse. Ideal for improving balance, straightness, transitions and jumping technique.
                </p>
                <Link href="/coaching/private-lessons">
                  <Button className="w-full bg-orange hover:bg-orange-hover text-white py-3 rounded-lg font-medium transition-all duration-300" data-testid="button-book-private">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={carouselClinic2Jpg} 
                  alt="Horse riding clinics across the UK"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-playfair font-bold text-navy mb-3">Clinics Across the UK</h3>
                <p className="text-dark leading-relaxed mb-6 flex-grow">
                  Small-group coaching designed to build confidence, improve accuracy and develop clear communication with your horse.
                </p>
                <Link href="/coaching/clinics">
                  <Button className="w-full bg-orange hover:bg-orange-hover text-white py-3 rounded-lg font-medium transition-all duration-300" data-testid="button-book-clinic">
                    Book a Clinic
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
              <div className="h-48 overflow-hidden bg-gradient-to-br from-navy to-slate-700 flex items-center justify-center">
                <Video className="w-20 h-20 text-white/80" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-playfair font-bold text-navy mb-3">Virtual Riding Lessons</h3>
                <p className="text-dark leading-relaxed mb-6 flex-grow">
                  Real-time coaching using Pivo. Improve your riding from anywhere in the world with clear feedback and simple exercises.
                </p>
                <Link href="/coaching/remote-coaching">
                  <Button className="w-full bg-orange hover:bg-orange-hover text-white py-3 rounded-lg font-medium transition-all duration-300" data-testid="button-book-virtual">
                    Book a Virtual Lesson
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Divider */}
      <div className="border-t-2 border-navy"></div>
      {/* SECTION 8 — TESTIMONIALS */}
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection title="Riders See Real Progress With the Dan Bizzarro Method" />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <SponsorsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <NewsletterSubscription />
      </Suspense>
      {/* Divider */}
      <div className="border-t-2 border-orange"></div>
      {/* SECTION 9 — FINAL CTA */}
      <section id="contact" className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
            Ready for Clear, Confident Riding?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Take the first step towards a better partnership with your horse
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/coaching/private-lessons">
              <Button className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-final-book-lesson">
                Book a Lesson <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/coaching/clinics">
              <Button className="bg-white text-navy hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-final-book-clinic">
                Book a Clinic <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105" data-testid="button-final-tips">
                Get Free Training Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
