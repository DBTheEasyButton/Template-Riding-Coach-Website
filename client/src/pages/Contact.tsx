import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactForm from "@/components/ContactForm";
import { Instagram, Facebook, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Contact Dan Bizzarro - Eventing Coach in Oxfordshire | Dan Bizzarro Method"
        description="Get in touch with Dan Bizzarro for eventing coaching, clinic bookings, or inquiries. Based in Ascott-Under-Wychwood, Oxfordshire. Phone, email, and WhatsApp contact options available."
        keywords="contact Dan Bizzarro, eventing coach contact, Oxfordshire horse trainer, clinic booking, private lesson inquiry, equestrian coaching contact"
        canonical="https://dan-bizzarro.replit.app/contact"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] bg-gradient-to-r from-green-600 to-green-500">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Whether you're interested in coaching, clinics, or have questions about eventing
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-navy mb-6">Contact Information</h2>
                <div className="w-24 h-1 bg-orange mb-8"></div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Location</h3>
                    <p className="text-dark">
                      Ascott-Under-Wychwood<br />
                      Oxfordshire, United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Phone</h3>
                    <a href="tel:+447767291713" className="text-dark hover:text-orange transition">
                      +44 7767 291713
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Email</h3>
                    <a href="mailto:info@danbizzarro.com" className="text-dark hover:text-orange transition">
                      info@danbizzarro.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-semibold text-navy mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/447767291713"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                    data-testid="button-whatsapp"
                  >
                    WhatsApp Us
                  </a>
                  <a
                    href="/#clinics"
                    className="flex items-center justify-center bg-orange hover:bg-orange/90 text-white px-6 py-3 rounded-lg transition"
                    data-testid="button-view-clinics"
                  >
                    View Upcoming Clinics
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-playfair font-bold text-navy mb-6">Send a Message</h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
              <ContactForm />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Follow Dan's Journey</h3>
            <p className="text-dark mb-8">Stay updated with training tips, competition results, and behind-the-scenes content</p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.facebook.com/danbizzarromethod" 
                className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/danbizzarromethod" 
                className="bg-pink-600 text-white p-4 rounded-full hover:bg-pink-700 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://www.twitter.com/danbizzarro" 
                className="bg-blue-400 text-white p-4 rounded-full hover:bg-blue-500 transition duration-300 transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://www.youtube.com/danbizzarromethod" 
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
