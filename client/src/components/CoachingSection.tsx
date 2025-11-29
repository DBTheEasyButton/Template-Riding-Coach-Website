import { Button } from "@/components/ui/button";
import { Award, Users, Target, Star, Video } from "lucide-react";
import coachingImage1 from "@assets/optimized/1_1749388256611.jpg";
import coachingImage2 from "@assets/optimized/2_1749388256612.jpg";

export default function CoachingSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const coachingServices = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Private Lessons",
      description: "One-on-one personalized instruction tailored to your specific riding goals and experience level."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Clinics",
      description: "Group training sessions combining technical instruction with competitive preparation strategies."
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Remote Lessons",
      description: "Virtual coaching sessions allowing you to receive expert guidance from anywhere in the world."
    },
  ];

  return (
    <section id="coaching" className="py-24 bg-gray-50 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6 text-navy">Coaching</h2>
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
              <p className="text-lg text-dark leading-relaxed mb-6 font-medium">
                Dan offers comprehensive instruction across all three eventing disciplines: <strong>flat work</strong> for foundation and dressage development, <strong>jumping</strong> for technique and confidence, and <strong>cross-country</strong> for boldness and precision over natural obstacles.
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
          
          <div className="space-y-6">
            <div className="relative">
              <img 
                src={coachingImage1} 
                alt="Dan Bizzarro coaching flat work - personalized instruction in the arena" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange text-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <Award className="text-2xl" />
                  <div>
                    <div className="font-semibold">Flat work and jumping lessons</div>
                    <div className="text-sm opacity-80">Technique & Foundation</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={coachingImage2} 
                alt="Dan Bizzarro coaching cross-country - group instruction at training obstacles" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <Target className="text-2xl" />
                  <div>
                    <div className="font-semibold">Cross country lessons</div>
                    <div className="text-sm opacity-80">Be confident and have fun</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {coachingServices.map((service, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg border border-gray-100 ${
                (service.title === 'Private Lessons' || service.title === 'Clinics') ? 'cursor-pointer hover:shadow-xl' : ''
              }`}
              onClick={
                service.title === 'Private Lessons' ? () => scrollToSection('#contact') :
                service.title === 'Clinics' ? () => scrollToSection('#clinics') : undefined
              }
            >
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
            <Button 
              onClick={() => scrollToSection('#clinics')}
              className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Book a Clinic
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/447767291713', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Book a Private Lesson
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}