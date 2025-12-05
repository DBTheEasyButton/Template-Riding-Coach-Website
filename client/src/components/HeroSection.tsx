import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import HeroPicture from "@/components/HeroPicture";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import heroImageJpg from "@assets/optimized/hero-background.jpg";
import heroImageWebp from "@assets/optimized/hero-background.webp";
import heroImageMobileJpg from "@assets/optimized/hero-background-mobile.jpg";
import heroImageMobileWebp from "@assets/optimized/hero-background-mobile.webp";
import carouselClinic2Jpg from "@assets/optimized/carousel-clinic-2.jpg";
import carouselClinic2Webp from "@assets/optimized/carousel-clinic-2.webp";
import carouselClinic2MobileJpg from "@assets/optimized/carousel-clinic-2-mobile.jpg";
import carouselClinic2MobileWebp from "@assets/optimized/carousel-clinic-2-mobile.webp";
import dressageImageJpg from "@assets/optimized/_TLP0096{Hi Res_-_3 Star - A1  Dressage_-_a. 08.00 to 08.30_1749504219373.jpg";
import dressageImageWebp from "@assets/optimized/_TLP0096{Hi Res_-_3 Star - A1  Dressage_-_a. 08.00 to 08.30_1749504219373.webp";
import dressageImageMobileJpg from "@assets/optimized/_TLP0096{Hi Res_-_3 Star - A1  Dressage_-_a. 08.00 to 08.30_1749504219373-mobile.jpg";
import dressageImageMobileWebp from "@assets/optimized/_TLP0096{Hi Res_-_3 Star - A1  Dressage_-_a. 08.00 to 08.30_1749504219373-mobile.webp";
import coachingClinicImageJpg from "@assets/optimized/hero-coaching-clinic.jpg";
import coachingClinicImageWebp from "@assets/optimized/hero-coaching-clinic.webp";
import coachingClinicMobileJpg from "@assets/optimized/hero-coaching-clinic-mobile.jpg";
import coachingClinicMobileWebp from "@assets/optimized/hero-coaching-clinic-mobile.webp";
import crossCountryImageJpg from "@assets/optimized/Screenshot_20230819_110201_Instagram_1749504219375.jpg";
import crossCountryImageWebp from "@assets/optimized/Screenshot_20230819_110201_Instagram_1749504219375.webp";
import crossCountryMobileJpg from "@assets/optimized/Screenshot_20230819_110201_Instagram_1749504219375-mobile.jpg";
import crossCountryMobileWebp from "@assets/optimized/Screenshot_20230819_110201_Instagram_1749504219375-mobile.webp";
import showJumpingImageJpg from "@assets/optimized/Riot Boekelo sj 2022_1749504436583.jpg";
import showJumpingImageWebp from "@assets/optimized/Riot Boekelo sj 2022_1749504436583.webp";
import showJumpingMobileJpg from "@assets/optimized/Riot Boekelo sj 2022_1749504436583-mobile.jpg";
import showJumpingMobileWebp from "@assets/optimized/Riot Boekelo sj 2022_1749504436583-mobile.webp";
import facebookLogo from "@assets/optimized/07Oct24 Anis Pro Upload 07Oct24 Anis Pro Upload  (5)_1752564178859.png";
import instagramLogo from "@assets/optimized/07Oct24 Anis Pro Upload 07Oct24 Anis Pro Upload  (7)_1752564178858.png";

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  
  const images = [
    { 
      jpegSrc: heroImageJpg,
      webpSrc: heroImageWebp,
      mobileJpegSrc: heroImageMobileJpg,
      mobileWebpSrc: heroImageMobileWebp,
      alt: "Dan Bizzarro eventing competition"
    },
    { 
      jpegSrc: carouselClinic2Jpg,
      webpSrc: carouselClinic2Webp,
      mobileJpegSrc: carouselClinic2MobileJpg,
      mobileWebpSrc: carouselClinic2MobileWebp,
      alt: "Dan Bizzarro coaching clinic with riders and horses"
    },
    { 
      jpegSrc: coachingClinicImageJpg,
      webpSrc: coachingClinicImageWebp,
      mobileJpegSrc: coachingClinicMobileJpg,
      mobileWebpSrc: coachingClinicMobileWebp,
      alt: "Dan Bizzarro coaching at show jumping arena"
    },
    { 
      jpegSrc: dressageImageJpg,
      webpSrc: dressageImageWebp,
      mobileJpegSrc: dressageImageMobileJpg,
      mobileWebpSrc: dressageImageMobileWebp,
      alt: "Dressage training session with Dan Bizzarro",
      style: { objectPosition: 'center 30%' }
    },
    { 
      jpegSrc: crossCountryImageJpg,
      webpSrc: crossCountryImageWebp,
      mobileJpegSrc: crossCountryMobileJpg,
      mobileWebpSrc: crossCountryMobileWebp,
      alt: "Cross country coaching over natural obstacles",
      style: { objectPosition: 'center 70%' }
    },
    { 
      jpegSrc: showJumpingImageJpg,
      webpSrc: showJumpingImageWebp,
      mobileJpegSrc: showJumpingMobileJpg,
      mobileWebpSrc: showJumpingMobileWebp,
      alt: "Show jumping training clinic"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="relative min-h-[500px] sm:min-h-[550px] overflow-hidden mt-14 sm:mt-16 flex">
      {/* Background images carousel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <HeroPicture
            jpegSrc={image.jpegSrc}
            webpSrc={image.webpSrc}
            mobileJpegSrc={image.mobileJpegSrc}
            mobileWebpSrc={image.mobileWebpSrc}
            alt={image.alt}
            loading={index === 0 ? "eager" : "lazy"}
            priority={index === 0}
            className="w-full h-full object-cover"
            style={image.style}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}
      <div className="relative z-10 flex-1 flex items-center justify-center py-12 sm:py-16">
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="opacity-0 animate-fade-in-up leading-tight mb-6" style={{animationDelay: '0.2s'}}>
          <span className="block text-4xl md:text-6xl lg:text-7xl font-playfair font-bold">Improve your riding</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl font-playfair font-medium mt-2">with The Dan Bizzarro Method</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-inter font-light mb-8 opacity-0 animate-fade-in-up tracking-wide max-w-3xl mx-auto" style={{animationDelay: '0.4s'}}>Become a confident, skilled rider and get better results!</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fade-in-up mt-8" style={{animationDelay: '0.6s'}}>
          <Link href="/coaching/private-lessons">
            <Button 
              className="bg-orange hover:bg-orange-hover text-white px-8 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              data-testid="button-book-lesson"
            >
              Book a Lesson
            </Button>
          </Link>
          <Link href="/coaching/clinics">
            <Button 
              className="bg-navy hover:bg-slate-800 text-white px-8 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              data-testid="button-book-clinic-hero"
            >
              Book a Clinic
            </Button>
          </Link>
          <Link href="/coaching/remote-coaching">
            <Button 
              className="bg-orange hover:bg-orange-hover text-white px-8 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              data-testid="button-book-virtual-lesson"
            >
              Book a Virtual Lesson
            </Button>
          </Link>
        </div>
        <div className="flex justify-center opacity-0 animate-fade-in-up mt-4" style={{animationDelay: '0.7s'}}>
          <Button 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            data-testid="button-get-guide"
            onClick={() => setIsLeadModalOpen(true)}
          >
            Get the Free Warm Up Guide
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
      </div>
      
      {/* Lead Capture Modal for Free Training Tips */}
      <LeadCaptureModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </section>
  );
}
