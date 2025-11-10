import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Video, Check, Globe, MessageSquare, Upload } from "lucide-react";

export default function RemoteCoaching() {
  const features = [
    "Professional video analysis of your riding technique",
    "Live online consultations via video call",
    "Available worldwide - train from anywhere",
    "Personalized feedback tailored to your level",
    "Actionable training recommendations",
    "Ongoing support for continuous improvement"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Record Your Session",
      description: "Film your training session from multiple angles for comprehensive analysis"
    },
    {
      step: "2",
      title: "Upload & Submit",
      description: "Send your video along with specific questions or areas of focus"
    },
    {
      step: "3",
      title: "Expert Analysis",
      description: "Dan reviews your footage and provides detailed feedback and recommendations"
    },
    {
      step: "4",
      title: "Video Consultation",
      description: "Schedule a live video call to discuss findings and next steps"
    }
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Train Anywhere",
      description: "Access expert coaching regardless of your location"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Detailed Analysis",
      description: "Comprehensive video review with clear, actionable feedback"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Continuous Support",
      description: "Ongoing guidance and communication between sessions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Virtual Riding Lessons - Train Anywhere, Anytime | Dan Bizzarro Method"
        description="Learn from home with our virtual riding lessons. Remote equestrian coaching provides personalized feedback and clear guidance from international eventing coach Dan Bizzarro."
        keywords="virtual riding lessons, remote equestrian coaching, online horse training, video analysis, Dan Bizzarro Method, eventing coach, show jumping coach, cross country coach"
        canonical="https://dan-bizzarro.replit.app/coaching/remote-coaching"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-slate-700 to-slate-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Video className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Virtual Riding Lessons
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Train anywhere, anytime with remote equestrian coaching
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
                What Are Virtual Riding Lessons?
              </h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
              <p className="text-lg text-dark leading-relaxed mb-6">
                Virtual riding lessons combine modern technology with expert coaching to bring the Dan Bizzarro Method to riders worldwide. Using video analysis and online consultations, you receive personalized feedback from an international eventing coach without geographical limitations.
              </p>
              <p className="text-lg text-dark leading-relaxed mb-6">
                This remote equestrian coaching format works perfectly whether you're an amateur rider building confidence or a competitor preparing for events. Simply record your riding session, submit the video, and receive detailed analysis followed by a live video consultation to discuss your progress.
              </p>
              <p className="text-lg text-dark leading-relaxed">
                As an experienced eventing coach, show jumping coach, and cross country coach, Dan provides comprehensive guidance across all disciplines—from beginner to international level—all from the comfort of your own training facility.
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

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              How to Get Started
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
                <p className="text-dark leading-relaxed">{item.description}</p>
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
              Benefits of Remote Equestrian Coaching
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

      {/* Video Tips Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Video Recording Tips
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Camera Position</h4>
              <p className="text-dark">Record from the long side of the arena at rider height for optimal viewing angle</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Lighting</h4>
              <p className="text-dark">Film during daylight hours or in well-lit indoor arenas for clear visibility</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">Video Length</h4>
              <p className="text-dark">Capture 10-15 minutes of focused work showing the areas you want feedback on</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy mb-3">File Format</h4>
              <p className="text-dark">MP4 or MOV formats work best for easy sharing and review</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Start Your Virtual Riding Lessons Today
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Experience the Dan Bizzarro Method from anywhere in the world
          </p>
          <Link href="/contact">
            <Button 
              className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              data-testid="button-start-remote-coaching"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
