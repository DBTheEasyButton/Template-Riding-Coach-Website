import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, Check, Zap, TrendingUp, Calendar } from "lucide-react";
import poleworkHeroJpg from "@assets/optimized/polework-hero.jpg";
import poleworkHeroWebp from "@assets/optimized/polework-hero.webp";

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

  const faqs = [
    {
      question: "What is polework and how does it help horse training?",
      answer: "Polework involves riding over ground poles, raised poles, and pole combinations to develop rhythm, balance, strength, suppleness, and jumping technique. Poles provide visual and physical challenges that encourage horses to engage their muscles, improve coordination, and develop better movement patterns. For riders, polework improves timing, position, and feel. It's incredibly versatile—beneficial for dressage horses, jumpers, eventers, and horses at all levels from green youngsters to experienced competitors."
    },
    {
      question: "Is polework suitable for horses that don't jump?",
      answer: "Absolutely! Polework benefits all horses, regardless of whether they jump. Dressage horses use polework to develop engagement, improve rhythm, and build strength. Flatwork horses benefit from the variety and physical demands poles provide. Even pleasure horses become more balanced and athletic through pole exercises. Dan designs polework sessions appropriate for any discipline and any horse's job—jumping experience not required."
    },
    {
      question: "How is polework different from regular jumping?",
      answer: "Polework uses ground poles and raised poles rather than full jumps, making it lower impact, less physically demanding, and lower risk. Horses can do more repetitions without fatigue or stress. Polework focuses on developing quality movement, rhythm, and technique rather than height or scope. It's excellent for building foundations, strengthening muscles, maintaining fitness, and providing variety. Many horses that can't jump full courses due to age, soundness, or experience level can still benefit enormously from polework."
    },
    {
      question: "What are gymnastic grid exercises?",
      answer: "Gymnastic grids are sequences of ground poles or low fences set at specific distances that guide the horse through without requiring rider adjustment. Grids teach horses to think, react, adjust their stride, and develop better jumping technique. For riders, grids improve position, timing, and feel without the pressure of decision-making. Dan uses progressive grid work as a foundation for all jumping training, developing skills that translate directly to course work and cross country."
    },
    {
      question: "Can polework help with rhythm problems?",
      answer: "Yes! Polework is one of the most effective tools for developing rhythm. The poles create consistent visual references that help horses find and maintain tempo. Regular spacing between poles encourages steady rhythm. Riders develop better feel for consistent pace. Dan designs pole exercises specifically targeting rhythm issues—whether horses rush, slow down, or lack consistency. Progressive polework builds the muscle memory and mental understanding for reliable rhythm in all gaits."
    },
    {
      question: "Is polework suitable for young or green horses?",
      answer: "Polework is ideal for young and green horses! It provides controlled, systematic introduction to obstacles, develops coordination and balance, builds confidence through achievable challenges, strengthens muscles safely, and teaches horses to think and problem-solve. Dan uses polework to develop young horses' foundations without the physical demands of full jumping. Starting horses correctly with polework creates confident, capable athletes ready for more advanced work."
    },
    {
      question: "How often should I do polework training?",
      answer: "Polework can be incorporated more frequently than full jumping sessions because it's lower impact. Many horses benefit from polework 2-3 times per week as part of varied training. The exact frequency depends on your horse's fitness, your training goals, and what other work you're doing. Dan helps riders design balanced training programs that include polework alongside flatwork and jumping, ensuring horses stay fresh, sound, and progressing."
    },
    {
      question: "Can I learn polework through virtual lessons?",
      answer: "Yes! Polework is excellent for virtual lessons using live video systems like Pivo. Dan can clearly see the quality of movement, rhythm, and technique through video, and coach you in real-time through earbuds. Setting up basic pole patterns is straightforward, making polework accessible for home training with virtual coaching. This makes expert polework instruction available to riders worldwide, regardless of location."
    },
    {
      question: "Do I need special equipment for polework?",
      answer: "The basic equipment needed is simple—ground poles (usually 8-12 feet long), pole supports or blocks if you want to raise them, and a safe arena or working area. Most riders already have access to poles at their yard. Dan can design effective exercises with minimal equipment. As you progress, additional poles allow more complex patterns, but you can achieve excellent results with just 4-6 poles to start."
    },
    {
      question: "How does polework improve jumping technique?",
      answer: "Polework develops the fundamental qualities good jumpers need: rhythm for consistent approach, balance for clean takeoff, suppleness for better bascule, strength for powerful jump, adjustability for various distances, and confidence for bold jumping. Gymnastic grid exercises specifically teach horses to round over poles, engage their hindquarters, and use their bodies athletically—all directly translating to better jumping form. Polework provides maximum technique benefit with minimal physical stress."
    },
    {
      question: "Can polework help with confidence issues?",
      answer: "Definitely! Polework provides achievable challenges that build confidence incrementally. Horses learn they can handle obstacles safely, develop problem-solving skills, gain physical strength that creates confidence, and experience success regularly. For nervous horses or riders, polework offers a controlled, low-stress way to develop boldness. Dan uses progressive polework to rebuild confidence in horses that have lost trust, creating positive experiences that carry forward to more challenging work."
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
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <HeroPicture
          jpegSrc={poleworkHeroJpg}
          webpSrc={poleworkHeroWebp}
          alt="Colorful polework training with horse and rider in Oxfordshire arena"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
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
                Polework coaching is available in multiple formats: specialised polework clinics for group learning, private lessons for personalised grid work instruction, and live virtual coaching sessions where Dan watches you in real-time via video systems like{" "}
                <a 
                  href="https://pivoequestrian.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:text-orange/80 font-semibold underline"
                >
                  Pivo
                </a>
                {" "}while you wear earbuds to hear his coaching. This flexibility ensures every rider—from complete beginners to international competitors—can access expert pole work training.
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

      {/* CTA Section */}
      <section className="py-12 bg-orange/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
            Transform Your Training with Polework
          </h3>
          <p className="text-lg text-dark mb-6">
            Build rhythm, balance, and technique through expert grid work
          </p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20polework%20coaching%20session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-book-polework-cta"
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
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4 text-center">Live Virtual Polework</h3>
              <p className="text-dark mb-4 text-center leading-relaxed">
                Dan coaches you live via video (like{" "}
                <a 
                  href="https://pivoequestrian.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:text-orange/80 font-semibold underline"
                >
                  Pivo
                </a>
                ) while you ride. Hear him through earbuds in real-time
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark">
              Everything you need to know about polework and gymnastic grid training
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
