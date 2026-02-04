import ContactForm from "@/components/ContactForm";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're interested in coaching, clinics, or have questions about eventing, 
            we'd love to hear from you.
          </p>
        </div>

        <ContactForm />

        {/* Social Media Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Dan's Journey</h3>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.facebook.com/YOUR-BUSINESS" 
              className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a 
              href="https://www.instagram.com/YOUR-BUSINESS" 
              className="bg-pink-600 text-white p-4 rounded-full hover:bg-pink-700 transition duration-300 transform hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a 
              href="https://www.twitter.com/YOUR-BUSINESS" 
              className="bg-blue-400 text-white p-4 rounded-full hover:bg-blue-500 transition duration-300 transform hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a 
              href="https://www.youtube.com/YOUR-BUSINESS" 
              className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
          <p className="mt-4 text-gray-600">
            Stay updated with training tips, competition results, and behind-the-scenes content
          </p>
        </div>
      </div>
    </section>
  );
}