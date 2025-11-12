import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Target, Check, Zap, TrendingUp, Calendar } from "lucide-react";

export default function Polework() {
  const features = [
    "Ground pole exercises for rhythm and balance",
    "Raised poles for strength and engagement",
    "Grid work for adjustability and technique",
    "Gymnastic jumping combinations",
    "Progressive pole patterns for all levels",
    "Distance and stride development exercises"
  ];

  const focusAreas = [
    {
      title: "Rhythm & Balance",
      description: "Develop consistent rhythm, improve balance, and establish reliable tempo through systematic pole exercises"
    },
    {
      title: "Strength & Suppleness",
      description: "Build muscle strength, enhance flexibility, and improve overall athleticism with raised pole work"
    },
    {
      title: "Jumping Technique",
      description: "Refine bascule, improve scope, and develop adjustability through gymnastic grid exercises"
    },
    {
      title: "Confidence Building",
      description: "Progress safely from ground poles to raised exercises, building trust and boldness step by step"
    }
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Low-Risk Training",
      description: "Build skills without the physical demands of full jumping sessions"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Results",
      description: "See immediate improvements in rhythm, balance, and technique"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progressive Development",
      description: "Systematic training from basic poles to advanced gymnastic exercises"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Polework Training - Grid Work & Gymnastic Exercises | Dan Bizzarro"
        description="Expert polework and grid work coaching in Oxfordshire with Dan Bizzarro. Build rhythm, balance, and jumping technique through gymnastic pole exercises. Available in clinics, private lessons, and virtual coaching for all levels."
        keywords="polework training, pole work, grid work, gymnastic jumping, ground poles, raised poles, eventing poles, show jumping poles, pole exercises, equestrian gymnastics, rhythm training, balance exercises, Oxfordshire polework coach, polework clinics"
        canonical="https://danbizzarromethod.com/coaching/polework"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-navy to-slate-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Polework Training
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Build rhythm, balance, and technique through gymnastic exercises
            </p>
            <a
              href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20polework%20coaching%20session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
              data-testid="button-book-lesson"
            >
              Book a Lesson
            </a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Expert Polework Coaching in Oxfordshire
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Our professional polework training in Oxfordshire combines systematic pole exercises with expert coaching to develop rhythm, balance, and jumping technique. As an international eventing coach, Dan Bizzarro uses grid work and gymnastic pole exercises to create confident, adjustable horses and riders across all eventing disciplines.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Polework coaching is available in multiple formats: specialized polework clinics for group learning, private lessons for personalized grid work instruction, and virtual coaching sessions where you submit video for detailed pole exercise analysis. This flexibility ensures every rider—from complete beginners to international competitors—can access expert pole work training.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Whether you're an amateur rider building foundational balance through ground poles or a competitive eventer refining jumping technique with advanced gymnastic grids, our equestrian polework coaching in Oxfordshire delivers systematic training that improves rhythm, suppleness, and overall performance in dressage, show jumping, and cross country.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-6">Training Focus</h3>
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

      {/* Focus Areas Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              What We Cover
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg"
                data-testid={`focus-area-${area.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <h3 className="text-2xl font-playfair font-bold text-navy mb-3">{area.title}</h3>
                <p className="text-dark leading-relaxed">{area.description}</p>
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
              Why Polework Training Works
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

      {/* Training Options Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Choose Your Training Format
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark max-w-3xl mx-auto">
              Access expert polework coaching through clinics, private lessons, or virtual sessions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-orange/10 p-4 rounded-full text-orange">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4 text-center">Polework Clinics</h3>
              <p className="text-dark mb-6 text-center leading-relaxed">
                Group sessions focused on progressive pole exercises and gymnastic grid work for all levels
              </p>
              <div className="text-center">
                <Link href="/coaching/clinics">
                  <Button className="bg-orange hover:bg-orange/90 text-white w-full">
                    View Upcoming Clinics
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-orange/10 p-4 rounded-full text-orange">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4 text-center">Private Polework Lessons</h3>
              <p className="text-dark mb-4 text-center leading-relaxed">
                One-on-one coaching tailored to your specific pole work and grid work goals
              </p>
              <p className="text-2xl font-playfair font-bold text-navy mb-4 text-center">£80 per session</p>
              <div className="text-center">
                <Link href="/coaching/private-lessons">
                  <Button className="bg-orange hover:bg-orange/90 text-white w-full">
                    Book Private Lesson
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-orange/10 p-4 rounded-full text-orange">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4 text-center">Virtual Polework Coaching</h3>
              <p className="text-dark mb-4 text-center leading-relaxed">
                Submit video of your pole work sessions for expert analysis and feedback
              </p>
              <p className="text-2xl font-playfair font-bold text-navy mb-4 text-center">£80 per session</p>
              <div className="text-center">
                <Link href="/coaching/remote-coaching">
                  <Button className="bg-orange hover:bg-orange/90 text-white w-full">
                    Get Virtual Coaching
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Ready to Improve Your Polework Skills?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Start building rhythm, balance, and technique with expert grid work coaching
          </p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20polework%20training"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
