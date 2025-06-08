import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoPath from "@assets/Logo-trasparenteRAST_1749385353493.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#coaching", label: "Coaching" },
    { href: "#clinics", label: "Clinics" },
    { href: "#training-videos", label: "Training" },
    { href: "#schedule", label: "Schedule" },
    { href: "#gallery", label: "Gallery" },
    { href: "#news", label: "News" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNavigation = (href: string, label: string) => {
    if (label === "Home") {
      // Always navigate to home page
      window.location.href = "/";
      return;
    }
    
    if (location !== "/") {
      // If not on home page, go to home first then scroll
      window.location.href = "/" + href;
      return;
    }
    
    // On home page, scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/98 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
    } border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="Dan Bizzarro Eventing" 
                className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className="text-charcoal hover:text-italian-red transition-colors duration-200 font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-charcoal hover:text-italian-red"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href, item.label)}
                className="block w-full text-left px-3 py-2 text-charcoal hover:text-italian-red transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
