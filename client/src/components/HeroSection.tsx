import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import heroImagePath from "@assets/optimized/hero-background.jpg";
import dressageImage from "@assets/optimized/_TLP0096{Hi Res_-_3 Star - A1  Dressage_-_a. 08.00 to 08.30_1749504219373.jpg";
import crossCountryImage from "@assets/optimized/Screenshot_20230819_110201_Instagram_1749504219375.jpg";
import showJumpingImage from "@assets/optimized/Riot Boekelo sj 2022_1749504436583.jpg";
import facebookLogo from "@assets/optimized/07Oct24 Anis Pro Upload 07Oct24 Anis Pro Upload  (5)_1752564178859.png";
import instagramLogo from "@assets/optimized/07Oct24 Anis Pro Upload 07Oct24 Anis Pro Upload  (7)_1752564178858.png";

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
            alt={
              index === 0 ? "Dan Bizzarro eventing competition" :
              index === 1 ? "Dressage training session with Dan Bizzarro" :
              index === 2 ? "Cross country coaching over natural obstacles" :
              "Show jumping training clinic"
            }
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
        <h1 className="text-4xl md:text-6xl font-inter font-light mb-6 opacity-0 animate-fade-in-up tracking-wide" style={{animationDelay: '0.2s'}}>
          International Event Rider & Coach
        </h1>
        <p className="text-6xl md:text-8xl font-playfair font-bold mb-8 opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          Dan Bizzarro
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 opacity-0 animate-fade-in-up mt-12" style={{animationDelay: '0.6s'}}>
          <Link href="/coaching/private-lessons">
            <Button 
              className="bg-navy text-white px-6 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 w-full md:w-auto"
              data-testid="button-book-private-lesson"
            >
              BOOK A PRIVATE LESSON
            </Button>
          </Link>
          <Link href="/coaching/clinics">
            <Button 
              className="bg-orange text-white px-6 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 w-full md:w-auto"
              data-testid="button-book-clinic"
            >
              BOOK A CLINIC
            </Button>
          </Link>
          <Link href="/coaching/remote-coaching">
            <Button 
              className="bg-navy text-white px-6 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 w-full md:w-auto"
              data-testid="button-book-virtual-lesson"
            >
              BOOK A VIRTUAL LESSON
            </Button>
          </Link>
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
              className="w-12 h-12 rounded-lg shadow-lg hover:shadow-xl object-contain"
              style={{ imageRendering: 'crisp-edges' }}
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
              className="w-12 h-12 rounded-lg shadow-lg hover:shadow-xl object-contain"
              style={{ imageRendering: 'crisp-edges' }}
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
