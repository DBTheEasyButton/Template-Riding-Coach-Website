import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/Logo-trasparenteRAST_1749385353493.png";

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img 
              src={logoPath} 
              alt="Dan Bizzarro Eventing" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-slate-300 mb-6 leading-relaxed">
              International event rider representing Italy with passion, precision, and dedication to the sport of three-day eventing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('#about')}
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#achievements')}
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Achievements
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#schedule')}
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Schedule
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#gallery')}
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#news')}
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  News
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Via dei Cavalli 123</li>
              <li>Tuscany, Italy 50125</li>
              <li>+39 055 123 4567</li>
              <li>info@danbizzarro.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Dan Bizzarro. All rights reserved. | Designed with excellence in mind.</p>
          <div className="mt-2">
            <Link 
              href="/admin/clinics" 
              className="text-xs text-gray-600 hover:text-orange transition-colors"
              title="Admin Access"
            >
              •
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
