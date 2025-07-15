import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import heroImagePath from "@assets/hero-background.jpg";
import dressageImage from "@assets/_TLP0096{Hi Res_-_3 Star - A1  Dressage_-_a. 08.00 to 08.30_1749504219373.jpg";
import crossCountryImage from "@assets/Screenshot_20230819_110201_Instagram_1749504219375.jpg";
import showJumpingImage from "@assets/Riot Boekelo sj 2022_1749504436583.jpg";
import facebookLogo from "@assets/07Oct24 Anis Pro Upload 07Oct24 Anis Pro Upload  (5)_1752563784849.png";
import instagramLogo from "@assets/07Oct24 Anis Pro Upload 07Oct24 Anis Pro Upload  (6)_1752563784848.png";

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    heroImagePath,
    dressageImage,
    crossCountryImage,
    showJumpingImage
  ];

  useEffect(() => {
    // Preload images for better performance
    images.forEach((src, index) => {
      if (index > 0) { // Skip first image as it loads eagerly
        const img = new Image();
        img.src = src;
      }
    });

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images carousel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Hero background ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{
              willChange: index === currentImageIndex ? 'auto' : 'opacity'
            }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Dan Bizzarro
        </h1>
        <h2 className="text-2xl md:text-3xl font-inter font-light mb-8 opacity-0 animate-fade-in-up tracking-wide" style={{animationDelay: '0.4s'}}>
          International Event Rider & Coach
        </h2>
        <div className="flex justify-center opacity-0 animate-fade-in-up mt-12" style={{animationDelay: '0.6s'}}>
          <Button 
            onClick={() => scrollToSection('#clinics')}
            className="bg-navy hover:bg-navy text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            BOOK A LESSON OR A CLINIC
          </Button>
        </div>
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 opacity-0 animate-fade-in-up mt-8" style={{animationDelay: '0.8s'}}>
          <a 
            href="https://www.facebook.com/DanBizzarro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-all duration-300"
          >
            <img 
              src={facebookLogo} 
              alt="Follow Dan Bizzarro on Facebook" 
              className="w-12 h-12 rounded-lg shadow-lg hover:shadow-xl"
            />
          </a>
          <a 
            href="https://www.instagram.com/danbizzarro/?hl=en-gb" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-all duration-300"
          >
            <img 
              src={instagramLogo} 
              alt="Follow Dan Bizzarro on Instagram" 
              className="w-12 h-12 rounded-lg shadow-lg hover:shadow-xl"
            />
          </a>
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
