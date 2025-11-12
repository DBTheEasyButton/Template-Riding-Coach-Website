import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Users, Check, Calendar, Target, Award } from "lucide-react";
import privateLessonHeroImage from "@assets/optimized/DBCLINIC-28_1762927604781.jpg";

export default function PrivateLessons() {
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
      title: "Personalized Attention",
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

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Private Horse Riding Lessons in Oxfordshire | Dan Bizzarro Method"
        description="Expert private horse riding lessons in Oxfordshire with international eventing coach Dan Bizzarro. Personalized training from beginner to advanced levels in show jumping, cross country, and dressage."
        keywords="private horse riding lessons, equestrian lessons Oxfordshire, show jumping coach, eventing coach, cross country coach, Dan Bizzarro Method, one-on-one coaching, personalized training"
        canonical="https://danbizzarromethod.com/coaching/private-lessons"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <img
          src={privateLessonHeroImage}
          alt="Dan Bizzarro coaching private riding lesson in Oxfordshire"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Private Horse Riding Lessons
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Expert coaching in Oxfordshire for all levels
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6 text-center">
                Expert One-on-One Coaching
              </h2>
              <div className="w-24 h-1 bg-orange mb-8 mx-auto"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Our private horse riding lessons in Oxfordshire offer personalized instruction using the Dan Bizzarro Method. As an international eventing coach, show jumping coach, and cross country coach, Dan brings over 20 years of experience to every session.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Whether you're an amateur rider building confidence or a competitor preparing for events, each lesson is tailored to your specific goals and experience level. Training covers all aspects of equestrian education—from foundational flatwork to advanced competition preparation.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                These equestrian lessons in Oxfordshire welcome riders from complete beginners to international level competitors. Dan's approach balances technical excellence with an encouraging, supportive environment that makes learning enjoyable while achieving measurable results.
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
                Lessons are available at Dan's base in Oxfordshire or at your own facility within a reasonable travel distance. Travel fees may apply for external locations.
              </p>
            </div>
          </div>
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
          <Link href="/contact">
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-book-lesson"
            >
              Book Your Lesson
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
