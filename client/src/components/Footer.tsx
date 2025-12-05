import { Instagram, Facebook, Twitter, Youtube, Gift } from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/optimized/Dan Bizzarro Method_1749676680719.png";

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
              alt="Dan Bizzarro Method - International Eventing Coach & Training" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-slate-300 mb-6 leading-relaxed">The Dan Bizzarro Method builds clear communication, confidence, and partnership between horse and rider through simple, effective, progressive training that works for everyone.</p>
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
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a 
                  href="/api/downloads/warmup-system-pdf"
                  download="The-Eventers-Warmup-System-Dan-Bizzarro.pdf"
                  className="text-gray-300 hover:text-orange transition-colors flex items-center gap-1.5"
                  data-testid="link-footer-free-guide"
                >
                  <Gift className="w-4 h-4" />
                  Get Free Warm Up Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Coaching</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/coaching/private-lessons"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Private Lessons
                </Link>
              </li>
              <li>
                <Link 
                  href="/coaching/clinics"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Clinics
                </Link>
              </li>
              <li>
                <Link 
                  href="/coaching/remote-coaching"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Virtual Lessons
                </Link>
              </li>
              <li>
                <Link 
                  href="/coaching/dressage"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Dressage
                </Link>
              </li>
              <li>
                <Link 
                  href="/coaching/show-jumping"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Show Jumping
                </Link>
              </li>
              <li>
                <Link 
                  href="/coaching/cross-country"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Cross Country
                </Link>
              </li>
              <li>
                <Link 
                  href="/coaching/polework"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Polework
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/courses/10-points-better"
                  className="text-gray-300 hover:text-orange transition-colors"
                  data-testid="link-footer-10-points-better"
                >
                  10 Points Better
                </Link>
              </li>
            </ul>
            <h3 className="font-semibold mb-4 mt-6">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Crown Farm</li>
              <li>Ascott-Under-Wychwood</li>
              <li>Oxfordshire OX7</li>
              <li>United Kingdom</li>
              <li className="pt-2">
                <a 
                  href="tel:+447767291713" 
                  className="hover:text-orange transition-colors"
                  data-testid="link-footer-phone"
                >
                  +44 7767 291713
                </a>
              </li>
              <li>
                <a 
                  href="mailto:dan@danbizzarromethod.com" 
                  className="hover:text-orange transition-colors"
                  data-testid="link-footer-email"
                >
                  dan@danbizzarromethod.com
                </a>
              </li>
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
