import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import HeroPicture from "@/components/HeroPicture";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Check, Calendar, Target, Award } from "lucide-react";
import TestimonialStrip from "@/components/TestimonialStrip";
import privateLessonHeroJpg from "@assets/optimized/DBCLINIC-28_1762927604781.jpg";
import privateLessonHeroWebp from "@assets/optimized/DBCLINIC-28_1762927604781.webp";
import privateLessonClinicJpg from "@assets/optimized/private-lessons-clinic.jpg";
import privateLessonClinicWebp from "@assets/optimized/private-lessons-clinic.webp";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { coachingServices, getBreadcrumbsFromPath, createBreadcrumbSchema, createFAQSchema } from "@shared/schemaHelpers";

export default function PrivateLessons() {
  const seoConfig = getSEOConfig('/coaching/private-lessons');
  const breadcrumbs = getBreadcrumbsFromPath('/coaching/private-lessons', seoConfig.h1);

  const testimonials = [
    {
      name: "Sarah M.",
      content: "The one-on-one attention in private lessons has transformed my riding. Dan identified issues I didn't even know I had and gave me clear exercises to fix them.",
      rating: 5
    },
    {
      name: "Emma T.",
      content: "After just three private sessions, my horse and I were communicating so much better. The personalised approach makes all the difference.",
      rating: 5
    },
    {
      name: "Rachel H.",
      content: "Worth every penny. Dan's ability to break down complex movements into simple steps helped me finally master my canter transitions.",
      rating: 5
    }
  ];
  
  const features = [
    "Customized training plans for your specific goals",
    "One-on-one coaching from experienced eventing coach",
    "Flexible scheduling to suit your availability",
    "Show jumping, cross country, and flatwork instruction",
    "Video analysis to track technique and progress",
    "Suitable for beginners through advanced competitors"
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalised Attention",
      description: "Focused coaching tailored to your experience level and objectives"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description: "Book sessions at times that work best for you and your horse"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "All Levels Welcome",
      description: "From amateur riders to international competitors—training for every goal"
    }
  ];

  const faqs = [
    {
      question: "How much do private horse riding lessons cost in Oxfordshire?",
      answer: "My private riding lessons cost £80 per session. This includes personalised one-on-one coaching in dressage, show jumping, cross country, or polework, tailored to your specific goals and experience level. Each session is customised to help you and your horse progress effectively."
    },
    {
      question: "What experience level do I need for private riding lessons?",
      answer: "Private lessons are suitable for all levels, from complete beginners to international competitors. Whether you're an amateur rider building confidence or a competitive eventer preparing for advanced competitions, I tailor the coaching to your current ability and goals. Beginners receive foundational instruction, while experienced riders work on refining technique and competition preparation."
    },
    {
      question: "Where do private riding lessons take place?",
      answer: "Private riding lessons are held in Ascott-Under-Wychwood, Oxfordshire, at Crown Farm. The facility offers excellent training facilities for dressage, show jumping, and polework. For riders outside the local area, virtual lessons are also available using live video technology like Pivo."
    },
    {
      question: "How do I book a private riding lesson?",
      answer: "You can book a private lesson by contacting me via WhatsApp at +44 7767 291713 or by clicking the 'Book a Lesson' button on this page. Lessons are scheduled based on availability and can be arranged at times that suit your schedule. I offer flexible booking to accommodate your training needs."
    },
    {
      question: "What disciplines can I learn in private lessons?",
      answer: "Private lessons cover all three eventing disciplines: dressage (flatwork), show jumping, and cross country. You can also focus specifically on polework and gymnastic grid exercises. I provide expert coaching in whichever discipline you want to improve, whether you're training for a specific competition or building overall riding skills."
    },
    {
      question: "Can I bring my own horse to private lessons?",
      answer: "Yes, private lessons are conducted with your own horse. This allows me to work specifically with your partnership and address the unique strengths and challenges of your horse-and-rider combination. Training your own horse ensures the skills you develop translate directly to your competitions and regular riding."
    },
    {
      question: "How long is a private riding lesson?",
      answer: "Each private riding lesson is typically 45-60 minutes, providing focused coaching time without overworking horse or rider. The exact duration may vary depending on the specific training focus and your horse's fitness level. I ensure each session is productive and appropriate for your training goals."
    },
    {
      question: "Do you offer private lessons for young or nervous horses?",
      answer: "Yes, I have extensive experience working with young horses and nervous or sensitive horses. Private lessons provide the ideal environment for horses that need extra patience, careful introduction to new obstacles, or confidence building. The one-on-one format allows me to work at your horse's pace without group pressure."
    },
    {
      question: "Can I have regular weekly private lessons?",
      answer: "Absolutely! Many riders schedule regular weekly or fortnightly private lessons to maintain consistent progress. Regular lessons help build a strong training foundation and allow me to track your development over time. Contact me to discuss setting up a regular lesson schedule that fits your availability."
    },
    {
      question: "What should I bring to my private riding lesson?",
      answer: "Bring your horse properly tacked up and ready to ride, your riding helmet (properly fitted and safety-certified), appropriate riding boots, and gloves if preferred. For jumping lessons, your horse should have appropriate jump boots or wraps. I'll provide expert guidance and may use video analysis, so no additional equipment is needed from you."
    },
    {
      question: "Are private lessons better than group clinics?",
      answer: "Private lessons and group clinics each offer unique benefits. Private lessons provide 100% individualized attention, flexible scheduling, and coaching tailored specifically to your goals and challenges. They're ideal for riders wanting intensive one-on-one instruction, working on specific issues, or those with horses that need individual attention. Group clinics offer a more affordable option and the opportunity to learn from watching other riders. Many riders benefit from combining both formats."
    },
    {
      question: "Can I get help preparing for a specific competition?",
      answer: "Yes, private lessons are excellent for competition preparation. I can help you prepare for specific events by working on required movements, jumping courses similar to what you'll face, or building confidence for cross country obstacles. Tell me about your upcoming competition, and I'll tailor the lesson to ensure you and your horse are ready to perform your best."
    }
  ];

  const schemas = [
    coachingServices.privateLessons,
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
        preloadImage={privateLessonHeroWebp}
        preloadImageJpeg={privateLessonHeroJpg}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden pt-14 sm:pt-16">
        <HeroPicture
          jpegSrc={privateLessonHeroJpg}
          webpSrc={privateLessonHeroWebp}
          alt="Dan Bizzarro coaching private riding lesson in Oxfordshire"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Private Horse Riding Lessons in Oxfordshire
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Expert coaching in Oxfordshire for all levels
            </p>
            <a
              href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20private%20riding%20lesson"
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
              Expert One-on-One Coaching
            </h2>
            <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                My private horse riding lessons in Oxfordshire offer personalised instruction using the Dan Bizzarro Method. As an international eventing coach, show jumping coach, and cross country coach, I bring over 20 years of experience to every session.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Whether you're an amateur rider building confidence or a competitor preparing for events, each lesson is tailored to your specific goals and experience level. I cover all aspects of equestrian education—from foundational flatwork to advanced competition preparation.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                My equestrian lessons in Oxfordshire welcome riders from complete beginners to international level competitors. I balance technical excellence with an encouraging, supportive environment that makes learning enjoyable while achieving measurable results.
              </p>
              <div className="bg-orange/10 border-l-4 border-orange p-6 rounded-r-lg">
                <p className="text-2xl font-playfair font-bold text-navy mb-2">£80 per session</p>
                <p className="text-dark">Personalised coaching for you and your horse</p>
              </div>
            </div>

            <div className="space-y-6">
              <picture>
                <source srcSet={privateLessonClinicWebp} type="image/webp" />
                <img 
                  src={privateLessonClinicJpg} 
                  alt="Dan Bizzarro teaching private riding lesson"
                  className="w-full rounded-2xl shadow-lg"
                  loading="lazy"
                />
              </picture>
              
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-orange/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-navy mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg text-dark mb-6">
            Book your personalised riding lesson today
          </p>
          <a
            href="https://wa.me/447767291713?text=Hi%2C%20I%27d%20like%20to%20book%20a%20private%20riding%20lesson"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-book-private-cta"
          >
            Book a Lesson
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Why Choose Private Lessons?
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
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

      {/* Session Format Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Session Format
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Duration</h3>
              <p className="text-lg text-dark">
                Sessions typically run for 45-60 minutes, allowing time for warm-up, focused training, and cool-down while keeping your horse fresh and attentive.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Frequency</h3>
              <p className="text-lg text-dark">
                Most riders schedule weekly or bi-weekly lessons for consistent progress. However, we can adjust frequency based on your goals, budget, and schedule.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Location</h3>
              <p className="text-lg text-dark">
                Lessons are available at my base in Oxfordshire or at your own facility within a reasonable travel distance. Travel fees may apply for external locations.
              </p>
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
              Everything you need to know about private riding lessons in Oxfordshire
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
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Book your first private lesson and experience personalized coaching that delivers results
          </p>
          <a 
            href="https://wa.me/447767291713?text=Hi%20Dan%2C%20I'd%20like%20to%20book%20a%20private%20lesson." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-lesson"
            >
              Book Your Lesson
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
