import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Video, Check, Globe, MessageSquare, Upload } from "lucide-react";
import TestimonialStrip from "@/components/TestimonialStrip";
import virtualLessonHeroJpg from "@assets/optimized/Generated Image November 12, 2025 - 6_02AM_1762927379155.png";
import virtualLessonHeroWebp from "@assets/optimized/Generated Image November 12, 2025 - 6_02AM_1762927379155.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { coachingServices, getBreadcrumbsFromPath, createBreadcrumbSchema, createFAQSchema } from "@shared/schemaHelpers";

export default function RemoteCoaching() {
  const seoConfig = getSEOConfig('/coaching/remote-coaching');
  const breadcrumbs = getBreadcrumbsFromPath('/coaching/remote-coaching', seoConfig.h1);
  
  const pivoLink = (
    <a 
      href="https://pivoequestrian.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-orange hover:text-orange/80 font-semibold underline"
    >
      Pivo
    </a>
  );

  const features = [
    "Live coaching via video systems like Pivo",
    "Real-time feedback as you ride",
    "Available worldwide - train from anywhere",
    "Wear earbuds to hear coaching while you ride",
    "Dan watches you live on his laptop",
    "Personalized instruction tailored to your level"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Setup Your System",
      description: "Use a video system like Pivo that tracks you as you ride and streams live video",
      isPivoMention: true
    },
    {
      step: "2",
      title: "Connect Online",
      description: "Join a video call with Dan where he can see you and your horse in real-time"
    },
    {
      step: "3",
      title: "Wear Earbuds",
      description: "Put in wireless earbuds so you can hear Dan's coaching as you ride"
    },
    {
      step: "4",
      title: "Ride & Learn",
      description: "Dan coaches you live, watching on his laptop and giving immediate feedback"
    }
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Train Anywhere",
      description: "Access live expert coaching regardless of your location"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Real-Time Coaching",
      description: "Get immediate feedback as you ride, just like an in-person lesson"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Communication",
      description: "Two-way conversation during your session for instant guidance"
    }
  ];

  const faqs = [
    {
      question: "How much do virtual riding lessons cost?",
      answer: "Virtual riding lessons with Dan Bizzarro cost £80 per session. This is the same price as in-person lessons, providing you with live, real-time coaching from anywhere in the world. You receive the same quality instruction as a face-to-face lesson, with Dan watching you live and coaching you as you ride."
    },
    {
      question: "How do virtual riding lessons work?",
      answer: "Virtual lessons are LIVE coaching sessions using video technology like Pivo. Dan watches you ride in real-time on his laptop while you wear wireless earbuds to hear his coaching. The video system tracks and follows you as you move around the arena. It's exactly like an in-person lesson—Dan sees you riding and provides immediate feedback and corrections as you go. This is NOT video submission with delayed feedback; it's real-time, interactive coaching."
    },
    {
      question: "What equipment do I need for virtual lessons?",
      answer: "You'll need a video system like Pivo that can track and follow you as you ride, streaming live video to Dan. You'll also need wireless earbuds (like AirPods) so you can hear Dan's coaching while riding, and a stable internet connection at your riding facility. Many riders already have these items, making virtual lessons accessible and convenient."
    },
    {
      question: "What is Pivo and why is it recommended?",
      answer: "Pivo is an automated video tracking system designed specifically for equestrian training. It uses a smart pod that follows you as you move around the arena, ensuring Dan always has a clear view of you and your horse. Pivo is popular among riders for virtual lessons because it eliminates the need for someone to hold a camera. Learn more at pivoequestrian.com."
    },
    {
      question: "Can virtual lessons replace in-person coaching?",
      answer: "Virtual lessons provide excellent coaching and are highly effective for riders who can't access in-person lessons due to location or scheduling. Many riders successfully train exclusively through virtual lessons. However, some riders prefer a combination of both formats—virtual lessons for regular training and occasional in-person sessions for hands-on adjustments. The best approach depends on your individual goals and circumstances."
    },
    {
      question: "What disciplines can I learn through virtual lessons?",
      answer: "Virtual lessons cover all eventing disciplines: dressage (flatwork), show jumping, polework, and cross country. Dan can coach you in whichever area you want to improve. Whether you're working on dressage movements, jumping technique, gymnastic gridwork, or cross country confidence, virtual lessons provide effective real-time instruction."
    },
    {
      question: "Do virtual lessons work for beginners?",
      answer: "Yes! Virtual lessons work well for all levels, from beginners to advanced competitors. Dan tailors the coaching to your current ability just as he would in person. For beginners, he provides clear explanations and step-by-step guidance. For advanced riders, he focuses on refining technique and competition preparation. The live format allows Dan to answer questions immediately and adjust exercises in real-time."
    },
    {
      question: "How do I book a virtual riding lesson?",
      answer: "You can book a virtual lesson by contacting Dan via WhatsApp at +44 7767 291713 or by clicking the 'Book a Virtual Lesson' button on this page. When booking, let Dan know you want a virtual session, and he'll help you schedule a time and ensure you have the necessary equipment setup. Sessions are arranged at times that work for your schedule and time zone."
    },
    {
      question: "Can I have virtual lessons if I'm outside the UK?",
      answer: "Absolutely! Virtual lessons are available worldwide. Dan works with riders across different time zones and countries. As long as you have the necessary equipment and internet connection, you can access expert coaching regardless of your location. Many international riders benefit from Dan's expertise without the need for travel."
    },
    {
      question: "How long is a virtual riding lesson?",
      answer: "Virtual riding lessons are typically 45-60 minutes, the same length as in-person sessions. This provides adequate time for warm-up, focused training, and cool-down without overworking your horse. The live format allows Dan to use the time efficiently, providing continuous feedback throughout your ride."
    },
    {
      question: "What if my internet connection isn't perfect?",
      answer: "While a stable internet connection is ideal, many riders successfully conduct virtual lessons with moderate internet speeds. The video streaming doesn't require extremely high bandwidth. If you can video call on your phone, you likely have sufficient connection. Dan is experienced in working with various connection qualities and can adapt coaching if there are occasional brief interruptions."
    },
    {
      question: "Can I record my virtual lesson for review later?",
      answer: "Yes! Many riders record their virtual lessons so they can review Dan's feedback and watch their progress. If you're using a system like Pivo, it often has built-in recording features. Reviewing your lesson recording is a great way to reinforce learning and track improvement over time. Just let Dan know if you plan to record the session."
    }
  ];

  const schemas = [
    coachingServices.remoteCoaching,
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
        preloadImage={virtualLessonHeroWebp}
        preloadImageJpeg={virtualLessonHeroJpg}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <HeroPicture
          jpegSrc={virtualLessonHeroJpg}
          webpSrc={virtualLessonHeroWebp}
          alt="Virtual riding lesson session with online coaching"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Virtual Riding Lessons
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Live coaching from anywhere using video technology like{" "}
              <a 
                href="https://pivoequestrian.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange hover:text-orange/80 font-bold underline"
              >
                Pivo
              </a>
            </p>
            <a
              href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20virtual%20riding%20lesson"
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

      <TestimonialStrip />

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              What Are Virtual Riding Lessons?
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Virtual riding lessons use live video technology like{" "}
                <a 
                  href="https://pivoequestrian.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:text-orange/80 font-semibold underline"
                >
                  Pivo
                </a>
                {" "}to bring the Dan Bizzarro Method directly to riders worldwide. Dan watches you and your horse in real-time on his laptop while you wear earbuds to hear his coaching as you ride—just like an in-person lesson, but from anywhere in the world.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                This remote equestrian coaching format uses systems like{" "}
                <a 
                  href="https://pivoequestrian.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:text-orange/80 font-semibold underline"
                >
                  Pivo
                </a>
                {" "}that automatically track and follow you as you ride, streaming live video to Dan. You hear his voice through wireless earbuds, receiving immediate corrections, encouragement, and technical guidance exactly when you need it. It's truly live coaching—not video submission and feedback.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Whether you're an amateur rider building confidence or a competitor preparing for events, Dan provides real-time instruction across all disciplines—dressage, show jumping, cross country, and polework—from beginner to international level, all from your own training facility.
              </p>
              <div className="bg-orange/10 border-l-4 border-orange p-6 rounded-r-lg">
                <p className="text-2xl font-playfair font-bold text-navy mb-2">£80 per session</p>
                <p className="text-dark">Live virtual coaching with real-time feedback</p>
              </div>
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

      {/* CTA Section */}
      <section className="py-12 bg-orange/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
            Train from Anywhere in the World
          </h3>
          <p className="text-lg text-dark mb-6">
            Book your live virtual lesson and start improving today
          </p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20virtual%20riding%20lesson"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-book-virtual-cta"
          >
            Book a Virtual Lesson
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              How Live Virtual Lessons Work
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div 
                key={index} 
                className="text-center"
                data-testid={`step-${item.step}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-orange text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-dark leading-relaxed">
                  {item.step === "1" ? (
                    <>
                      Use a video system like{" "}
                      <a 
                        href="https://pivoequestrian.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange hover:text-orange/80 font-semibold underline"
                      >
                        Pivo
                      </a>
                      {" "}that tracks you as you ride and streams live video
                    </>
                  ) : (
                    item.description
                  )}
                </p>
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
              Benefits of Live Virtual Coaching
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

      {/* Equipment Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Equipment You'll Need
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Video System</h4>
              <p className="text-dark">
                A device like{" "}
                <a 
                  href="https://pivoequestrian.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:text-orange/80 font-semibold underline"
                >
                  Pivo
                </a>
                {" "}that tracks and follows you, streaming live video (smartphone or tablet compatible)
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Wireless Earbuds</h4>
              <p className="text-dark">Any Bluetooth earbuds that stay secure while riding so you can hear Dan's coaching</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Stable Internet</h4>
              <p className="text-dark">Reliable WiFi or mobile data connection at your training facility for live video streaming</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Video Call App</h4>
              <p className="text-dark">Zoom, FaceTime, WhatsApp video, or similar platform for the live coaching session</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-dark text-lg">
              <a 
                href="https://pivoequestrian.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange hover:text-orange/80 font-semibold underline"
              >
                Learn more about Pivo equestrian systems
              </a>
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
              Everything you need to know about live virtual riding lessons
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
            Start Live Virtual Lessons Today
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Experience real-time coaching from anywhere in the world—£80 per session
          </p>
          <a 
            href="https://wa.me/447767291713?text=Hi%20Dan%2C%20I'd%20like%20to%20get%20started%20with%20virtual%20riding%20lessons." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-start-remote-coaching"
            >
              Get Started
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
