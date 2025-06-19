import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import logoPath from "@assets/Logo-trasparenteRAST_1749385353493.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCoachingDropdownOpen, setIsCoachingDropdownOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItemsBefore = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
  ];

  const navItemsAfter = [
    { href: "#schedule", label: "Schedule" },
    { href: "#gallery", label: "Gallery" },
    { href: "#news", label: "News" },
    { href: "#contact", label: "Contact" },
  ];

  const coachingSubmenu = [
    { href: "#clinics", label: "Clinics" },
    { href: "#coaching", label: "Training with Dan" },
    { href: "#app", label: "Dan Bizzarro Method App" },
    { href: "#training-videos", label: "Training Videos" },
    { href: "#podcast", label: "Our Equestrian Life Podcast" },
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
      setIsCoachingDropdownOpen(false);
    }
  };

  const handleSubmenuClick = (item: any) => {
    if (item.action) {
      item.action();
      setIsCoachingDropdownOpen(false);
      setIsMenuOpen(false);
    } else if (item.href) {
      handleNavigation(item.href, item.label);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-200/95 backdrop-blur-md' : 'bg-gray-100/90 backdrop-blur-md'
    } border-b border-gray-300/50`}>
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
              {navItemsBefore.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className="text-gray-800 hover:text-orange-500 transition-all duration-300 font-medium relative px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-105"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Coaching Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCoachingDropdownOpen(true)}
                onMouseLeave={() => setIsCoachingDropdownOpen(false)}
              >
                <button className="text-gray-800 hover:text-orange-500 transition-all duration-300 font-medium flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-105">
                  Coaching
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isCoachingDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCoachingDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 w-56" style={{ zIndex: 9999 }}>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg transform transition-all duration-200 opacity-100 scale-100">
                      <div className="py-2">
                        {coachingSubmenu.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleSubmenuClick(item)}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200 hover:pl-5"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {navItemsAfter.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className="text-gray-800 hover:text-orange-500 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-105"
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
              className="text-gray-800 hover:text-orange-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="absolute top-full left-0 right-0 bg-gray-100 border-t border-gray-300 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto z-50">
            <div className="px-2 pt-2 pb-6 space-y-1">
              {navItemsBefore.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className="block w-full text-left px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Coaching Section */}
              <div className="border-t pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Coaching
                </div>
                {coachingSubmenu.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubmenuClick(item)}
                    className="block w-full text-left px-3 py-2 pl-6 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {navItemsAfter.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href, item.label)}
                  className="block w-full text-left px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Additional mobile-only links */}
              <div className="border-t pt-2 mt-2">
                <Link href="/competition-checklists">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                  >
                    Competition Checklists
                  </button>
                </Link>
                <Link href="/stride-calculator">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                  >
                    Stride Calculator
                  </button>
                </Link>
                <Link href="/loyalty">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                  >
                    Loyalty Program
                  </button>
                </Link>
                <Link href="/terms-and-conditions">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
                  >
                    Terms & Conditions
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
