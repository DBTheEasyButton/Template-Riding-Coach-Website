import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ClinicsSection from "@/components/ClinicsSection";
import LoyaltyLeaderboard from "@/components/LoyaltyLeaderboard";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Check, Users, Award, Target, MapPin, Clock } from "lucide-react";
import TestimonialStrip from "@/components/TestimonialStrip";
import clinicsHeroJpg from "@assets/optimized/DBCLINIC-83_1762928005686.jpg";
import clinicsHeroWebp from "@assets/optimized/DBCLINIC-83_1762928005686.webp";
import clinicsHeroMobileJpg from "@assets/optimized/DBCLINIC-83_1762928005686-mobile.jpg";
import clinicsHeroMobileWebp from "@assets/optimized/DBCLINIC-83_1762928005686-mobile.webp";
import { useQuery } from "@tanstack/react-query";
import type { Clinic } from "@shared/schema";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { coachingServices, getBreadcrumbsFromPath, createBreadcrumbSchema, createFAQSchema } from "@shared/schemaHelpers";

export default function GroupClinics() {
  const seoConfig = getSEOConfig('/coaching/clinics');
  const breadcrumbs = getBreadcrumbsFromPath('/coaching/clinics', seoConfig.h1);

  const testimonials = [
    {
      name: "Claire W.",
      content: "The clinic atmosphere is brilliant—small groups mean you still get personal attention, plus you learn so much from watching others tackle the same exercises.",
      rating: 5
    },
    {
      name: "Jenny P.",
      content: "I was nervous about my first clinic but Dan made everyone feel welcome. The improvement I saw in just one day was incredible.",
      rating: 5
    },
    {
      name: "Kate L.",
      content: "Great value for money and such a supportive environment. I've already booked my next three clinics!",
      rating: 5
    }
  ];
  
  const { data: upcomingClinics = [] } = useQuery<any[]>({
    queryKey: ['/api/clinics', { upcoming: 'true', limit: 3 }],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const features = [
    "Single-day training sessions for all levels",
    "Show-jumping, polework, and cross country options",
    "Small group sizes for individual attention",
    "Suitable for amateur riders and competitors",
    "Competition preparation and confidence building",
    "Expert instruction from international eventing coach"
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Learn Together",
      description: "Train alongside riders at your level in a supportive group environment"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Expert Coaching",
      description: "Develop your skills with guidance from an experienced eventing coach"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Achieve Your Goals",
      description: "Whether competing or riding for pleasure, reach your personal objectives"
    }
  ];

  const faqs = [
    {
      question: "How much do clinics cost and how do I register?",
      answer: "Clinic pricing varies depending on the session and format. Most clinics are structured with multiple sessions throughout the day for different skill levels. Registration is done online through this website with secure payment via Stripe. You'll select which session(s) you want to attend based on your level and goals. Once registered, you'll receive confirmation and all details for the clinic day."
    },
    {
      question: "What types of clinics do you offer?",
      answer: "I offer show jumping clinics, polework clinics, and cross country clinics in Oxfordshire. Each clinic focuses on specific skills—show jumping clinics work on technique and course work, polework clinics develop rhythm and balance through gymnastic exercises, and cross country clinics build confidence over natural obstacles. All clinics are designed as single-day training sessions with multiple sessions for different experience levels."
    },
    {
      question: "What skill levels attend your clinics?",
      answer: "My clinics cater to all levels from beginners to advanced competitors. Each clinic day typically has multiple sessions organised by skill level—for example, beginner/novice sessions, intermediate sessions, and advanced sessions. When registering, you select the session that matches your current experience level. This ensures everyone rides with others at a similar ability, creating a supportive and effective learning environment."
    },
    {
      question: "How many riders are in each clinic session?",
      answer: "I keep group sizes small to ensure individual attention. Most sessions have a maximum of 3-4 riders, depending on the specific clinic and discipline. This allows me to work with each rider personally while still providing the benefits of group learning—watching others, shared feedback, and a supportive atmosphere. The smaller group size distinguishes my clinics from larger group lessons."
    },
    {
      question: "Where are clinics held?",
      answer: "Clinics are held at various locations around Oxfordshire and surrounding areas. The specific venue is listed for each clinic on the registration page. Most clinics take place at facilities with excellent arenas and jump courses suitable for the discipline being taught. Location details, including Google Maps links, are provided when you view clinic information."
    },
    {
      question: "How long does a clinic session last?",
      answer: "Each session typically lasts 60-90 minutes, providing ample time for warm-up, focused instruction, and skill development without overworking horses. A full clinic day usually includes 3-5 sessions at different times, allowing you to choose which session(s) fit your schedule and level. Some riders attend multiple sessions if they want more intensive training."
    },
    {
      question: "What should I bring to a clinic?",
      answer: "Bring your horse properly groomed and with appropriate tack for the discipline (jumping tack for show jumping/polework, cross country equipment for XC clinics). Your horse should have proper protective boots or wraps. You'll need a properly fitted riding helmet (safety-certified), riding boots, gloves if preferred, and water for both you and your horse. I'll provide expert coaching and may use video analysis during the session."
    },
    {
      question: "Can I register for multiple sessions in one clinic?",
      answer: "Yes! Many riders register for multiple sessions throughout the clinic day if they want more intensive training or if they have multiple horses. When registering, you can select as many sessions as you'd like to attend. Each session is separately bookable, giving you flexibility to create your ideal training day. Attending multiple sessions provides great value for dedicated riders."
    },
    {
      question: "What if my horse is young or inexperienced?",
      answer: "Young and inexperienced horses are welcome at appropriate skill-level sessions. When registering, choose the beginner or novice session that matches your horse's experience. I'm experienced in working with young horses and will ensure exercises are suitable for their development level. The group format actually helps young horses by exposing them to other horses in a controlled training environment."
    },
    {
      question: "Do I earn loyalty rewards for attending clinics?",
      answer: "Yes! I offer a loyalty rewards program for clinic participants. You earn points for every clinic you attend, and after every 5 clinic registrations, you receive a 15% discount code for future clinics. It's my way of rewarding dedicated riders who regularly train with me. You can check your loyalty status and points on the website."
    },
    {
      question: "What is your cancellation policy for clinics?",
      answer: "Cancellation policies vary by clinic and are detailed in the Terms & Conditions when you register. Generally, cancellations made well in advance may receive refunds or credit towards future clinics, while late cancellations may forfeit payment. This policy ensures fairness to all participants and allows me to plan appropriately. Specific details are always provided before you complete your registration."
    },
    {
      question: "Can spectators attend clinics?",
      answer: "Spectator policies vary by venue. Some locations welcome spectators to watch and learn, while others have restrictions due to space or facility rules. When you register for a clinic, spectator information will be provided. Many riders find it beneficial to bring friends or family who can video their session or help with their horse."
    }
  ];

  const schemas = [
    coachingServices.clinics,
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
        preloadImage={clinicsHeroWebp}
        preloadImageJpeg={clinicsHeroJpg}
        schemas={schemas}
      />
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <HeroPicture
          jpegSrc={clinicsHeroJpg}
          webpSrc={clinicsHeroWebp}
          mobileJpegSrc={clinicsHeroMobileJpg}
          mobileWebpSrc={clinicsHeroMobileWebp}
          alt="Dan Bizzarro coaching group clinic with riders and horses"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Eventing Clinics & Group Riding Lessons
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Show jumping, polework & cross country training for all levels
            </p>
          </div>
        </div>
      </section>

      <TestimonialStrip customTestimonials={testimonials} />

      {/* Next 3 Upcoming Clinics */}
      {upcomingClinics.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair font-bold text-navy mb-2">
                Upcoming Clinics
              </h2>
              <p className="text-gray-600">Join me at my next training sessions</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingClinics.map((clinic) => (
                <div 
                  key={clinic.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="p-4 text-white" style={{ background: 'linear-gradient(to right, #ee7d3f, #ee7d3fcc)' }}>
                    <h3 className="text-xl font-playfair font-bold mb-1 line-clamp-2">{clinic.title}</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(clinic.date)}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-orange" />
                      <span>{clinic.location}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3 flex-grow">{clinic.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                      <div className="text-2xl font-bold text-orange">
                        {clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                          ? `from £${(Math.min(...clinic.sessions.map((s: any) => s.price)) / 100).toFixed(0)}`
                          : clinic.price > 0 
                            ? `£${(clinic.price / 100).toFixed(0)}`
                            : 'Price TBA'
                        }
                      </div>
                      <Button 
                        size="sm"
                        className="bg-navy hover:bg-slate-800 text-white"
                        onClick={() => {
                          // Scroll to clinics section
                          const element = document.getElementById('clinics');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                          
                          // Trigger registration for this clinic after scroll
                          setTimeout(() => {
                            const registerButton = document.querySelector(`[data-clinic-id="${clinic.id}"] button:not([disabled])`) as HTMLButtonElement;
                            if (registerButton && registerButton.textContent?.includes('Register')) {
                              registerButton.click();
                            }
                          }, 600);
                        }}
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Expert Training in Oxfordshire
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">My group clinics offer specialised training in show jumping, polework, and cross country. These single-day sessions welcome riders from beginner to advanced levels, whether you ride for pleasure or competition.</p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Each clinic focuses on the Dan Bizzarro Method, combining technical instruction with practical application. With small group sizes, you receive personalised feedback while benefiting from watching fellow riders tackle similar challenges.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                My clinics cater to both amateur riders building confidence and competitors preparing for events. From foundational polework clinics to advanced show-jumping and cross country sessions, there's a clinic designed for your goals.
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
      {/* CTA Section */}
      <section className="py-12 bg-orange/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
            Ready to Elevate Your Training?
          </h3>
          <p className="text-lg text-dark mb-6">Join riders from across Oxfordshire at my clinics</p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20register%20for%20an%20upcoming%20clinic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-book-clinic-cta"
          >
            Register for a Clinic
          </a>
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
      {/* Loyalty Leaderboard Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-4">
              Earn Rewards with Every Clinic!
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
            <p className="text-lg text-dark max-w-3xl mx-auto">
              Join my loyalty programme! Earn 10 points per clinic entry and bonus points for referring friends. 
              Every 50 points unlocks a 20% discount code. The top 5 riders win prizes—first reset 30 June 2025, then bi-annually!
            </p>
          </div>
          <LoyaltyLeaderboard />
        </div>
      </section>
      {/* Divider */}
      <div className="border-t-4 border-navy"></div>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-lg text-dark">
              Everything you need to know about my show jumping, polework, and cross country clinics
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
            Join My Next Clinic
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Book your Competition Preparation Clinic or join a training session for all levels
          </p>
          <Link href="/#clinics">
            <Button 
              className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 mr-4"
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
