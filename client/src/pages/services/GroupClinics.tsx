import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ClinicsSection from "@/components/ClinicsSection";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Users, Award, Target } from "lucide-react";

export default function GroupClinics() {
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
        canonical="https://dan-bizzarro.replit.app/coaching/clinics"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-navy to-slate-700">
        <div className="absolute inset-0 bg-black/30"></div>
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
