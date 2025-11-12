import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Target, Check, Zap, Heart, Shield } from "lucide-react";

export default function CrossCountry() {
  const features = [
    "Natural obstacle training and technique",
    "Speed and terrain management",
    "Risk assessment and decision-making",
    "Partnership and trust building",
    "Competition preparation and tactics",
    "Safety and confidence development"
  ];

  const focusAreas = [
    {
      title: "Boldness & Confidence",
      description: "Develop the courage and trust needed to tackle cross-country courses at speed"
    },
    {
      title: "Technical Skills",
      description: "Master water complexes, ditches, banks, and combinations with precision"
    },
    {
      title: "Speed & Rhythm",
      description: "Learn to maintain optimal pace while staying safe and in control"
    },
    {
      title: "Course Walking",
      description: "Analyze terrain, plan routes, and make smart tactical decisions"
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Trust & Partnership",
      description: "Build an unshakeable bond with your horse through shared experiences"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Thrill of Speed",
      description: "Experience the excitement of cross-country with skill and safety"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Smart",
      description: "Develop judgment to ride boldly while making wise decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Cross Country Training - Natural Obstacles & Speed Work | Dan Bizzarro"
        description="Expert cross-country coaching in Oxfordshire with Dan Bizzarro. Build confidence, master natural obstacles, and develop the partnership and boldness needed for eventing success. Train smart and safe."
        keywords="cross country training, eventing cross country, natural obstacles, terrain riding, water complex, banks, ditches, competition preparation, Oxfordshire cross country"
        canonical="https://danbizzarromethod.com/coaching/cross-country"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Cross Country
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Be confident, have fun, and jump boldly across country
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6 text-center">
                The Heart of Eventing
              </h2>
              <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Cross-country is where eventing truly comes alive—the thrill of galloping across varied terrain, the challenge of natural obstacles, and the deep partnership between horse and rider. Dan's training builds both the technical skills and mental confidence needed to tackle cross-country courses safely and successfully.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Training focuses on developing boldness without recklessness, teaching you to read terrain, manage speed, and make smart decisions at pace. Every session strengthens the trust and communication that forms the foundation of safe, successful cross-country riding.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                From novice-level introductions to advanced international courses, the training emphasizes progressive development, ensuring both horse and rider gain experience and confidence at the appropriate pace for their level.
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
              Why Cross-Country Training?
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

      {/* Obstacle Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Obstacle Training
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Water Complexes</h4>
              <p className="text-dark">Build confidence jumping into, through, and out of water at all levels</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Ditches & Drops</h4>
              <p className="text-dark">Develop trust and technique for ditches, coffins, and drop fences</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Banks & Steps</h4>
              <p className="text-dark">Master up-and-down banks, steps, and related combinations</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Technical Combinations</h4>
              <p className="text-dark">Navigate complex multi-element questions with precision and confidence</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Terrain Riding</h4>
              <p className="text-dark">Learn to manage hills, turns, and footing at optimum speed</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Skinny Fences</h4>
              <p className="text-dark">Develop accuracy and straightness for narrow obstacles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Safe & Smart Training
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8">
            <p className="text-lg text-dark leading-relaxed mb-4">
              Cross-country training emphasizes safety above all else. Progressive introduction to obstacles, careful assessment of horse and rider capabilities, and smart training decisions ensure development without unnecessary risk.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              Dan's extensive international experience means training focuses on building genuine confidence through proper preparation, not false bravado. You'll learn when to be bold and when to be cautious—judgment that keeps you and your horse safe for the long term.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Ready to Go Cross Country?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Build confidence and master natural obstacles with expert coaching
          </p>
          <Link href="/contact">
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-xc"
            >
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
