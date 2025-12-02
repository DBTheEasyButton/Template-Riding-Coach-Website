import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import ResponsiveImage from "@/components/ResponsiveImage";
import valleraTableJpg from "@assets/optimized/about-vallera-table.jpg";
import valleraTableWebp from "@assets/optimized/about-vallera-table.webp";
import valleraTableMobileJpg from "@assets/optimized/about-vallera-table-mobile.jpg";
import valleraTableMobileWebp from "@assets/optimized/about-vallera-table-mobile.webp";
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
          alt="Dan Bizzarro professional eventing coach at clinic in Oxfordshire"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              About Dan Bizzarro
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
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">Dan's Story</h2>
                <div className="w-24 h-1 bg-orange mb-8"></div>
              </div>
              <p className="text-lg text-dark leading-relaxed">
                Daniele was born and grew up on the outskirts of Turin, Italy. His mother rode at a local stable, and it was there, at 9 years old, that Dan first caught the riding bug. A few years later he met the horse Fair and Square, who introduced him to Eventing and took him to CCI*.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                In 2007, while studying Graphic Design at university, Dan met Italian stud owner Alberto Bolaffi, who offered his Il Quadrifoglio Country Club as a base. Dan took the plunge into professional riding and has never looked back.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                A move to England in 2011 saw Dan working as a rider for British Eventing legend William Fox-Pitt—an invaluable experience learning from one of the most successful British event riders of all time.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Since then, Dan has made the Gloucestershire/Oxfordshire area his base, where he competes for loyal owners and teaches riders of all levels. Alongside producing consistent results at national and international level, Dan has represented Italy in several Nations Cup events, with the Italian team finishing 2nd at Boekelo in 2022. In 2025, he also represented Italy at the European Championships at Blenheim.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                In 2024, Dan was named on the Short List for the Paris Olympic Games.
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <ResponsiveImage
                  src={valleraTableJpg}
                  webpSrc={valleraTableWebp}
                  mobileSrc={valleraTableMobileJpg}
                  mobileWebpSrc={valleraTableMobileWebp}
                  alt="Dan Bizzarro competing cross country on grey horse Vallera"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="relative">
                <ResponsiveImage
                  src={hartpuryJpg}
                  webpSrc={hartpuryWebp}
                  mobileSrc={hartpuryMobileJpg}
                  mobileWebpSrc={hartpuryMobileWebp}
                  alt="Dan Bizzarro jumping at Hartpury Open Championships cross country"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="relative">
                <ResponsiveImage
                  src={blenheimDressageJpg}
                  webpSrc={blenheimDressageWebp}
                  mobileSrc={blenheimDressageMobileJpg}
                  mobileWebpSrc={blenheimDressageMobileWebp}
                  alt="Dan Bizzarro representing Italy at Blenheim European Championships dressage"
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
              <div className="text-4xl font-playfair font-bold text-orange mb-2">2024</div>
              <div className="text-gray-700">Olympic Short Listed</div>
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
              Training Philosophy
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
                alt="Dan Bizzarro coaching a rider during a training session"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-6 text-lg text-dark leading-relaxed">
              <p>
                Dan's approach to training combines classical eventing principles with modern, rider-friendly techniques, always prioritising the welfare, understanding, and long-term development of both horse and rider. This philosophy sits at the heart of the <a href="/#method" className="text-orange hover:text-orange/80 underline underline-offset-2 transition-colors">Dan Bizzarro Method</a>—a clear, structured way of training designed to make communication easier, build trust, and help every partnership progress with purpose.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-dark leading-relaxed">
              <p>
                Drawing from his experience working with William Fox-Pitt, Caroline Moore, Ian Woodhead, and many other top riders and coaches, as well as competing at the highest international levels, Dan emphasises systematic progression, clear communication, and building confidence through thoughtful preparation.
              </p>
              <p>
                Whether coaching beginners or advanced competitors, Dan's focus remains on developing strong foundations in dressage, show jumping, and cross-country—the three disciplines that make eventing the ultimate test of horsemanship—and ensuring that every rider has a method they can rely on both at home and in competition.
              </p>
            </div>
            <div className="relative">
              <ResponsiveImage
                src={philosophy2Jpg}
                webpSrc={philosophy2Webp}
                mobileSrc={philosophy2MobileJpg}
                mobileWebpSrc={philosophy2MobileWebp}
                alt="Dan Bizzarro coaching at a show jumping arena"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
