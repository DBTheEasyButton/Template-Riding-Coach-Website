import { Button } from "@/components/ui/button";
import { Award, Users, Target, Star } from "lucide-react";

export default function CoachingSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const coachingServices = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Olympic-Level Training",
      description: "Learn from a three-time Olympian with proven success at the highest levels of international competition."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personalized Coaching",
      description: "Individual and group sessions tailored to your experience level and competitive goals."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Competition Preparation",
      description: "Strategic training programs designed to optimize performance when it matters most."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "All Disciplines",
      description: "Expert instruction in dressage, show jumping, and cross-country eventing."
    }
  ];

  return (
    <section id="coaching" className="py-24 bg-gray-50 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6 text-navy">Professional Coaching</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-dark max-w-3xl mx-auto">
            Elevate your equestrian skills with tailored coaching sessions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-playfair font-bold mb-6 text-navy">Why Train with Dan?</h3>
              <p className="text-lg text-dark leading-relaxed mb-6 font-medium">
                With over 20 years of international competition experience and a big passion for helping other riders communicate better with their horses as well as achieving great results, Dan brings unparalleled expertise to every training session. His proven methodology has helped riders at all levels achieve their competitive goals.
              </p>
              <p className="text-lg text-dark leading-relaxed font-medium">
                Whether you're just starting your equestrian journey or aiming for international competition, Dan's personalized approach ensures every rider reaches their full potential.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-navy/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange">20+</div>
                <div className="text-sm text-dark">Years Experience</div>
              </div>
              <div className="bg-navy/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange">2014</div>
                <div className="text-sm text-dark">RoR Elite Champion</div>
              </div>
              <div className="bg-navy/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange">2025</div>
                <div className="text-sm text-dark">Olympic Short Listed</div>
              </div>
              <div className="bg-navy/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange">2nd</div>
                <div className="text-sm text-dark">Nations Cup Boekelo</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Dan Bizzarro coaching a student" 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-orange text-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center space-x-3">
                <Award className="text-2xl" />
                <div>
                  <div className="font-semibold">Professional Coach</div>
                  <div className="text-sm opacity-80">International Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {coachingServices.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg border border-gray-100">
              <div className="text-orange mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-playfair font-bold mb-3 text-navy">{service.title}</h3>
              <p className="text-dark text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          <h3 className="text-2xl font-playfair font-bold text-navy">Ready to Start Your Journey?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('#clinics')}
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Book a Clinic
            </Button>
            <Button 
              onClick={() => scrollToSection('#training-videos')}
              variant="outline"
              className="border-2 border-navy text-navy hover:bg-navy hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Watch Training Videos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}