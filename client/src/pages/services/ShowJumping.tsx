import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      description: "Reduce poles and time faults for better competition results"
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

  const faqs = [
    {
      question: "How can I stop knocking down poles in show jumping?",
      answer: "Knocking poles usually stems from several factors: rider position (getting ahead or behind the movement), pace issues (too fast or too slow), poor line or distance, or lack of horse carefulness. Dan addresses all these areas through systematic training—improving your position, developing better rhythm, teaching you to see distances, and using gymnastic exercises to improve your horse's technique and carefulness. Consistent, correct training produces cleaner rounds."
    },
    {
      question: "What is grid work and how does it help?",
      answer: "Grid work (also called gymnastic jumping) involves a series of fences set at specific distances that guide the horse through without rider interference. Grids develop better bascule (the horse's jumping arc), improve adjustability, strengthen muscles, build confidence, and teach horses to think and react quickly. For riders, grids improve timing, strengthen position, and develop feel. Dan uses progressive grid exercises as a foundation for all show jumping training."
    },
    {
      question: "How do I learn to see distances to jumps?",
      answer: "Seeing distances comes from developing rhythm, understanding stride length, and gaining experience. Dan teaches riders to establish consistent rhythm first, then gradually develops distance awareness through progressive exercises. Counting strides, working over ground poles, riding related distances, and analysing courses all contribute. Most importantly, Dan teaches you to trust your horse's rhythm and avoid micromanaging—good rhythm produces good distances more reliably than trying to 'find' every stride."
    },
    {
      question: "Do you teach show jumping at all levels?",
      answer: "Yes, Dan coaches show jumping from beginner to advanced international levels. Whether you're just learning to jump small fences or competing at championship level, the training principles remain consistent—sound position, good rhythm, straight lines, and systematic progression. Dan tailors exercises and fence heights to match your current ability while building skills for future advancement."
    },
    {
      question: "Can show jumping lessons help with eventing?",
      answer: "Absolutely! Show jumping is one of the three eventing phases. Good show jumping skills directly improve your eventing results by reducing penalties in the jumping phase and developing the adjustability, technique, and confidence needed for cross country. Many of Dan's show jumping clients are eventers looking to improve their jumping scores and build skills that translate across all phases."
    },
    {
      question: "What if my horse rushes or gets anxious about jumping?",
      answer: "Rushing and anxiety often stem from tension, confusion, or past experiences. Dan addresses these issues systematically through building confidence with simpler exercises, establishing better rhythm and relaxation, using polework and grids to develop calmness, and ensuring the horse understands what's expected. Patience, consistency, and correct training transform anxious jumpers into confident partners. The key is building positive experiences and never rushing the training process."
    },
    {
      question: "How do I walk a show jumping course effectively?",
      answer: "Course walking is a crucial skill Dan teaches all competitive riders. It involves analysing each fence, planning your lines and turns, counting strides in related distances, identifying potential problems, and creating a riding plan. Dan teaches you to walk like a professional—understanding jump design, terrain, footing, and how to set up each fence for success. Good course walking directly improves competition results."
    },
    {
      question: "What's the difference between show jumping and cross country jumping?",
      answer: "Show jumping uses colourful, moveable fences in an enclosed arena, ridden at a controlled pace with precision and accuracy prioritised. Cross country uses fixed natural obstacles across varying terrain, ridden at speed with boldness and trust emphasised. However, both require good technique, rider position, and horse training. Skills developed in show jumping—rhythm, straightness, adjustability—directly benefit cross country performance. Dan coaches both disciplines for well-rounded training."
    },
    {
      question: "How often should I have show jumping lessons?",
      answer: "Lesson frequency depends on your goals, budget, and schedule. Competitive riders often train weekly or more frequently leading up to competitions. Amateur riders may prefer fortnightly or monthly sessions. Dan works with riders at all frequencies, ensuring each lesson builds on previous training and provides exercises to practice between sessions. Consistency matters more than frequency—regular lessons, even if spaced apart, produce better results than intensive bursts followed by long gaps."
    },
    {
      question: "Can I improve my jumping without jumping every session?",
      answer: "Definitely! Too much jumping can cause physical stress and mental sourness. Dan incorporates polework, flatwork, and gymnastic exercises that develop jumping skills without constant jumping. Dressage training improves balance and adjustability. Polework strengthens technique and rhythm. Grid work provides maximum benefit with minimal physical stress. This varied approach produces better jumpers while keeping horses fresh, sound, and enthusiastic."
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
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Build confidence, refine technique, and jump clear
            </p>
            <a
              href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20show%20jumping%20coaching%20session"
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark">
              Everything you need to know about show jumping training
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
            Jump Clear and Confident
          </h2>
          <p className="text-3xl font-playfair font-bold text-orange mb-4">
            £80 per private session
          </p>
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
