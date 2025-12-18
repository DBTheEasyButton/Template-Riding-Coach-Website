import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Mail, ChevronDown, ChevronUp, Headphones, Play, FileText, Clock, Target, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import introAudio from "@assets/Introductory_STRON_HORSE_Audio_Lesson_1766019614594.mp3";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-orange transition-colors"
      >
        <span className="font-semibold text-navy">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

function LeadCaptureForm({ variant = "default", onSuccess }: { variant?: "default" | "compact"; onSuccess?: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free audio lesson.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-capture/strong-horse-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setShowSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error("Lead capture error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className={variant === "compact" ? "text-center py-4" : "bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-playfair font-bold text-navy mb-3">
          Your Free Lesson is Ready!
        </h3>
        <p className="text-gray-600 mb-6">
          Listen to the introductory lesson below and download the free PDF guide. I've also sent copies to your email.
        </p>
        
        <div className="bg-navy rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 text-white mb-3">
            <Headphones className="h-5 w-5 text-orange" />
            <span className="font-semibold">Introductory Audio Lesson</span>
          </div>
          <audio controls className="w-full" data-testid="audio-intro-lesson">
            <source src={introAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={introAudio} download="Strong-Horse-Introductory-Lesson.mp3">
            <Button className="bg-orange hover:bg-orange-hover text-white" data-testid="button-download-audio">
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
          </a>
          <Link href="/guides/strong-horse">
            <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white" data-testid="button-get-pdf">
              <FileText className="mr-2 h-4 w-4" />
              Get Free PDF Guide
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-audio-firstname-compact"
            className="border-gray-300"
          />
          <Input
            type="text"
            placeholder="Surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-audio-lastname-compact"
            className="border-gray-300"
          />
        </div>
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          data-testid="input-audio-email-compact"
          className="border-gray-300"
        />
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={isSubmitting}
          data-testid="input-audio-mobile-compact"
          className="border-gray-300"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3"
          data-testid="button-get-intro-lesson-compact"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Headphones className="mr-2 h-4 w-4" />
              Get Free Introductory Lesson
            </>
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange/10 rounded-full mb-4">
          <Headphones className="h-8 w-8 text-orange" />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-navy">
          Get Your Free Introductory Lesson
        </h2>
        <p className="text-gray-600 mt-2">
          Enter your details and I'll send you the first lesson right away.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-navy font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-audio-firstname"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-navy font-medium">
            Surname
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-audio-lastname"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-navy font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-audio-email"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-navy font-medium">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={isSubmitting}
            data-testid="input-audio-mobile"
            className="border-gray-300 focus:border-navy focus:ring-navy"
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <Mail className="h-4 w-4 text-navy mt-0.5 flex-shrink-0" />
            <span>Your details are safe with me. I'll only use them to send you helpful training tips and updates about clinics.</span>
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-all duration-300"
          data-testid="button-get-intro-lesson"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Your Lesson...
            </>
          ) : (
            <>
              <Headphones className="mr-2 h-4 w-4" />
              Get Free Introductory Lesson
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

const lessons = [
  {
    number: 1,
    title: "Understanding Why Horses Get Strong",
    description: "Learn the real reasons behind heaviness and rushing — it's not what you think.",
    duration: "12 min",
    free: true
  },
  {
    number: 2,
    title: "The Reset Before You Ride System",
    description: "A calm, repeatable warm-up that creates softness from the very first moment.",
    duration: "15 min",
    free: false
  },
  {
    number: 3,
    title: "The 5-Second Transition Method",
    description: "Quick, clear transitions that break the cycle of leaning and rushing.",
    duration: "14 min",
    free: false
  },
  {
    number: 4,
    title: "GO/WOAH: Building True Adjustability",
    description: "Exercises that teach your horse to wait and go on command — without fighting.",
    duration: "16 min",
    free: false
  },
  {
    number: 5,
    title: "Canter Confidence: Where Strong Horses Transform",
    description: "Master the gait where heaviness shows most — and becomes most fixable.",
    duration: "18 min",
    free: false
  },
  {
    number: 6,
    title: "Jumping a Strong Horse Safely",
    description: "The framework for approaching fences with balance, not force.",
    duration: "20 min",
    free: false
  }
];

export default function StrongHorseAudioCourse() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHead
        title="From Strong to Light and Soft (in No Time) - Audio Course | Dan Bizzarro Method"
        description="Transform your strong, heavy or rushing horse with this 6-lesson audio course. Learn the proven system for creating balance, softness and control — listen while you groom, drive, or prepare for your ride."
        canonical="/courses/strong-horse-audio"
      />
      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        
        {/* HERO SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-navy via-slate-800 to-navy text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  6-Lesson Audio Course
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6 leading-tight">
                  From Strong to Light and Soft <span className="text-orange">(in No Time)</span>
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  The complete audio training that transforms heavy, rushing horses into soft, balanced, rideable partners — listen while you groom, drive, or prepare for your ride.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Headphones className="h-5 w-5 text-orange" />
                    <span>6 Audio Lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-5 w-5 text-orange" />
                    <span>~90 Minutes Total</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Target className="h-5 w-5 text-orange" />
                    <span>Proven Method</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-orange">
                  <p className="text-gray-200 italic">
                    "A strong horse doesn't become light by being held. It becomes light when the communication becomes clear."
                  </p>
                  <p className="text-orange font-semibold mt-2">— Dan Bizzarro</p>
                </div>
              </div>

              <LeadCaptureForm />
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEARN */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4 text-center">
              What You'll Learn in This Course
            </h2>
            <p className="text-gray-600 text-lg text-center mb-12">
              Six lessons that take you from understanding the problem to confidently solving it — step by step.
            </p>
            
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div 
                  key={lesson.number}
                  className={`rounded-xl p-6 border ${lesson.free ? 'bg-orange/5 border-orange' : 'bg-white border-gray-200'} shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${lesson.free ? 'bg-orange text-white' : 'bg-navy/10 text-navy'}`}>
                      {lesson.free ? <Play className="h-5 w-5" /> : <span className="font-bold">{lesson.number}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-navy">
                          Lesson {lesson.number}: {lesson.title}
                        </h3>
                        {lesson.free && (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                            FREE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{lesson.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Full course coming soon. Get the free introductory lesson now to start transforming your riding today.
              </p>
            </div>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6 text-center">
              Does This Sound Like Your Horse?
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Leans heavily on your hands",
                  "Gets faster the more you try to slow down",
                  "Rushes into or away from jumps",
                  "Ignores your half-halts",
                  "Feels out of control in canter",
                  "Gets stronger when nervous or excited"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-navy font-semibold text-lg">
                  These aren't behaviour problems. They're balance problems.
                </p>
                <p className="text-gray-600 mt-2">
                  And balance problems have a simple solution — when you know how.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE TRANSFORMATION */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-10 text-center">
              What Changes When You Apply This System
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">🙋</span> For You:
                </h3>
                <div className="space-y-3">
                  {[
                    "Feel calmer and more in control",
                    "Know exactly what to do when the horse gets strong",
                    "Spend less time fighting, more time riding",
                    "Clearer, more effective aids",
                    "Confidence that comes from predictability"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="text-2xl">🐴</span> For Your Horse:
                </h3>
                <div className="space-y-3">
                  {[
                    "Softer, more relaxed neck",
                    "Lighter, more comfortable contact",
                    "Better natural balance",
                    "Quicker, clearer responses",
                    "Less rushing, leaning and pulling"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY AUDIO */}
        <section className="py-16 bg-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Headphones className="h-12 w-12 text-orange mx-auto mb-4" />
              <h2 className="text-3xl font-playfair font-bold mb-4">
                Why an Audio Course?
              </h2>
              <p className="text-gray-300 text-lg">
                Because learning happens best when it fits your life.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "While You Groom",
                  description: "Listen as you prepare your horse, so the ideas are fresh when you mount."
                },
                {
                  title: "On the Drive",
                  description: "Turn travel time into training time — arrive at the yard ready to ride."
                },
                {
                  title: "Before Your Lesson",
                  description: "Quick refresh on key concepts so you're focused and prepared."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-orange mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-orange">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
              Start Your Transformation Today
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Get the free introductory lesson and PDF guide. No payment required — just enter your details and start learning.
            </p>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <LeadCaptureForm variant="compact" />
            </div>
            <div className="mt-6">
              <Link href="/coaching/private-lessons">
                <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-orange">
                  Or Book a Private Lesson <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
              <FAQItem
                question="Is the introductory lesson really free?"
                answer="Yes, completely free. I want you to experience the quality of the teaching before you decide to continue with the full course."
              />
              <FAQItem
                question="Do I need any special equipment?"
                answer="Just something to listen on — your phone, tablet, or computer. The lessons are designed to be practical and actionable."
              />
              <FAQItem
                question="What level of rider is this for?"
                answer="Any level. If you can walk, trot and canter, you can use these techniques. The principles are the same whether you're a beginner or competing at high levels."
              />
              <FAQItem
                question="Will this work for my horse?"
                answer="Yes. Strong behaviour is a balance problem, not a personality problem. The exercises work for all horses — mares, geldings, young or experienced."
              />
              <FAQItem
                question="When will the full course be available?"
                answer="The full 6-lesson course is coming soon. Sign up for the free lesson and you'll be the first to know when it launches."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6">
              Ready to Start?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Get your free introductory lesson now. Listen today, ride better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <Button className="bg-orange hover:bg-orange-hover text-white px-8 py-6 text-lg" data-testid="button-get-free-lesson-bottom">
                  <Headphones className="mr-2 h-5 w-5" />
                  Get Free Lesson
                </Button>
              </a>
              <Link href="/guides/strong-horse">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white px-8 py-6 text-lg" data-testid="button-get-pdf-bottom">
                  <FileText className="mr-2 h-5 w-5" />
                  Get Free PDF Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
      
      <Footer />
    </>
  );
}
