import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Award, Users, Target, Video, Calendar } from "lucide-react";
import coachingImage1 from "@assets/optimized/1_1749388256611.jpg";
import coachingImage1MobileJpg from "@assets/optimized/1_1749388256611-mobile.jpg";
import coachingImage1MobileWebp from "@assets/optimized/1_1749388256611-mobile.webp";
import coachingImage2 from "@assets/optimized/2_1749388256612.jpg";
import coachingImage2MobileJpg from "@assets/optimized/2_1749388256612-mobile.jpg";
import coachingImage2MobileWebp from "@assets/optimized/2_1749388256612-mobile.webp";

export default function Services() {

  const coachingServices = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Private Lessons",
      description: "One-on-one personalised instruction tailored to your specific riding goals and experience level.",
      features: [
        "Customised training plans",
        "Individual attention",
        "Flexible scheduling",
        "Progress tracking"
      ],
      url: "/coaching/private-lessons"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Clinics",
      description: "Group training sessions combining technical instruction with competitive preparation strategies.",
      features: [
        "Multi-day intensive training",
        "All three eventing disciplines",
        "Small group sizes",
        "Competition preparation"
      ],
      url: "/coaching/clinics"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Remote Coaching",
      description: "Virtual coaching sessions allowing you to receive expert guidance from anywhere in the world.",
      features: [
        "Video analysis",
        "Online consultations",
        "Worldwide availability",
        "Flexible feedback"
      ],
      url: "/coaching/remote-coaching"
    },
  ];

  const disciplines = [
    {
      title: "Flat Work & Dressage",
      description: "Develop foundation skills, improve balance, and achieve harmony with your horse through classical dressage training.",
      icon: <Target className="w-12 h-12" />,
      url: "/coaching/dressage"
    },
    {
      title: "Show Jumping",
      description: "Build confidence over fences, refine technique, and master course strategy for competitive success.",
      icon: <Award className="w-12 h-12" />,
      url: "/coaching/show-jumping"
    },
    {
      title: "Cross Country",
      description: "Tackle natural obstacles with boldness and precision, developing partnership and trust at speed.",
      icon: <Target className="w-12 h-12" />,
      url: "/coaching/cross-country"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Eventing Coaching Services - Private Lessons & Clinics | Dan Bizzarro Method"
        description="Professional eventing coaching in Oxfordshire. Private lessons, group clinics, and remote coaching across dressage, show jumping, and cross country. From beginners to international competitors."
        keywords="eventing coaching, private riding lessons, equestrian clinics, dressage coaching, show jumping lessons, cross country training, Oxfordshire horse training, remote coaching"
        canonical="https://danbizzarromethod.com/coaching"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[350px] sm:min-h-[350px] bg-gradient-to-r from-orange-600 to-orange-500 mt-14 sm:mt-16 flex">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Coaching Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Expert eventing instruction across all disciplines
            </p>
          </div>
        </div>
      </section>

      {/* Main Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">Why Train with Dan?</h2>
                <div className="w-24 h-1 bg-orange mb-8"></div>
              </div>
              <p className="text-lg text-dark leading-relaxed">
                With over 20 years of international competition experience and a passion for helping riders communicate better with their horses, I bring unparalleled expertise to every training session. My proven methodology has helped riders at all levels achieve their competitive goals.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                I offer comprehensive instruction across all three eventing disciplines: <strong>flat work</strong> for foundation and dressage development, <strong>jumping</strong> for technique and confidence, and <strong>cross-country</strong> for boldness and precision over natural obstacles.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                Whether you're just starting your equestrian journey or aiming for international competition, my personalised approach ensures every rider reaches their full potential.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-navy/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange">20+</div>
                  <div className="text-sm text-dark">Years Experience</div>
                </div>
                <div className="bg-navy/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange">500+</div>
                  <div className="text-sm text-dark">Riders Coached</div>
                </div>
                <div className="bg-navy/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange">2024</div>
                  <div className="text-sm text-dark">Olympic Short Listed</div>
                </div>
                <div className="bg-navy/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange">2nd</div>
                  <div className="text-sm text-dark">Nations Cup Boekelo</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <picture>
                  <source srcSet={coachingImage1MobileWebp} type="image/webp" media="(max-width: 768px)" />
                  <source srcSet={coachingImage1MobileJpg} type="image/jpeg" media="(max-width: 768px)" />
                  <img 
                    src={coachingImage1} 
                    alt="Dan Bizzarro coaching flat work - personalised instruction in the arena" 
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute -bottom-6 -left-6 bg-orange text-white p-6 rounded-xl shadow-xl max-w-[200px]">
                  <div className="flex items-center space-x-3">
                    <Award className="text-2xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Flat work & jumping</div>
                      <div className="text-xs opacity-80">Technique & Foundation</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <picture>
                  <source srcSet={coachingImage2MobileWebp} type="image/webp" media="(max-width: 768px)" />
                  <source srcSet={coachingImage2MobileJpg} type="image/jpeg" media="(max-width: 768px)" />
                  <img 
                    src={coachingImage2} 
                    alt="Dan Bizzarro coaching cross-country - group instruction at training obstacles" 
                    className="rounded-2xl shadow-xl w-full h-auto object-cover"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-xl shadow-xl max-w-[200px]">
                  <div className="flex items-center space-x-3">
                    <Target className="text-2xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Cross country</div>
                      <div className="text-xs opacity-80">Be confident & have fun</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Training Options
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-xl text-dark max-w-3xl mx-auto">
              Choose the coaching format that best suits your needs and goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coachingServices.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
                data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-orange mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-3 text-navy text-center">{service.title}</h3>
                <p className="text-dark text-center mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3 mb-6 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-dark">
                      <span className="text-orange mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={service.url}>
                  <Button 
                    className="w-full bg-orange hover:bg-orange-hover text-white rounded-full transition-all duration-300"
                    data-testid={`button-learn-more-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Eventing Disciplines
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
            <p className="text-xl text-dark max-w-3xl mx-auto">
              Comprehensive coaching across all three phases of eventing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {disciplines.map((discipline, index) => (
              <div 
                key={index} 
                className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-orange/10 transition-all duration-300 flex flex-col"
              >
                <div className="text-orange mb-4 flex justify-center">
                  {discipline.icon}
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-4 text-navy">{discipline.title}</h3>
                <p className="text-dark leading-relaxed mb-6 flex-grow">{discipline.description}</p>
                <Link href={discipline.url}>
                  <Button 
                    className="w-full bg-navy hover:bg-slate-800 text-white rounded-full transition-all duration-300"
                    data-testid={`button-learn-more-${discipline.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Book a coaching session or join an upcoming clinic
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#clinics">
              <Button 
                className="bg-orange hover:bg-orange-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
                data-testid="button-book-clinic"
              >
                View Upcoming Clinics
              </Button>
            </Link>
            <Button 
              onClick={() => window.open('https://wa.me/447767291713', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-private"
            >
              Book a Private Lesson
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
