import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Users, Check, Calendar, Target, Award } from "lucide-react";

export default function PrivateLessons() {
  const features = [
    "Customized training plans tailored to your goals",
    "Individual attention and immediate feedback",
    "Flexible scheduling to fit your calendar",
    "Progress tracking and performance analysis",
    "Video analysis of your sessions",
    "Personalized homework and practice routines"
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Focused Improvement",
      description: "One-on-one attention means every minute is dedicated to your development"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description: "Book sessions at times that work best for you and your horse"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Personalized Goals",
      description: "Training plans designed specifically for your competitive aspirations"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Private Riding Lessons - One-on-One Eventing Coaching | Dan Bizzarro"
        description="Personalized private riding lessons in Oxfordshire with international event rider Dan Bizzarro. Customized training plans, flexible scheduling, and expert instruction across all eventing disciplines."
        keywords="private riding lessons, one-on-one coaching, personalized training, eventing lessons, dressage lessons, show jumping coaching, cross country training, Oxfordshire"
        canonical="https://dan-bizzarro.replit.app/services/private-lessons"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Private Lessons
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Personalized one-on-one instruction for rapid progress
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
                Tailored to You
              </h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Private lessons with Dan offer the ultimate in personalized instruction. Every session is designed around your specific riding goals, experience level, and your horse's unique needs.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Whether you're preparing for your first competition, working through a specific challenge, or aiming for international success, Dan's expert guidance ensures you make the most of every training session.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                With over 20 years of international competition experience, Dan brings a wealth of knowledge to each lesson, helping you develop the skills and confidence needed to excel in all three eventing disciplines.
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
