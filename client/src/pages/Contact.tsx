import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import { Instagram, Facebook, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { getBreadcrumbsFromPath, createBreadcrumbSchema } from "@shared/schemaHelpers";

export default function Contact() {
  const seoConfig = getSEOConfig('/contact');
  const breadcrumbs = getBreadcrumbsFromPath('/contact', seoConfig.h1);
  const schemas = [createBreadcrumbSchema(breadcrumbs)];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[300px] sm:min-h-[300px] bg-gradient-to-r from-orange-600 to-orange-500 mt-14 sm:mt-16 flex">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Stay Connected
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Subscribe for exclusive training tips and early clinic access
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <NewsletterSubscription />

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Contact Information
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
            <p className="text-lg text-dark max-w-2xl mx-auto">
              Have questions? Reach out via phone, email, or WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Phone */}
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange/10 p-4 rounded-full">
                  <Phone className="w-8 h-8 text-orange" />
                </div>
              </div>
              <h3 className="font-semibold text-navy mb-2 text-xl">Phone</h3>
              <a 
                href="tel:+1234567890" 
                className="text-2xl font-bold text-orange hover:text-orange/80 transition"
                data-testid="link-phone"
              >
                +1234567890
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange/10 p-4 rounded-full">
                  <Mail className="w-8 h-8 text-orange" />
                </div>
              </div>
              <h3 className="font-semibold text-navy mb-2 text-xl">Email</h3>
              <a 
                href="mailto:info@your-coaching-business.com" 
                className="text-lg text-dark hover:text-orange transition break-all"
                data-testid="link-email"
              >
                info@your-coaching-business.com
              </a>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange/10 p-4 rounded-full">
                  <MapPin className="w-8 h-8 text-orange" />
                </div>
              </div>
              <h3 className="font-semibold text-navy mb-2 text-xl">Location</h3>
              <p className="text-dark">
                Crown Farm<br />
                Ascott-Under-Wychwood<br />
                Oxfordshire OX7<br />
                United Kingdom
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://wa.me/447767291713"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition text-lg font-medium"
                data-testid="button-whatsapp"
              >
                <Phone className="w-5 h-5 mr-2" />
                Message on WhatsApp
              </a>
              <a
                href="/coaching/clinics"
                className="flex items-center justify-center bg-orange hover:bg-orange-hover text-white px-6 py-4 rounded-lg transition text-lg font-medium"
                data-testid="button-view-clinics"
              >
                View Upcoming Clinics
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Location */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4">Find Us</h2>
            <p className="text-dark">Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2470.8!2d-1.5643032!3d51.8646375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x760659515ffe65c0!2sCrown%20Farm%2C%20Ascott-Under-Wychwood!5e0!3m2!1sen!2suk!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Training with Your Coaching Business Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12 bg-gray-50 rounded-2xl shadow-md">
            <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Follow Dan's Journey</h3>
            <p className="text-dark mb-8">Stay updated with training tips, competition results, and behind-the-scenes content</p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.facebook.com/YOUR-BUSINESS" 
                className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/YOUR-BUSINESS" 
                className="bg-pink-600 text-white p-4 rounded-full hover:bg-pink-700 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://www.twitter.com/YOUR-BUSINESS" 
                className="bg-blue-400 text-white p-4 rounded-full hover:bg-blue-500 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://www.youtube.com/YOUR-BUSINESS" 
                className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                data-testid="link-youtube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
