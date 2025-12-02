import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Play, Headphones, Users, Star, ExternalLink, Calendar } from "lucide-react";
import podcastLogo from "@assets/optimized/podcast-logo-optimized.png";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { getBreadcrumbsFromPath, createBreadcrumbSchema } from "@shared/schemaHelpers";

export default function Podcast() {
  const seoConfig = getSEOConfig('/podcast');
  const breadcrumbs = getBreadcrumbsFromPath('/podcast', seoConfig.h1);
  const schemas = [createBreadcrumbSchema(breadcrumbs)];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[350px] sm:min-h-[400px] bg-gradient-to-r from-orange to-amber-500 mt-14 sm:mt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Our Equestrian Life Podcast
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Your portal to the world of all things equestrian
            </p>
          </div>
        </div>
      </section>

      {/* Main Podcast Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-playfair font-bold mb-6 text-navy">Welcome to Our Equestrian Life</h2>
                <div className="w-24 h-1 bg-orange mb-8"></div>
                <p className="text-lg text-dark leading-relaxed mb-6">
                  Welcome to your portal to the world of all things equestrian.
                </p>
                <p className="text-lg text-dark leading-relaxed mb-6">
                  I'm your host <strong>Dan Bizzarro</strong> and in each episode, we embark on a journey alongside industry experts, accomplished riders, and passionate enthusiasts.
                </p>
                <p className="text-lg text-dark leading-relaxed mb-8">
                  We get to know them and we learn from their experiences and vast knowledge, gaining a deeper understanding of the equestrian way of life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => window.open('https://open.spotify.com/show/2KiQE9pq1onqkGv0Pm14p4', '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  data-testid="button-spotify"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Listen on Spotify
                </Button>
                <Button 
                  onClick={() => window.open('https://podcasts.apple.com/gb/podcast/our-equestrian-life/id1720429214', '_blank')}
                  variant="outline"
                  className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  data-testid="button-apple-podcasts"
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen on Apple Podcasts
                </Button>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <img 
                src={podcastLogo} 
                alt="Our Equestrian Life Podcast cover artwork featuring Dan Bizzarro's equestrian podcast logo" 
                className="w-full max-w-md rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
          </div>

          {/* What You'll Discover Section */}
          <div className="bg-gray-50 rounded-2xl p-12">
            <h2 className="text-3xl font-playfair font-bold mb-12 text-navy text-center">What You'll Discover</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-orange/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-10 h-10 text-orange" />
                </div>
                <p className="text-xl font-semibold mb-3 text-navy">Industry Experts</p>
                <p className="text-dark leading-relaxed">Learn from accomplished riders and industry professionals who share their expertise and insights from years of experience in the equestrian world.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Star className="w-10 h-10 text-orange" />
                </div>
                <p className="text-xl font-semibold mb-3 text-navy">Personal Stories</p>
                <p className="text-dark leading-relaxed">Discover inspiring journeys and experiences from passionate equestrian enthusiasts who share their unique paths in the riding world.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <ExternalLink className="w-10 h-10 text-orange" />
                </div>
                <p className="text-xl font-semibold mb-3 text-navy">Deep Knowledge</p>
                <p className="text-dark leading-relaxed">Gain a deeper understanding of the equestrian way of life through engaging conversations covering training, competition, and horsemanship.</p>
              </div>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="mt-20 bg-navy text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4">Never Miss an Episode</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Subscribe to Our Equestrian Life on your favourite podcast platform and join our growing community of equestrian enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://open.spotify.com/show/2KiQE9pq1onqkGv0Pm14p4', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Subscribe on Spotify
              </Button>
              <Button 
                onClick={() => window.open('https://podcasts.apple.com/gb/podcast/our-equestrian-life/id1720429214', '_blank')}
                className="bg-white hover:bg-gray-100 text-navy px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Subscribe on Apple Podcasts
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
