import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import ResponsiveImage from "@/components/ResponsiveImage";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Link } from "wouter";
import hartpuryJpg from "@assets/optimized/about-hartpury.jpg";
import hartpuryWebp from "@assets/optimized/about-hartpury.webp";
import hartpuryMobileJpg from "@assets/optimized/about-hartpury-mobile.jpg";
import hartpuryMobileWebp from "@assets/optimized/about-hartpury-mobile.webp";
import blenheimDressageJpg from "@assets/optimized/about-blenheim-dressage.jpg";
import blenheimDressageWebp from "@assets/optimized/about-blenheim-dressage.webp";
import blenheimDressageMobileJpg from "@assets/optimized/about-blenheim-dressage-mobile.jpg";
import blenheimDressageMobileWebp from "@assets/optimized/about-blenheim-dressage-mobile.webp";
import philosophyJpg from "@assets/optimized/about-philosophy.jpg";
import philosophyWebp from "@assets/optimized/about-philosophy.webp";
import philosophyMobileJpg from "@assets/optimized/about-philosophy-mobile.jpg";
import philosophyMobileWebp from "@assets/optimized/about-philosophy-mobile.webp";
import philosophy2Jpg from "@assets/optimized/about-philosophy-2.jpg";
import philosophy2Webp from "@assets/optimized/about-philosophy-2.webp";
import philosophy2MobileJpg from "@assets/optimized/about-philosophy-2-mobile.jpg";
import philosophy2MobileWebp from "@assets/optimized/about-philosophy-2-mobile.webp";
import aboutDanHeroJpg from "@assets/optimized/about-dan-hero.jpg";
import aboutDanHeroWebp from "@assets/optimized/about-dan-hero.webp";
import aboutDanHeroMobileJpg from "@assets/optimized/about-dan-hero-mobile.jpg";
import aboutDanHeroMobileWebp from "@assets/optimized/about-dan-hero-mobile.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { getBreadcrumbsFromPath, createBreadcrumbSchema } from "@shared/schemaHelpers";

export default function About() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const seoConfig = getSEOConfig('/about');
  const breadcrumbs = getBreadcrumbsFromPath('/about', seoConfig.h1);
  const schemas = [createBreadcrumbSchema(breadcrumbs)];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        preloadImage={aboutDanHeroWebp}
        preloadImageJpeg={aboutDanHeroJpg}
        schemas={schemas}
      />
      <Navigation />
      {/* Hero Section */}
      <section className="relative min-h-[350px] sm:min-h-[400px] overflow-hidden mt-14 sm:mt-16 flex">
        <HeroPicture
          jpegSrc={aboutDanHeroJpg}
          webpSrc={aboutDanHeroWebp}
          mobileJpegSrc={aboutDanHeroMobileJpg}
          mobileWebpSrc={aboutDanHeroMobileWebp}
          alt="Your Coach professional eventing coach at clinic in Oxfordshire"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              About Your Coach
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              International Event Rider & Professional Coach
            </p>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">More About Me</h2>
                <div className="w-24 h-1 bg-orange mb-8"></div>
              </div>
              <p className="text-lg text-dark leading-relaxed">My name is Your Coach and I've spent more than 20 years riding, training and coaching horses and riders across dressage, show jumping and cross-country. I grew up just outside Turin (Italy), started riding when I was nine, and very quickly discovered that I loved the process of training horses just as much as I loved competing them.</p>
              <p className="text-lg text-dark leading-relaxed">Over the years I've had the privilege of producing a large number of horses working with some of the best riders and coaches in the world, including William Fox-Pitt, Caroline Moore and Ian Woodhead. Their influence shaped how I ride, how I think, and how I teach — always with clarity, fairness and a genuine desire to help horses understand their job.</p>
              <p className="text-lg text-dark leading-relaxed">I've represented Italy in Nations Cup competitions, I was in the short-list for the 2024 Paris Olympics and I competed at the 2025 European Championships, and I've ridden every type of horse along the way: sharp ones, strong ones, lazy ones, spooky ones, young ones, talented ones, complicated ones. The variety taught me more than any book ever could.</p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <ResponsiveImage
                  src={hartpuryJpg}
                  webpSrc={hartpuryWebp}
                  mobileSrc={hartpuryMobileJpg}
                  mobileWebpSrc={hartpuryMobileWebp}
                  alt="Your Coach jumping at Hartpury Open Championships cross country"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="relative">
                <ResponsiveImage
                  src={blenheimDressageJpg}
                  webpSrc={blenheimDressageWebp}
                  mobileSrc={blenheimDressageMobileJpg}
                  mobileWebpSrc={blenheimDressageMobileWebp}
                  alt="Your Coach representing Italy at Blenheim European Championships dressage"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-12">
            Career Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-experience">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">20+</div>
              <div className="text-gray-700">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-riders">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">500+</div>
              <div className="text-gray-700">Riders Coached</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-olympic">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">2025</div>
              <div className="text-gray-700">European Championships Blenhem</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-nations-cup">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">2nd</div>
              <div className="text-gray-700">Nations Cup Boekelo</div>
            </div>
          </div>
        </div>
      </section>
      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              My Training Philosophy
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative">
              <ResponsiveImage
                src={philosophyJpg}
                webpSrc={philosophyWebp}
                mobileSrc={philosophyMobileJpg}
                mobileWebpSrc={philosophyMobileWebp}
                alt="Your Coach coaching a rider during a training session"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-6 text-lg text-dark leading-relaxed">
              <p>
                I believe every horse can go better, and every rider can feel more confident when the communication between them is clear.
              </p>
              <p>
                The <a href="/#method" className="text-orange hover:text-orange/80 underline underline-offset-2 transition-colors">Your Coaching Business</a> is based on a few simple principles that stay the same whether you're doing dressage, show jumping or cross-country:
              </p>
              <ul className="space-y-3 text-lg text-dark">
                <li className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <span><strong>Clear reactions to the aids</strong> — the horse knows what you're asking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <span><strong>Balance and self-carriage</strong> — a horse that can carry itself feels lighter, softer and easier</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <span><strong>Straightness and accuracy</strong> — the foundation of every good transition and every good jump</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-dark leading-relaxed">
              <ul className="space-y-3 text-lg text-dark">
                <li className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <span><strong>A soft, consistent contact</strong> — not forced, not restrictive, but genuinely connected</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <span><strong>Small corrections at the right time</strong> — before bad habits grow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange font-bold">•</span>
                  <span><strong>Confidence for horse and rider</strong> — without tension, pressure or confusion</span>
                </li>
              </ul>
              <p>
                My teaching style is direct, calm and practical. I don't overcomplicate things. I show you what matters, and I explain why it matters, so you can train your horse even on the days when I'm not there.
              </p>
              <p>
                Riders often tell me they feel "relieved" after a lesson — not because it was easy, but because everything finally made sense.
              </p>
            </div>
            <div className="relative">
              <ResponsiveImage
                src={philosophy2Jpg}
                webpSrc={philosophy2Webp}
                mobileSrc={philosophy2MobileJpg}
                mobileWebpSrc={philosophy2MobileWebp}
                alt="Your Coach coaching at a show jumping arena"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Where I Coach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Where I Coach
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          <div className="space-y-6 text-lg text-dark leading-relaxed">
            <p>
              I'm based in Oxfordshire and teach riders of all levels — from amateurs building confidence to riders preparing for eventing competitions. I offer:
            </p>
            <ul className="space-y-3 text-lg text-dark pl-4">
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Private riding lessons</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Show jumping and cross-country coaching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Clinics across the UK</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Virtual riding lessons for riders anywhere in the world</span>
              </li>
            </ul>
            <p>
              No matter the location, the goal is the same: clear communication, better balance and a more confident partnership.
            </p>
          </div>
        </div>
      </section>
      {/* Why I Created the Method Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Why I Created the Your Coaching Business
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          <div className="space-y-6 text-lg text-dark leading-relaxed">
            <p>
              After years of coaching, I kept seeing the same patterns:
            </p>
            <ul className="space-y-3 text-lg text-dark pl-4">
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Riders were working hard but feeling stuck.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Horses were trying their best but becoming tense, unbalanced or confused.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange font-bold">•</span>
                <span>Most people weren't struggling because they lacked talent — they simply didn't have a system that made the work clear and consistent.</span>
              </li>
            </ul>
            <p>
              So I created the <a href="/#method" className="text-orange hover:text-orange/80 underline underline-offset-2 transition-colors">Your Coaching Business</a> to give riders a structure they can follow at home, at clinics, in competition warm-ups and even out hacking. It's designed to be simple, effective and genuinely useful for the horses people ride every day — not just elite athletes.
            </p>
            <p className="font-medium">
              My aim is always the same: to make horse riding easier to understand, more enjoyable, and more rewarding for both horse and rider.
            </p>
          </div>
        </div>
      </section>
      {/* A Final Note Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              A Final Note
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          <div className="space-y-6 text-lg text-dark leading-relaxed text-center">
            <p>
              I take coaching seriously, but I believe it should still feel enjoyable. You don't need to be brave, talented or perfect — you just need a willingness to learn and a horse that's ready to listen.
            </p>
            <p>
              If that sounds like you, I'd be glad to help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/coaching/private-lessons">
              <button className="px-8 py-4 bg-orange text-white font-semibold rounded-lg hover:bg-orange/90 transition-colors text-lg" data-testid="button-book-lesson">
                Book a Lesson
              </button>
            </Link>
            <button 
              className="px-8 py-4 bg-white text-navy font-semibold rounded-lg border-2 border-navy hover:bg-gray-50 transition-colors text-lg" 
              data-testid="button-training-tips"
              onClick={() => setIsLeadModalOpen(true)}
            >
              Get Free Training Tips
            </button>
          </div>
        </div>
      </section>
      {/* Lead Capture Modal */}
      <LeadCaptureModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
      <Footer />
    </div>
  );
}
