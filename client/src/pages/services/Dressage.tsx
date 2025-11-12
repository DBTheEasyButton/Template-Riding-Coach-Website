import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Target, Check, Award, TrendingUp } from "lucide-react";

export default function Dressage() {
  const features = [
    "Classical training principles and foundation",
    "Balance, rhythm, and suppleness development",
    "Test preparation and performance strategy",
    "Rider position and effectiveness improvement",
    "Progressive exercises for all levels",
    "Competition test riding and scoring optimization"
  ];

  const focusAreas = [
    {
      title: "Foundation Training",
      description: "Establish correct basics: rhythm, relaxation, and contact for all future work"
    },
    {
      title: "Lateral Work",
      description: "Shoulder-in, leg-yield, and more advanced movements for suppleness and engagement"
    },
    {
      title: "Collection & Extension",
      description: "Develop adjustability in all gaits for higher-level test requirements"
    },
    {
      title: "Test Preparation",
      description: "Perfect competition tests with attention to geometry, accuracy, and presentation"
    }
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision & Accuracy",
      description: "Master the technical requirements for competitive success"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Higher Scores",
      description: "Improve your dressage marks and overall eventing rankings"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progressive Training",
      description: "Systematic development from novice through advanced levels"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Dressage Training - Flat Work & Competition Prep | Dan Bizzarro"
        description="Expert dressage and flat work training in Oxfordshire with Dan Bizzarro. Classical principles, test preparation, and technical development for eventers at all levels. Improve your dressage scores."
        keywords="dressage training, flat work coaching, eventing dressage, dressage test preparation, classical dressage, lateral work, collection, Oxfordshire dressage coach"
        canonical="https://danbizzarromethod.com/coaching/dressage"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Flat Work & Dressage
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Build foundation skills and maximize your dressage scores
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              The Foundation of Everything
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Dressage is the cornerstone of eventing success. Strong flat work creates balance, suppleness, and communication that carries through to jumping and cross-country performance. Dan's classical training approach builds a solid foundation while preparing you for competitive success.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Whether you're working on basic test movements or refining advanced collection, every session focuses on developing harmony between horse and rider. This technical mastery translates directly into improved dressage scores and better overall eventing results.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Training emphasizes correct basics: rhythm, relaxation, contact, impulsion, straightness, and collection—the classical training scale that produces consistent, competitive performances.
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
              Why Dressage Matters for Eventers
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

      {/* Levels Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Training for All Levels
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Novice & Intermediate</h4>
              <p className="text-dark">Establish solid basics, accurate test riding, and develop confidence in the dressage arena</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Advanced & CCI Levels</h4>
              <p className="text-dark">Refine collection, medium and extended work, and master technical movements for higher-level tests</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Young Horse Development</h4>
              <p className="text-dark">Progressive training methods to develop young horses with correct foundation and long-term soundness</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Improve Your Dressage Scores
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Book a session and start mastering the foundation of eventing
          </p>
          <Link href="/contact">
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-dressage"
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
