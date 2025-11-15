import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, Check, Zap, Heart, Shield } from "lucide-react";
import crossCountryHeroJpg from "@assets/optimized/cross-country-hero.jpg";
import crossCountryHeroWebp from "@assets/optimized/cross-country-hero.webp";
import crossCountryClinicJpg from "@assets/optimized/cross-country-clinic.jpg";
import crossCountryClinicWebp from "@assets/optimized/cross-country-clinic.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { coachingServices, getBreadcrumbsFromPath, createBreadcrumbSchema, createFAQSchema } from "@shared/schemaHelpers";

export default function CrossCountry() {
  const seoConfig = getSEOConfig('/coaching/cross-country');
  const breadcrumbs = getBreadcrumbsFromPath('/coaching/cross-country', seoConfig.h1);
  
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

  const faqs = [
    {
      question: "How do I build confidence for cross country?",
      answer: "Building cross country confidence requires systematic training, positive experiences, and the right coaching. Dan works progressively—starting with simple obstacles and gradually increasing challenge as horse and rider gain confidence. Training focuses on developing a partnership built on trust, ensuring both horse and rider understand what's expected, and celebrating small victories. Confidence comes from competence, so Dan emphasizes correct technique, smart decision-making, and preparation that makes you ready to tackle any course with boldness and safety."
    },
    {
      question: "What makes cross country different from other jumping disciplines?",
      answer: "Cross country involves jumping fixed natural obstacles across varied terrain at speed—unlike show jumping's moveable fences in an arena. The combination of speed, terrain, and solid obstacles requires boldness, trust, quick thinking, and strong partnerships. Riders must assess terrain, choose lines, manage pace, and commit to fences that don't fall down. This makes cross country the ultimate test of horse and rider partnership, demanding both physical skill and mental courage."
    },
    {
      question: "How do you train horses to jump into water?",
      answer: "Water training requires patience and systematic progression. Dan introduces water gradually—first walking through, then trotting, then establishing confidence before introducing fences. Horses learn that water is safe and manageable through positive experiences. Training progresses from simple water entries to steps into water, jumps over water, and eventually complex water combinations. The key is never rushing the process and ensuring each step builds confidence rather than creating anxiety."
    },
    {
      question: "What is course walking and why is it important?",
      answer: "Cross country course walking is essential preparation where you analyse each obstacle, assess terrain and footing, plan your lines and speeds, identify options and alternatives, and make tactical decisions. Dan teaches riders to walk professionally—understanding fence design, terrain challenges, optimal lines, and where to take time or make it up. Good course walking can make the difference between a clear round and problems, helping you ride smart and safe."
    },
    {
      question: "How fast should I go cross country?",
      answer: "Speed depends on your level, your horse's experience, course conditions, and competition requirements. Dan teaches riders to understand optimum time requirements, balance speed with safety, maintain rhythm rather than rushing, and make intelligent pace decisions based on terrain and obstacles. For many riders, especially at lower levels, riding within their comfort zone and finishing confidently matters more than chasing time. As skills develop, speed comes naturally without forcing or taking unnecessary risks."
    },
    {
      question: "What if my horse refuses at a cross country fence?",
      answer: "Refusals happen for many reasons—lack of confidence, confusion about the question, loss of rhythm or impulsion, or difficulty reading the obstacle. Dan helps riders understand why refusals occur and develop strategies to prevent them. This includes better preparation, maintaining forward thinking and rhythm, giving clear aids, choosing appropriate lines, and ensuring obstacles are within your horse's current ability level. Sometimes refusals indicate you need to step back and build more foundation before attempting certain obstacles."
    },
    {
      question: "Do I need my own cross country course to train?",
      answer: "No! While access to cross country obstacles is valuable, Dan can develop cross country skills through show jumping, polework, terrain work, and specific exercises that build the necessary attributes—boldness, adjustability, rhythm at speed, quick thinking. When Dan conducts cross country clinics, he provides access to proper courses with varied obstacles. Many successful eventers develop their skills through periodic clinic training combined with other work that builds the foundation for cross country success."
    },
    {
      question: "Is cross country dangerous?",
      answer: "Cross country carries inherent risks due to speed, solid obstacles, and terrain, but proper training, progressive preparation, riding within your ability, and smart decision-making make it safer. Dan emphasizes safety through systematic skill development, teaching risk assessment, ensuring proper preparation, and building confidence gradually. The key is never taking on more than you and your horse are ready for, always wearing proper safety equipment, and training with an experienced coach who prioritizes smart, safe riding."
    },
    {
      question: "What equipment do I need for cross country training?",
      answer: "For cross country, you'll need a properly fitted safety vest (body protector), certified riding helmet meeting current safety standards, cross country boots or wraps for your horse's legs, appropriate studs for footing conditions, and medical armband with emergency information. Dan can advise on proper equipment selection and fitting. Safety equipment is non-negotiable for cross country training and competition."
    },
    {
      question: "Can beginners learn cross country or is it only for advanced riders?",
      answer: "Beginners can absolutely learn cross country! Dan works with riders at all levels, starting with simple obstacles suitable for confidence building. Everyone starts somewhere, and with proper progression, patient instruction, and age-appropriate obstacles, even novice riders can safely experience the joy of cross country. The key is matching training to current ability, progressing systematically, and building skills with an experienced coach who understands how to develop confidence safely."
    }
  ];

  const schemas = [
    coachingServices.crossCountry,
    createBreadcrumbSchema(breadcrumbs),
    createFAQSchema(faqs)
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        preloadImage={crossCountryHeroWebp}
        preloadImageJpeg={crossCountryHeroJpg}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <HeroPicture
          jpegSrc={crossCountryHeroJpg}
          webpSrc={crossCountryHeroWebp}
          alt="Dan Bizzarro cross country at CCI Saumur"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Cross Country
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Be confident, have fun, and jump boldly across country
            </p>
            <a
              href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20cross%20country%20coaching%20session"
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
              Expert Cross Country Coaching in Oxfordshire
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Our expert cross country coaching in Oxfordshire brings eventing to life—the thrill of galloping across varied terrain, the challenge of natural obstacles, and the deep partnership between horse and rider. As an international eventing coach and cross country specialist, Dan Bizzarro's training builds both the technical skills and mental confidence needed to tackle cross-country courses safely and successfully.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Our cross country training focuses on developing boldness without recklessness, teaching you to read terrain, manage speed, and make smart tactical decisions at pace. Every equestrian lesson strengthens the trust and communication that forms the foundation of safe, successful cross-country riding—from water complexes and banks to ditches and technical combinations.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                From novice-level introductions to advanced international eventing courses, our cross country coaching in Oxfordshire emphasizes progressive development, ensuring both horse and rider gain experience and confidence at the appropriate pace. Whether you're an amateur rider building cross country skills or a competitive eventer preparing for advanced courses, our training delivers results.
              </p>
            </div>

            <div className="space-y-6">
              <picture>
                <source srcSet={crossCountryClinicWebp} type="image/webp" />
                <img 
                  src={crossCountryClinicJpg} 
                  alt="Dan Bizzarro teaching cross country at clinic"
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

      {/* CTA Section */}
      <section className="py-12 bg-orange/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
            Ready to Jump with Confidence?
          </h3>
          <p className="text-lg text-dark mb-6">
            Build boldness and tackle cross country courses with expert coaching
          </p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20cross%20country%20coaching%20session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-book-xc-cta"
          >
            Book a Lesson
          </a>
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark">
              Everything you need to know about cross country training
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg border border-gray-200 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-navy pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-dark leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Ready to Go Cross Country?
          </h2>
          <p className="text-3xl font-playfair font-bold text-orange mb-4">
            £80 per private session
          </p>
          <p className="text-xl mb-8 text-gray-200">
            Build confidence and master natural obstacles with expert coaching
          </p>
          <a 
            href="https://wa.me/447767291713?text=Hi%20Dan%2C%20I'd%20like%20to%20book%20a%20cross%20country%20session." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-xc"
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
