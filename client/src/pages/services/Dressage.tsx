import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, Check, Award, TrendingUp } from "lucide-react";
import TestimonialStrip from "@/components/TestimonialStrip";
import dressageHeroJpg from "@assets/optimized/dressage-hero.jpg";
import dressageHeroWebp from "@assets/optimized/dressage-hero.webp";
import dressageHeroMobileJpg from "@assets/optimized/dressage-hero-mobile.jpg";
import dressageHeroMobileWebp from "@assets/optimized/dressage-hero-mobile.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { coachingServices, getBreadcrumbsFromPath, createBreadcrumbSchema, createFAQSchema } from "@shared/schemaHelpers";

export default function Dressage() {
  const seoConfig = getSEOConfig('/coaching/dressage');
  const breadcrumbs = getBreadcrumbsFromPath('/coaching/dressage', seoConfig.h1);

  const testimonials = [
    {
      name: "Victoria N.",
      content: "My dressage scores jumped from the low 30s to consistently in the 20s. Dan's focus on the training scale and correct basics made all the difference.",
      rating: 5
    },
    {
      name: "Alice C.",
      content: "Finally understand what 'on the bit' actually means! Dan explains things so clearly and gives exercises that make sense to both me and my horse.",
      rating: 5
    },
    {
      name: "Georgina E.",
      content: "The improvement in my horse's way of going has been remarkable. Better rhythm, better balance, and our jumping has improved too!",
      rating: 5
    }
  ];
  
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

  const faqs = [
    {
      question: "Why is dressage important for eventers?",
      answer: "Dressage is the foundation phase of eventing and accounts for a significant portion of your overall score. Strong dressage scores give you a competitive advantage going into show jumping and cross country. More importantly, dressage training develops balance, rhythm, suppleness, and obedience—qualities that directly improve your horse's jumping ability and cross country performance. A well-trained dressage horse is safer, more responsive, and more enjoyable to ride across all three phases."
    },
    {
      question: "How can I improve my dressage scores?",
      answer: "Improving dressage scores requires consistent training focusing on the fundamentals: rhythm, suppleness, contact, impulsion, straightness, and collection. I work with riders on accurate test riding, proper geometry, correct transitions, and developing quality gaits. Video analysis helps identify areas for improvement. Most importantly, training should develop your horse's way of going, not just teach test movements. Better scores come from better training, not just test practice."
    },
    {
      question: "What dressage levels do you coach?",
      answer: "I coach dressage from novice through advanced levels, working with both amateur riders building foundation skills and competitive eventers preparing for specific tests. Whether you're working on introductory tests or advanced movements, I tailor coaching to your current level and competitive goals. The training principles remain consistent across levels—only the complexity of movements changes."
    },
    {
      question: "Do you offer dressage coaching in clinics or just private lessons?",
      answer: "Dressage coaching is available in both private lessons and group clinics. Private lessons provide individualized attention perfect for test preparation and addressing specific training challenges. Group clinics offer valuable opportunities to watch other riders, learn from shared feedback, and benefit from my expert instruction at a more accessible price point. Many riders combine both formats—clinics for regular training and private lessons for competition preparation."
    },
    {
      question: "Can virtual lessons work for dressage training?",
      answer: "Absolutely! Dressage is particularly well-suited to virtual lessons using live video technology like Pivo. I can see your position, your horse's way of going, the quality of gaits, and the accuracy of movements through the video feed. You hear my coaching in real-time through earbuds, allowing me to provide immediate corrections and guidance. Many riders successfully improve their dressage through virtual coaching, making expert instruction accessible regardless of location."
    },
    {
      question: "What is the 'training scale' or 'pyramid of training'?",
      answer: "The training scale (also called pyramid of training) is the systematic progression of dressage training: rhythm, suppleness, contact, impulsion, straightness, and collection. Each level builds on the previous one—you can't have true collection without first establishing rhythm and suppleness. I use these classical principles to develop horses progressively and correctly, ensuring long-term soundness and performance. Understanding this progression helps riders train more effectively and avoid common training mistakes."
    },
    {
      question: "How do I prepare for a specific dressage test?",
      answer: "Test preparation involves first ensuring your horse can perform all required movements correctly, then practicing the test for accuracy, geometry, and flow. I help riders understand what judges are looking for, improve transitions, develop better geometry, and present movements effectively. However, good test riding comes from good training—I focus on developing your horse's overall way of going rather than just drilling test movements. This approach produces better scores and happier horses."
    },
    {
      question: "What is lateral work and why is it important?",
      answer: "Lateral work includes movements like leg-yield, shoulder-in, travers, renvers, and half-pass where the horse moves forward and sideways simultaneously. These exercises develop suppleness, engagement, straightness, and the ability to move off the rider's leg. Lateral work is essential for advanced dressage, but it also improves jumping horses by enhancing their adjustability, balance, and responsiveness. I teach lateral work progressively, ensuring horses understand and perform movements correctly."
    },
    {
      question: "How can dressage help my show jumping and cross country?",
      answer: "Dressage training creates a more balanced, responsive, and adjustable horse—all crucial for jumping success. Better rhythm and balance mean better jumping technique. Improved suppleness allows horses to move more athletically over fences. Enhanced responsiveness to the aids gives riders better control of pace and line. Collection and extension developed in dressage directly translate to adjustability needed for show jumping combinations and cross country terrain. Dressage makes better jumpers."
    },
    {
      question: "Do I need special dressage tack for lessons?",
      answer: "No special tack is required for dressage lessons. Your regular training saddle and bridle are fine. Competition dressage requires specific tack (dressage saddle, double bridle for advanced levels), but for training, comfort and fit are more important than equipment type. I focus on developing your riding and your horse's training, which matters far more than having specialised equipment."
    }
  ];

  const schemas = [
    coachingServices.dressage,
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
        preloadImage={dressageHeroWebp}
        preloadImageJpeg={dressageHeroJpg}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden pt-16">
        <HeroPicture
          jpegSrc={dressageHeroJpg}
          webpSrc={dressageHeroWebp}
          mobileJpegSrc={dressageHeroMobileJpg}
          mobileWebpSrc={dressageHeroMobileWebp}
          alt="Dan Bizzarro competing in dressage"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Dressage Coaching
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Build foundation skills and maximize your dressage scores
            </p>
            <a
              href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20dressage%20coaching%20session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
              data-testid="button-book-lesson"
            >
              Book a Lesson
            </a>
          </div>
        </div>
      </section>

      <TestimonialStrip customTestimonials={testimonials} />

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Expert Dressage Coaching in Oxfordshire
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                My dressage training in Oxfordshire provides the foundation for eventing success. As an international eventing coach, I deliver specialist flat work coaching that creates balance, suppleness, and communication—essential skills that carry through to jumping and cross-country performance. My classical dressage training approach builds a solid foundation while preparing you for competitive success.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Whether you're working on basic dressage test movements or refining advanced collection, every private lesson focuses on developing harmony between horse and rider. I emphasize the technical mastery that translates directly into improved dressage scores and better overall eventing results.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                My dressage coaching emphasizes the classical training scale: rhythm, relaxation, contact, impulsion, straightness, and collection—proven fundamentals that produce consistent, competitive performances for amateur riders and international competitors alike.
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

      {/* CTA Section */}
      <section className="py-12 bg-orange/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
            Maximize Your Dressage Scores
          </h3>
          <p className="text-lg text-dark mb-6">
            Develop harmony and precision with expert flat work coaching
          </p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20dressage%20coaching%20session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-book-dressage-cta"
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark">
              Everything you need to know about dressage and flatwork training
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
            Improve Your Dressage Scores
          </h2>
          <p className="text-3xl font-playfair font-bold text-orange mb-4">
            £80 per private session
          </p>
          <p className="text-xl mb-8 text-gray-200">
            Book a session and start mastering the foundation of eventing
          </p>
          <a 
            href="https://wa.me/447767291713?text=Hi%20Dan%2C%20I'd%20like%20to%20book%20a%20dressage%20session." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-dressage"
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
