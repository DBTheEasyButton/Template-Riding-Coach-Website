import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ClinicsSection from "@/components/ClinicsSection";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Users, Award, Target } from "lucide-react";

export default function GroupClinics() {
  const features = [
    "Fun, relaxed single-day sessions",
    "Pole work, jumping, and flatwork options",
    "Small group sizes for personalized attention",
    "Focus on confidence and enjoyment",
    "Perfect for amateur riders of all levels",
    "Supportive group atmosphere and learning together"
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Friendly Group Environment",
      description: "Enjoy riding with like-minded people in a relaxed, supportive atmosphere"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Build Your Confidence",
      description: "Develop skills at your own pace with encouragement and positive feedback"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Have More Fun",
      description: "Rediscover the joy of riding and enjoy the journey, not just the destination"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Group Riding Clinics - Fun, Friendly Sessions | Dan Bizzarro"
        description="Join Dan Bizzarro's welcoming group clinics in Oxfordshire. Single-day sessions covering pole work, jumping, and flatwork. Perfect for amateur riders building confidence and having fun."
        keywords="riding clinics, group lessons, pole work clinics, jumping clinics, flatwork training, Oxfordshire equestrian, confidence building, amateur riders, fun riding sessions"
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
              Fun, friendly sessions to build confidence and enjoy your riding
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
                Relaxed, Enjoyable Learning
              </h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Group clinics are designed for amateur riders who want to improve their skills and have fun doing it! Whether you're interested in pole work, jumping, or flatwork, these single-day sessions provide a friendly, supportive environment to learn and grow.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                With small group sizes, you'll get plenty of individual attention while enjoying the camaraderie of riding with others. No pressure, no stress—just quality instruction and lots of encouragement.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Most riders join simply to build their confidence, feel more secure in the saddle, and rediscover the joy of riding. You don't need to compete to benefit—just come ready to learn and have a great time!
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
