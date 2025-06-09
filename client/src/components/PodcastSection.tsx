import { Button } from "@/components/ui/button";
import { Play, Headphones, Users, Star, ExternalLink } from "lucide-react";

export default function PodcastSection() {
  return (
    <section id="podcast" className="py-24 bg-gray-50 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6 text-navy">Our Equestrian Life Podcast</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-dark max-w-3xl mx-auto">
            Your portal to the world of all things equestrian
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-playfair font-bold mb-6 text-navy">Welcome to Our Equestrian Life</h3>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Welcome to your portal to the world of all things equestrian.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                I'm your host <strong>Dan Bizzarro</strong> and in each episode, we embark on a journey alongside industry experts, accomplished riders, and passionate enthusiasts.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-8">
                We get to know them and we learn from their experiences and vast knowledge, gaining a deeper understanding of the equestrian way of life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => window.open('https://open.spotify.com/show/2KiQE9pq1onqkGv0Pm14p4', '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Listen on Spotify
                </Button>
                <Button 
                  onClick={() => window.open('https://podcasts.apple.com/gb/podcast/our-equestrian-life/id1720429214', '_blank')}
                  variant="outline"
                  className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen on Apple Podcasts
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-orange">Expert</div>
                <div className="text-sm text-dark">Interviews</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-orange">Industry</div>
                <div className="text-sm text-dark">Insights</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-orange">Passionate</div>
                <div className="text-sm text-dark">Stories</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-orange">Equestrian</div>
                <div className="text-sm text-dark">Lifestyle</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-navy to-navy/80 rounded-3xl p-8 text-center shadow-2xl">
              <div className="bg-orange rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Headphones className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-2xl font-playfair font-bold mb-4 text-white">Available on All Platforms</h4>
              <p className="text-white/90 mb-6">Join the conversation and discover the stories that shape our equestrian community</p>
              
              <div className="space-y-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-2 text-white mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-sm text-white/90">Trusted by equestrian enthusiasts worldwide</p>
                </div>
                
                <div className="flex items-center justify-center text-white/80 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Growing community of listeners
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h4 className="text-2xl font-playfair font-bold mb-6 text-navy text-center">What You'll Discover</h4>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange" />
              </div>
              <h5 className="text-lg font-semibold mb-2 text-navy">Industry Experts</h5>
              <p className="text-dark text-sm">Learn from accomplished riders and industry professionals who share their expertise and insights.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-orange" />
              </div>
              <h5 className="text-lg font-semibold mb-2 text-navy">Personal Stories</h5>
              <p className="text-dark text-sm">Discover inspiring journeys and experiences from passionate equestrian enthusiasts.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-orange" />
              </div>
              <h5 className="text-lg font-semibold mb-2 text-navy">Deep Knowledge</h5>
              <p className="text-dark text-sm">Gain a deeper understanding of the equestrian way of life through engaging conversations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}