import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Award, Check, Zap, TrendingUp } from "lucide-react";
import showJumpingHeroJpg from "@assets/optimized/show-jumping-hero.jpg";
import showJumpingHeroWebp from "@assets/optimized/show-jumping-hero.webp";
import showJumpingClinicJpg from "@assets/optimized/show-jumping-clinic.jpg";
import showJumpingClinicWebp from "@assets/optimized/show-jumping-clinic.webp";

export default function ShowJumping() {
  const features = [
    "Jumping technique and form refinement",
    "Course strategy and walking practice",
    "Confidence building over various fence types",
    "Grid work and gymnastic exercises",
    "Distance and stride management",
    "Competition preparation and mental strategies"
  ];

  const focusAreas = [
    {
      title: "Rider Position",
      description: "Develop a secure, balanced position that allows your horse to jump freely and confidently"
    },
    {
      title: "Horse Technique",
      description: "Improve your horse's bascule, scope, and carefulness for cleaner rounds"
    },
    {
      title: "Course Strategy",
      description: "Learn to walk, plan, and execute technical courses with precision and speed"
    },
    {
      title: "Mental Game",
      description: "Build confidence and mental resilience for pressure situations and competitions"
    }
  ];

  const benefits = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Clear Rounds",
      description: "Reduce rails and time faults for better competition results"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Confidence Building",
      description: "Develop boldness and trust between horse and rider"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progressive Training",
      description: "Systematic development from small fences to championship courses"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Show Jumping Training - Technique & Course Strategy | Dan Bizzarro"
        description="Expert show jumping coaching in Oxfordshire with Dan Bizzarro. Improve technique, build confidence, and master course strategy. Training for all levels from novice to international competition."
        keywords="show jumping coaching, jumping technique, course strategy, grid work, eventing jumping, competition preparation, confidence building, Oxfordshire show jumping"
        canonical="https://danbizzarromethod.com/coaching/show-jumping"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <picture>
          <source srcSet={showJumpingHeroWebp} type="image/webp" />
          <img 
            src={showJumpingHeroJpg} 
            alt="Dan Bizzarro show jumping at international competition"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Show Jumping
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Build confidence, refine technique, and jump clear
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Expert Show Jumping Coaching in Oxfordshire
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Our professional show jumping coaching in Oxfordshire combines technical precision with boldness and partnership. As an experienced show jumping coach and international eventing coach, Dan Bizzarro's systematic approach develops both horse and rider, creating the confidence and jumping technique needed for competitive success in eventing and show jumping.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Show jumping training progresses methodically from fundamental grid work and polework through complex technical courses. Each private show jumping lesson builds on the last, developing the adjustability, carefulness, and scope required at every level—from novice competitors to advanced eventers preparing for championship courses.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Whether you're an amateur rider working on consistency at lower heights or a competitive eventer preparing for championship-level show jumping, our equestrian coaching in Oxfordshire focuses on creating a confident, careful jumping partnership that consistently delivers clear rounds.
              </p>
            </div>

            <div className="space-y-6">
              <picture>
                <source srcSet={showJumpingClinicWebp} type="image/webp" />
                <img 
                  src={showJumpingClinicJpg} 
                  alt="Dan Bizzarro teaching show jumping at clinic"
                  className="w-full rounded-2xl shadow-lg"
                  loading="lazy"
                />
              </picture>
              
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
              Training Benefits
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

      {/* Training Methods Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Training Approach
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Grid Work & Gymnastics</h4>
              <p className="text-dark">Systematic exercises to improve technique, rhythm, and adjustability without mental pressure</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Technical Courses</h4>
              <p className="text-dark">Practice complex lines, related distances, and technical challenges found in competition</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Course Walking</h4>
              <p className="text-dark">Learn to analyze courses, plan strategies, and make winning decisions under pressure</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-2 text-lg">Mental Preparation</h4>
              <p className="text-dark">Develop confidence, focus, and mental resilience for consistent performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Jump Clear and Confident
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Book a session and start improving your show jumping performance
          </p>
          <a 
            href="https://wa.me/447767291713?text=Hi%20Dan%2C%20I'd%20like%20to%20book%20a%20show%20jumping%20session." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-jumping"
            >
              Book Your Session
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
