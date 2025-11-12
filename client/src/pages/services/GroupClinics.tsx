import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ClinicsSection from "@/components/ClinicsSection";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Users, Award, Target, MapPin, Clock } from "lucide-react";
import clinicsHeroImage from "@assets/optimized/DBCLINIC-83_1762928005686.jpg";
import { useQuery } from "@tanstack/react-query";
import type { Clinic } from "@shared/schema";

export default function GroupClinics() {
  const { data: clinics = [] } = useQuery<any[]>({
    queryKey: ['/api/clinics'],
  });

  // Get next 3 upcoming clinics
  const upcomingClinics = clinics
    .filter(clinic => new Date(clinic.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const features = [
    "Single-day training sessions for all levels",
    "Show-jumping, polework, and cross country options",
    "Small group sizes for individual attention",
    "Suitable for amateur riders and competitors",
    "Competition preparation and confidence building",
    "Expert instruction from international eventing coach"
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Learn Together",
      description: "Train alongside riders at your level in a supportive group environment"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Expert Coaching",
      description: "Develop your skills with guidance from an experienced eventing coach"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Achieve Your Goals",
      description: "Whether competing or riding for pleasure, reach your personal objectives"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Show Jumping, Polework & Cross Country Clinics | Dan Bizzarro Method"
        description="Join our show-jumping clinic, polework clinic, and cross country clinic in Oxfordshire. Expert eventing coach Dan Bizzarro offers competition preparation clinics and single-day training for all levels."
        keywords="show-jumping clinic, polework clinic, cross country clinic, competition preparation clinic, eventing coach, equestrian lessons Oxfordshire, Dan Bizzarro Method, show jumping coach"
        canonical="https://danbizzarromethod.com/coaching/clinics"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <img
          src={clinicsHeroImage}
          alt="Dan Bizzarro coaching group clinic with riders and horses"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Calendar className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Clinics
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Show jumping, polework & cross country training for all levels
            </p>
          </div>
        </div>
      </section>

      {/* Next 3 Upcoming Clinics */}
      {upcomingClinics.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair font-bold text-navy mb-2">
                Upcoming Clinics
              </h2>
              <p className="text-gray-600">Join us at our next training sessions</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingClinics.map((clinic) => (
                <div 
                  key={clinic.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-4 text-white" style={{ background: 'linear-gradient(to right, #ee7d3f, #ee7d3fcc)' }}>
                    <h3 className="text-xl font-playfair font-bold mb-1 line-clamp-2">{clinic.title}</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(clinic.date)}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-orange" />
                      <span>{clinic.location}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2">{clinic.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-2xl font-bold text-orange">
                        {clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                          ? `from £${(Math.min(...clinic.sessions.map((s: any) => s.price)) / 100).toFixed(0)}`
                          : clinic.price > 0 
                            ? `£${(clinic.price / 100).toFixed(0)}`
                            : 'Price TBA'
                        }
                      </div>
                      <Button 
                        size="sm"
                        className="bg-navy hover:bg-slate-800 text-white"
                        onClick={() => {
                          // Scroll to clinics section
                          const element = document.getElementById('clinics');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                          
                          // Trigger registration for this clinic after scroll
                          setTimeout(() => {
                            const registerButton = document.querySelector(`[data-clinic-id="${clinic.id}"] button:not([disabled])`) as HTMLButtonElement;
                            if (registerButton && registerButton.textContent?.includes('Register')) {
                              registerButton.click();
                            }
                          }, 600);
                        }}
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
                Expert Training in Oxfordshire
              </h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Our group clinics offer specialized training in show jumping, polework, and cross country, taught by international eventing coach Dan Bizzarro. These single-day sessions welcome riders from beginner to advanced levels—whether you ride for pleasure or competition.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Each clinic focuses on the Dan Bizzarro Method, combining technical instruction with practical application. With small group sizes, you receive personalized feedback while benefiting from watching fellow riders tackle similar challenges.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Our equestrian lessons in Oxfordshire cater to both amateur riders building confidence and competitors preparing for events. From foundational polework clinics to advanced show-jumping and cross country sessions, there's a clinic designed for your goals.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-6">What's Included</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start text-dark">
                    <Check className="w-5 h-5 text-orange mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Why Join a Clinic?
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-2xl p-8 text-center"
                data-testid={`benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-orange/10 p-4 rounded-full text-orange">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-navy mb-3">{benefit.title}</h3>
                <p className="text-dark leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t-4 border-orange"></div>

      {/* Upcoming Clinics Section */}
      <ClinicsSection />

      {/* Divider */}
      <div className="border-t-4 border-navy"></div>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Join Our Next Clinic
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Book your Competition Preparation Clinic or join a training session for all levels
          </p>
          <Link href="/#clinics">
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 mr-4"
              data-testid="button-view-clinics"
            >
              View Clinic Schedule
            </Button>
          </Link>
          <Link href="/contact">
            <Button 
              className="bg-white hover:bg-gray-100 text-navy px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-contact"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
