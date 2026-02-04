import { Instagram, Facebook, Twitter, Youtube, Gift } from "lucide-react";
import { Link } from "wouter";
import logoDarkBg from "@assets/logo-dark-bg.png";

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
            {/* TEMPLATE: Replace with your logo */}
            <img 
              src={logoDarkBg} 
              alt="Your Coaching Business - Professional Equestrian Training" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-slate-300 mb-6 leading-relaxed">Become a confident, skilled rider and get better results!</p>
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
              {/* TEMPLATE: Update or remove these download links as needed */}
              <li>
                <a 
                  href="/api/downloads/warmup-system-pdf"
                  download="Warmup-System-Guide.pdf"
                  className="text-gray-300 hover:text-orange transition-colors flex items-center gap-1.5"
                  data-testid="link-footer-free-guide"
                >
                  <Gift className="w-4 h-4" />
                  Free Warm Up Guide
                </a>
              </li>
              <li>
                <a 
                  href="/api/downloads/strong-horse-pdf"
                  download="Strong-Horse-Solution-Guide.pdf"
                  className="text-gray-300 hover:text-orange transition-colors flex items-center gap-1.5"
                  data-testid="link-footer-strong-horse-guide"
                >
                  <Gift className="w-4 h-4" />
                  Free Strong Horse Guide
                </a>
              </li>
              <li>
                <Link 
                  href="/quiz/horse-type"
                  className="text-gray-300 hover:text-orange transition-colors"
                >
                  Horse Type Quiz
                </Link>
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
              <li>
                <Link 
                  href="/courses/strong-horse-audio"
                  className="text-gray-300 hover:text-orange transition-colors"
                  data-testid="link-footer-strong-horse-audio"
                >
                  Strong Horse Audio Course
                </Link>
              </li>
              <li>
                <Link 
                  href="/gat-uk-tour"
                  className="text-gray-300 hover:text-orange transition-colors"
                  data-testid="link-footer-gat-uk-tour"
                >
                  GAT UK Eventing Tour
                </Link>
              </li>
            </ul>
            {/* TEMPLATE: Update contact details below */}
            <h3 className="font-semibold mb-4 mt-6">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>[Your Address Line 1]</li>
              <li>[Your Address Line 2]</li>
              <li>[Your County/State]</li>
              <li>[Your Country]</li>
              <li className="pt-2">
                <a 
                  href="tel:+441234567890" 
                  className="hover:text-orange transition-colors"
                  data-testid="link-footer-phone"
                >
                  [Your Phone Number]
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@your-domain.com" 
                  className="hover:text-orange transition-colors"
                  data-testid="link-footer-email"
                >
                  [Your Email]
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          {/* TEMPLATE: Update copyright with your business name */}
          <p>&copy; {new Date().getFullYear()} Your Coaching Business. All rights reserved.</p>
          <div className="mt-2">
            <Link 
              href="/admin/clinics" 
              className="text-xs text-gray-600 hover:text-orange transition-colors"
              title="Admin Access"
              onClick={() => window.scrollTo(0, 0)}
            >
              •
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
