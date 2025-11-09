import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Users, Award, Target } from "lucide-react";

export default function GroupClinics() {
  const features = [
    "Multi-day intensive training programs",
    "All three eventing disciplines covered",
    "Small group sizes for quality instruction",
    "Competition preparation focus",
    "Structured lesson progression",
    "Group camaraderie and learning"
  ];

  const clinicFormats = [
    {
      title: "Weekend Clinics",
      description: "Two-day intensive training covering multiple disciplines",
      duration: "Saturday & Sunday"
    },
    {
      title: "Multi-Day Events",
      description: "Extended training camps with comprehensive instruction",
      duration: "3-5 days"
    },
    {
      title: "Discipline-Specific",
      description: "Focused clinics on dressage, jumping, or cross-country",
      duration: "1-2 days"
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Learn from Others",
      description: "Watch and learn from fellow riders facing similar challenges"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Comprehensive Training",
      description: "Cover all three phases in an intensive, structured program"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Competition Ready",
      description: "Prepare for upcoming events with focused, goal-oriented training"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Group Eventing Clinics - Multi-Day Training Programs | Dan Bizzarro"
        description="Join Dan Bizzarro's intensive group clinics in Oxfordshire. Multi-day training covering dressage, show jumping, and cross-country. Small groups, comprehensive instruction, and competition preparation."
        keywords="eventing clinics, group training, multi-day clinics, dressage clinics, show jumping clinics, cross country training, Oxfordshire equestrian clinics, competition preparation"
        canonical="https://dan-bizzarro.replit.app/services/group-clinics"
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
              Group Clinics
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Intensive multi-day training for comprehensive development
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
                Immersive Training Experience
              </h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Group clinics provide an intensive, comprehensive training experience that accelerates your development across all three eventing disciplines. Train alongside riders of similar levels while benefiting from Dan's expert instruction.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                With small group sizes, you receive quality individual attention while also learning from watching others. This unique format combines the best of both private and group instruction.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Whether preparing for competition season or seeking to improve specific skills, clinics offer structured progression and intensive practice that delivers measurable results.
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

      {/* Clinic Formats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Clinic Formats
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {clinicFormats.map((format, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg"
                data-testid={`clinic-format-${format.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <h3 className="text-2xl font-playfair font-bold text-navy mb-3 text-center">{format.title}</h3>
                <div className="text-center mb-4">
                  <span className="inline-block bg-orange/10 text-orange px-4 py-2 rounded-full text-sm font-semibold">
                    {format.duration}
                  </span>
                </div>
                <p className="text-dark leading-relaxed text-center">{format.description}</p>
              </div>
            ))}
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

      {/* Typical Schedule Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Typical Weekend Clinic Schedule
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start">
                <div className="bg-orange text-white rounded-lg px-4 py-2 mr-4 font-semibold min-w-[100px] text-center">
                  Saturday AM
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1">Flat Work & Dressage</h4>
                  <p className="text-dark">Foundation work, balance, and technical development</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start">
                <div className="bg-orange text-white rounded-lg px-4 py-2 mr-4 font-semibold min-w-[100px] text-center">
                  Saturday PM
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1">Show Jumping</h4>
                  <p className="text-dark">Technique, course strategy, and building confidence</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start">
                <div className="bg-orange text-white rounded-lg px-4 py-2 mr-4 font-semibold min-w-[100px] text-center">
                  Sunday AM
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1">Cross-Country</h4>
                  <p className="text-dark">Natural obstacles, terrain riding, and tactical training</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start">
                <div className="bg-orange text-white rounded-lg px-4 py-2 mr-4 font-semibold min-w-[100px] text-center">
                  Sunday PM
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1">Competition Preparation</h4>
                  <p className="text-dark">Integrated training and strategic planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Join Our Next Clinic
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            View upcoming clinic dates and secure your spot for intensive training
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
