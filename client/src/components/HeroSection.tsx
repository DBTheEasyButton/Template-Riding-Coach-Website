import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImagePath from "@assets/hero-background.jpg";

export default function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${heroImagePath})`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Dan Bizzarro
        </h1>
        <h2 className="text-2xl md:text-3xl font-inter font-light mb-8 opacity-0 animate-fade-in-up tracking-wide" style={{animationDelay: '0.4s'}}>
          International Event Rider & Coach
        </h2>
        <p className="text-xl md:text-2xl mb-12 opacity-0 animate-fade-in-up font-light leading-relaxed" style={{animationDelay: '0.6s'}}>
          Representing Italy on the world's most prestigious equestrian stages
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center opacity-0 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <Button 
            onClick={() => scrollToSection('#achievements')}
            className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            View Achievements
          </Button>
          <Button 
            variant="outline"
            onClick={() => scrollToSection('#contact')}
            className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            Get In Touch
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <button onClick={() => scrollToSection('#about')} className="block">
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
